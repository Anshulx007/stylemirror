import cv2
import numpy as np
import mediapipe as mp
from pathlib import Path
from backend.ai.face_analysis import MODEL_PATH, _lm_to_px

def get_skin_undertone(rgb_color):
    """Classify undertone as warm, cool, or neutral based on RGB values."""
    r, g, b = rgb_color
    
    # Calculate simple color ratios for skin undertone
    # Warm skin tones have a higher yellow component (red + green) relative to blue
    # Cool skin tones have more blue/pink undertone
    if g == 0:
        return "neutral"
        
    rg_ratio = r / g
    rb_ratio = r / b if b > 0 else 2.0
    
    # Heuristics for skin undertone
    if rg_ratio > 1.35 and rb_ratio > 1.5:
        return "warm"
    elif rg_ratio < 1.25 or rb_ratio < 1.3:
        return "cool"
    else:
        return "neutral"

def analyze_color(image_path: str, landmarks=None) -> dict:
    """Analyze the skin tone undertone (warm/cool/neutral) from the image."""
    image_bgr = cv2.imread(image_path)
    if image_bgr is None:
        raise ValueError(f"Could not read image from: {image_path}")
        
    h, w = image_bgr.shape[:2]
    
    # If landmarks are not provided, detect them
    if landmarks is None:
        from mediapipe.tasks.python import BaseOptions
        from mediapipe.tasks.python.vision import FaceLandmarker, FaceLandmarkerOptions
        
        image_rgb = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image_rgb)
        
        options = FaceLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=MODEL_PATH),
            num_faces=1,
        )
        
        with FaceLandmarker.create_from_options(options) as landmarker:
            result = landmarker.detect(mp_image)
            if result.face_landmarks:
                landmarks = result.face_landmarks[0]
                
    # Default fallback color if no face is detected
    default_rgb = (190, 155, 125)
    
    if landmarks is None:
        return {
            "skin_tone": "neutral",
            "dominant_rgb": list(default_rgb),
            "undertone": "neutral"
        }
        
    # Sample pixels from the cheeks
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
        return {
            "skin_tone": "neutral",
            "dominant_rgb": list(default_rgb),
            "undertone": "neutral"
        }
        
    pixels = np.array(pixels, dtype=np.float32)
    # Apply KMeans to get dominant color
    criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
    _, _, centers = cv2.kmeans(pixels, 2, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
    
    # Pick the cluster representing skin
    best_center = centers[0]
    best_ratio = 0.0
    for center in centers:
        b, g, r = center
        if b > 0:
            ratio = r / b
            brightness = (r + g + b) / 3
            if ratio > best_ratio and 50 < brightness < 240:
                best_ratio = ratio
                best_center = center
                
    rgb = (int(best_center[2]), int(best_center[1]), int(best_center[0]))
    undertone = get_skin_undertone(rgb)
    
    return {
        "skin_tone": undertone,
        "dominant_rgb": list(rgb),
        "undertone": undertone
    }
