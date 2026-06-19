import json
import base64
from pathlib import Path
from google import genai
from google.genai import types
from backend.app.core.config import settings


def get_fallback_style_analysis():
    """Fallback response when Gemini API key is missing or the call fails."""
    return {
        "current_style": "Casual Smart",
        "fashion_score": 6.5,
        "strengths": [
            "Clean and minimalist clothing choice",
            "Good coordination of neutral tones",
        ],
        "improvements": [
            "Adding layers could elevate the overall look",
            "Better choice of accessories would add personality",
        ],
        "aesthetic_keywords": ["Minimalist", "Normcore", "Clean"],
    }


def analyze_style(image_path: str) -> dict:
    """Analyze the fashion/style of the person in *image_path* via Gemini."""
    if (
        not settings.GEMINI_API_KEY
        or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE"
    ):
        print("[Style Analyzer] No Gemini API key — returning fallback analysis.")
        return get_fallback_style_analysis()

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)

        # Read image bytes for inline upload
        img_bytes = Path(image_path).read_bytes()
        mime = "image/jpeg"
        if image_path.lower().endswith(".png"):
            mime = "image/png"

        prompt = (
            "Analyze the styling/fashion of the person in this image. "
            "Respond ONLY with a JSON object — no markdown fences, no extra text. "
            "Schema:\n"
            "{\n"
            '  "current_style": "Casual/Formal/Sporty/Traditional/etc.",\n'
            '  "fashion_score": 7.5,\n'
            '  "strengths": ["list of style strengths"],\n'
            '  "improvements": ["list of areas to improve"],\n'
            '  "aesthetic_keywords": ["keywords describing aesthetic"]\n'
            "}\n"
            "fashion_score must be a number between 0 and 10."
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
        print(f"[Style Analyzer] Gemini error: {e}")
        return get_fallback_style_analysis()
