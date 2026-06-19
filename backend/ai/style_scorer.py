import json
from google import genai
from google.genai import types
from backend.app.core.config import settings
from pathlib import Path

def get_fallback_style_score():
    """Fallback style score when Gemini fails or API key is missing."""
    return {
        "fashion_score": 7.4,
        "cohesion": 7.5,
        "color_coordination": 8.0,
        "fit": 7.0,
        "grooming": 7.5,
        "feedback": "Outfit fits well and colors are nicely coordinated, but adding accessories would enhance the overall aesthetic."
    }

def score_style(image_path: str) -> dict:
    """Analyze the fashion score of the person in the image using Gemini Vision."""
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("[Style Scorer] No Gemini API key — returning fallback score.")
        return get_fallback_style_score()

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        img_bytes = Path(image_path).read_bytes()
        mime = "image/jpeg"
        if image_path.lower().endswith(".png"):
            mime = "image/png"
            
        prompt = (
            "Evaluate the styling and fashion score of the person in this image. "
            "Give scores from 0.0 to 10.0 for cohesion, color_coordination, fit, and grooming, "
            "and compute a final overall fashion_score. "
            "Respond ONLY with a JSON object — no markdown fences, no extra text.\n"
            "Schema:\n"
            "{\n"
            '  "fashion_score": 7.4,\n'
            '  "cohesion": 7.5,\n'
            '  "color_coordination": 8.0,\n'
            '  "fit": 7.0,\n'
            '  "grooming": 7.5,\n'
            '  "feedback": "Detailed constructive feedback string"\n'
            "}"
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=img_bytes, mime_type=mime),
                        types.Part.from_text(text=prompt),
                    ],
                )
            ],
        )

        text = response.text.strip()
        
        # Strip markdown code fences if present
        if text.startswith("```"):
            lines = text.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            text = "\n".join(lines).strip()
        if text.startswith("json"):
            text = text[4:].strip()

        return json.loads(text)

    except Exception as e:
        print(f"[Style Scorer] Gemini scoring error: {e} — returning fallback.")
        return get_fallback_style_score()
