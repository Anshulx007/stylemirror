import cv2
import numpy as np
import mediapipe as mp
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import (
    FaceLandmarker,
    FaceLandmarkerOptions,
    FaceLandmarkerResult,
)
from pathlib import Path

# Path to the downloaded .task model
MODEL_PATH = str(Path(__file__).resolve().parent / "models" / "face_landmarker.task")

# Reference RGB skin tones (for classification)
SKIN_TONES = {
    "Fair": (225, 195, 175),
    "Medium": (190, 155, 125),
    "Wheatish": (165, 125, 95),
    "Dark": (120, 85, 65),
    "Deep": (80, 55, 40),
}


def _color_distance(c1, c2):
    """Euclidean distance between two RGB tuples."""
    return np.sqrt(sum((a - b) ** 2 for a, b in zip(c1, c2)))


def classify_skin_tone(rgb):
    """Map an RGB tuple to the closest named skin-tone category."""
    best, best_dist = "Medium", float("inf")
    for name, ref in SKIN_TONES.items():
        d = _color_distance(rgb, ref)
        if d < best_dist:
            best, best_dist = name, d
    return best


# ── Landmark helpers ────────────────────────────────────────────────

def _lm_to_px(landmark, w, h):
    """Convert a normalised landmark to pixel coords (x, y)."""
    return int(landmark.x * w), int(landmark.y * h)


def get_bounding_box(landmarks, w, h):
    """Axis-aligned bounding box from a list of NormalizedLandmark."""
    xs = [int(lm.x * w) for lm in landmarks]
    ys = [int(lm.y * h) for lm in landmarks]
    xmin, xmax = max(0, min(xs)), min(w, max(xs))
    ymin, ymax = max(0, min(ys)), min(h, max(ys))
    return {"xmin": xmin, "ymin": ymin, "width": xmax - xmin, "height": ymax - ymin}


def classify_face_shape(landmarks, w, h):
    """Classify face shape based on facial-landmark ratios.

    Landmark indices used (468-point mesh):
      10  – top of forehead
      152 – chin
      103 / 332 – forehead width
      234 / 454 – cheekbone width
      172 / 397 – jaw width
    """
    def pt(idx):
        return np.array(_lm_to_px(landmarks[idx], w, h), dtype=float)

    p_top        = pt(10)
    p_chin       = pt(152)
    p_forehead_l = pt(103)
    p_forehead_r = pt(332)
    p_cheek_l    = pt(234)
    p_cheek_r    = pt(454)
    p_jaw_l      = pt(172)
    p_jaw_r      = pt(397)

    face_length     = np.linalg.norm(p_top - p_chin)
    forehead_width  = np.linalg.norm(p_forehead_l - p_forehead_r)
    cheekbone_width = np.linalg.norm(p_cheek_l - p_cheek_r)
    jaw_width       = np.linalg.norm(p_jaw_l - p_jaw_r)

    if cheekbone_width == 0:
        return "Oval"

    r1 = jaw_width / cheekbone_width
    r2 = forehead_width / cheekbone_width
    r3 = face_length / cheekbone_width

    if r1 < 0.75 and r3 > 1.35:
        return "Oval"
    elif r1 > 0.82 and r3 < 1.25:
        return "Round"
    elif r1 > 0.82 and r3 >= 1.25:
        return "Square"
    elif r2 > 0.90 and r1 < 0.78:
        return "Heart"
    elif r2 < 0.85 and cheekbone_width > forehead_width and cheekbone_width > jaw_width:
        return "Diamond"
    else:
        if r3 > 1.3:
            return "Oval"
        elif r1 > 0.8:
            return "Square" if r3 > 1.2 else "Round"
        else:
            return "Heart" if r2 > r1 else "Diamond"


def extract_skin_tone(image_bgr: np.ndarray, landmarks, w, h):
    """Extract dominant skin tone via KMeans on cheek-region pixels."""
    cheek_indices = [117, 123, 228, 346, 352, 448]
    pixels = []

    for idx in cheek_indices:
        x, y = _lm_to_px(landmarks[idx], w, h)
        for dy in range(-2, 3):
            for dx in range(-2, 3):
                px, py = x + dx, y + dy
                if 0 <= px < w and 0 <= py < h:
                    pixels.append(image_bgr[py, px])

    if not pixels:
        return (190, 155, 125), "Medium"

    pixels = np.array(pixels, dtype=np.float32)

    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    _, _, centers = cv2.kmeans(pixels, 2, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

    # Pick the cluster whose colour is most "skin-like"
    best_center, best_ratio = centers[0], 0.0
    for center in centers:
        b, g, r = center
        if b > 0:
            ratio = r / b
            brightness = (r + g + b) / 3
            if ratio > best_ratio and 50 < brightness < 240:
                best_ratio = ratio
                best_center = center

    rgb = (int(best_center[2]), int(best_center[1]), int(best_center[0]))
    return rgb, classify_skin_tone(rgb)


# ── Main entry point ────────────────────────────────────────────────

def analyze_face_image(image_path: str) -> dict:
    """Run full face analysis on an image and return a result dict."""
    image_bgr = cv2.imread(image_path)
    if image_bgr is None:
        raise ValueError(f"Could not read image from: {image_path}")

    h, w = image_bgr.shape[:2]

    # Convert to MediaPipe Image
    image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)

    # Create and run FaceLandmarker
    options = FaceLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=MODEL_PATH),
        output_face_blendshapes=False,
        output_facial_transformation_matrixes=False,
        num_faces=1,
    )

    with FaceLandmarker.create_from_options(options) as landmarker:
        result: FaceLandmarkerResult = landmarker.detect(mp_image)

    if not result.face_landmarks:
        return {
            "face_detected": False,
            "face_shape": "Unknown",
            "skin_tone": "Medium",
            "skin_tone_rgb": [190, 155, 125],
            "hair_type": "wavy",
            "bounding_box": None,
            "description": "No face detected in the image. Default profile applied.",
        }


    landmarks = result.face_landmarks[0]  # first face

    face_shape = classify_face_shape(landmarks, w, h)
    rgb, skin_tone = extract_skin_tone(image_bgr, landmarks, w, h)
    bbox = get_bounding_box(landmarks, w, h)

    description = (
        f"A person with a {face_shape.lower()} face shape, "
        f"a {skin_tone.lower()} skin tone, and wavy hair."
    )

    return {
        "face_detected": True,
        "face_shape": face_shape,
        "skin_tone": skin_tone,
        "skin_tone_rgb": list(rgb),
        "hair_type": "wavy",
        "bounding_box": bbox,
        "description": description,
    }

