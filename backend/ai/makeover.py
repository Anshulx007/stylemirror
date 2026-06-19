import os
import io
import uuid
import cv2
import numpy as np
from PIL import Image
from google import genai
from google.genai import types
from backend.app.core.config import settings

def apply_glow_filter(image_path: str, output_path: str):
    """Artistic OpenCV fallback filter to simulate a 'makeover' (soft glow + subtle warmth)."""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image for filter: {image_path}")
    
    # 1. Warmth adjustment (subtle orange/yellow boost)
    # Convert BGR to LAB
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    # Add small offset to b channel (yellow-blue) and a channel (red-green)
    b = cv2.add(b, 10)
    a = cv2.add(a, 5)
    lab = cv2.merge((l, a, b))
    img_warm = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
    
    # 2. Soft glow effect (blend original with a highly blurred copy)
    blur = cv2.GaussianBlur(img_warm, (25, 25), 0)
    glow = cv2.addWeighted(img_warm, 0.75, blur, 0.25, 0)
    
    # Save the result
    cv2.imwrite(output_path, glow)

def generate_identity_preserving_makeover(
    original_image_path: str,
    face_data: dict,
    recommendations: dict
) -> str:
    """Generate a makeover image using Gemini Imagen 3 if API key exists, otherwise use OpenCV filter fallback."""
    # Ensure final makeover output directory exists
    output_dir = os.path.join(settings.UPLOAD_DIR, "final_makeovers")
    os.makedirs(output_dir, exist_ok=True)
    
    makeover_id = str(uuid.uuid4())
    output_filename = f"{makeover_id}.jpg"
    output_path = os.path.join(output_dir, output_filename)
    
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("[Makeover Engine] No Gemini API key — applying local artistic glow filter fallback.")
        apply_glow_filter(original_image_path, output_path)
        return f"/uploads/final_makeovers/{output_filename}"
        
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = (
            f"A professional fashion studio portrait of the person. "
            f"They have a {face_data.get('face_shape', 'Oval')} face and a {face_data.get('skin_tone', 'Medium')} skin tone. "
            f"Their hair is styled in a {recommendations.get('hairstyle', {}).get('name', 'neat hairstyle')} ({recommendations.get('hairstyle', {}).get('description', '')}). "
            f"They are wearing: {recommendations.get('outfit', {}).get('full_outfit_description', 'fashionable outfit')}. "
            f"Makeup: {recommendations.get('makeup', {}).get('style', 'clean look')}. "
            f"High-end magazine photoshoot, soft studio lighting, clean solid background, sharp focus, hyperrealistic."
        )
        
        result = client.models.generate_images(
            model='imagen-3.0-generate-002',
            prompt=prompt,
            config=types.GenerateImagesConfig(
                number_of_images=1,
                output_mime_type="image/jpeg",
                aspect_ratio="1:1"
            )
        )
        
        if not result.generated_images:
            raise RuntimeError("Imagen 3 API returned no images.")
            
        generated_image_bytes = result.generated_images[0].image.image_bytes
        image = Image.open(io.BytesIO(generated_image_bytes))
        image.save(output_path, "JPEG")
        
        return f"/uploads/final_makeovers/{output_filename}"
        
    except Exception as e:
        print(f"[Makeover Engine] Gemini Imagen 3 error: {e} — falling back to local filter.")
        apply_glow_filter(original_image_path, output_path)
        return f"/uploads/final_makeovers/{output_filename}"
