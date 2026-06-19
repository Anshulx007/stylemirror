import json
from google import genai
from google.genai import types
from backend.app.core.config import settings

def get_fallback_recommendations(face_data, style_data, preferences):
    """Generate robust fallback recommendations based on face shape, skin tone, and preferences."""
    occasion = preferences.get("occasion", "Casual").lower()
    budget = preferences.get("budget", 5000)
    face_shape = face_data.get("face_shape", "Oval")
    skin_tone = face_data.get("skin_tone", "Medium")

    # Tailor outfit based on occasion and budget
    if "wedding" in occasion or "festive" in occasion or "traditional" in occasion:
        top_item = "Embellished Kurta" if budget < 5000 else "Designer Sherwani / Lehenga"
        bottom_item = "Churidar" if budget < 5000 else "Premium Silk Dhoti / Lehenga Skirt"
        price_range = f"₹2,000 - ₹{budget}"
        why = f"Traditional attire suits the festive/wedding occasion perfectly, and the colors harmonize well with your {skin_tone.lower()} skin tone."
    elif "formal" in occasion or "interview" in occasion or "office" in occasion:
        top_item = "Classic Cotton Oxford Shirt"
        bottom_item = "Slim-fit Chinos"
        price_range = f"₹1,500 - ₹{min(budget, 3000)}"
        why = f"A clean, structured formal look creates a professional impression and complements your face shape."
    else:  # Casual/Party
        top_item = "Oversized Solid Tee"
        bottom_item = "Distressed Denim Jeans"
        price_range = f"₹1,000 - ₹{min(budget, 2500)}"
        why = f"Comfortable and stylish casual outfit suitable for daily wear."

    # Hairstyle recommendations based on face shape
    hair_styles = {
        "Oval": {
            "name": "Classic Pompadour or Textured Crop",
            "desc": "Slightly swept back with volume on top to highlight symmetric features.",
            "why": "Oval faces are highly versatile. Keeping hair off the forehead maintains clean lines.",
        },
        "Round": {
            "name": "Undercut with Quiff",
            "desc": "Short on the sides, high on top to add vertical height.",
            "why": "Adds length to the face, minimizing the roundness and giving a more structured look.",
        },
        "Square": {
            "name": "Textured Comb Over or Side Part",
            "desc": "Soft layers on top with neat sides to soften the sharp jawline.",
            "why": "Softens the sharp angles of a square jaw while retaining a masculine/strong profile.",
        },
        "Heart": {
            "name": "Medium Length Flow or Textured Fringe",
            "desc": "Longer top layers swept to the side to balance a wider forehead.",
            "why": "Balances the forehead width and draws attention down toward the eyes.",
        },
        "Diamond": {
            "name": "Messy Fringe or Side Sweep",
            "desc": "Added volume on the sides and top to add width to the forehead and jaw.",
            "why": "Softens the cheekbones and adds width to the narrower forehead and chin.",
        }
    }
    
    selected_hair = hair_styles.get(face_shape, hair_styles["Oval"])

    # Makeup based on skin tone
    makeup_palettes = {
        "Fair": ["Rose Pink", "Soft Peach", "Cool Taupe"],
        "Medium": ["Warm Coral", "Terracotta", "Golden Bronze"],
        "Wheatish": ["Dusty Rose", "Warm Gold", "Amber"],
        "Dark": ["Deep Plum", "Copper", "Rich Bronze"],
        "Deep": ["Berry", "Chocolate Gold", "Deep Violet"]
    }
    selected_makeup_palette = makeup_palettes.get(skin_tone, makeup_palettes["Medium"])

    return {
        "outfit": {
            "top": {
                "item": top_item,
                "color": "Navy Blue" if skin_tone in ["Fair", "Medium"] else "Mustard Yellow",
                "price_range": price_range,
                "where_to_buy": "Myntra / Zara"
            },
            "bottom": {
                "item": bottom_item,
                "color": "Beige" if skin_tone in ["Fair", "Medium"] else "Charcoal Grey",
                "price_range": "₹1,200 - ₹3,000",
                "where_to_buy": "AJIO / H&M"
            },
            "full_outfit_description": f"A stylish combination featuring a {top_item} paired with {bottom_item}.",
            "why_this_works": why
        },
        "hairstyle": {
            "name": selected_hair["name"],
            "description": selected_hair["desc"],
            "suits_face_shape_because": selected_hair["why"],
            "maintenance_level": "Medium",
            "reference_style": "Classic Modern Look"
        },
        "makeup": {
            "style": "Minimalist Glow" if "casual" in occasion else "Dewy Glam",
            "key_products": ["Tinted Moisturizer", "Lip Stain", "Highlighter"],
            "color_palette": selected_makeup_palette,
            "application_tips": "Focus on enhancing natural features. Use warm tones for a sun-kissed finish."
        },
        "accessories": [
            {
                "item": "Minimalist Analog Watch",
                "type": "Wristwear",
                "color": "Silver" if skin_tone in ["Fair", "Deep"] else "Rose Gold",
                "price_range": "₹1,500 - ₹3,500"
            },
            {
                "item": "Classic Sunglasses",
                "type": "Eyewear",
                "color": "Black",
                "price_range": "₹1,000 - ₹2,000"
            }
        ],
        "footwear": {
            "item": "Loafers" if "formal" in occasion or "wedding" in occasion else "Clean White Sneakers",
            "color": "Tan Brown" if "formal" in occasion or "wedding" in occasion else "White",
            "price_range": "₹1,800 - ₹4,000"
        },
        "color_palette": {
            "primary": ["Navy Blue", "Olive Green"],
            "accent": ["Mustard", "Coral"],
            "avoid": ["Neon Green", "Washed-out Grey"],
            "reasoning": f"Warm and earthy colors match well with your {skin_tone.lower()} skin tone, creating a vibrant yet balanced contrast."
        },
        "suggested_fashion_score": min(style_data.get("fashion_score", 6.5) + 1.5, 9.5),
        "overall_styling_advice": "Focus on the fit of the clothing. Tailored shoulders and the right sleeve length make inexpensive outfits look premium."
    }

def generate_recommendations(face_data: dict, style_data: dict, preferences: dict) -> dict:
    """Generate recommendations via Gemini API or fallback."""
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        print("[Fashion Engine] No Gemini API key — returning fallback recommendations.")
        return get_fallback_recommendations(face_data, style_data, preferences)

    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        prompt = (
            "You are StyleMirror AI, an expert fashion consultant. "
            "Generate detailed fashion recommendations based on the following user profile and preferences:\n\n"
            f"User Profile:\n"
            f"- Face Shape: {face_data.get('face_shape', 'Oval')}\n"
            f"- Skin Tone: {face_data.get('skin_tone', 'Medium')}\n"
            f"- Current Style Score: {style_data.get('fashion_score', 6.5)}/10\n"
            f"- Current Aesthetic: {style_data.get('current_style', 'Casual')}\n\n"
            f"Preferences:\n"
            f"- Occasion: {preferences.get('occasion', 'Casual')}\n"
            f"- Season: {preferences.get('season', 'Summer')}\n"
            f"- Budget: INR {preferences.get('budget', 5000)}\n"
            f"- Style Input: {preferences.get('style_input', 'Simple and clean')}\n\n"
            "Respond ONLY with a valid JSON object matching the following schema. "
            "Do not include markdown code fences (like ```json), and do not add any conversational text before or after the JSON.\n\n"
            "Schema:\n"
            "{\n"
            '  "outfit": {\n'
            '    "top": {"item": "String", "color": "String", "price_range": "String", "where_to_buy": "String"},\n'
            '    "bottom": {"item": "String", "color": "String", "price_range": "String", "where_to_buy": "String"},\n'
            '    "full_outfit_description": "String detailing the combined outfit look",\n'
            '    "why_this_works": "Explanation of why it fits user skin tone/profile"\n'
            "  },\n"
            '  "hairstyle": {\n'
            '    "name": "String",\n'
            '    "description": "String detailing the cut/style",\n'
            '    "suits_face_shape_because": "Why it fits this face shape",\n'
            '    "maintenance_level": "Low/Medium/High",\n'
            '    "reference_style": "String description of famous personality or look"\n'
            "  },\n"
            '  "makeup": {\n'
            '    "style": "String",\n'
            '    "key_products": ["Product 1", "Product 2"],\n'
            '    "color_palette": ["Color 1", "Color 2"],\n'
            '    "application_tips": "String"\n'
            "  },\n"
            '  "accessories": [\n'
            '    {"item": "String", "type": "String", "color": "String", "price_range": "String"}\n'
            "  ],\n"
            '  "footwear": {"item": "String", "color": "String", "price_range": "String"},\n'
            '  "color_palette": {\n'
            '    "primary": ["Color 1", "Color 2"],\n'
            '    "accent": ["Color 1", "Color 2"],\n'
            '    "avoid": ["Color 1", "Color 2"],\n'
            '    "reasoning": "String"\n'
            "  },\n"
            '  "suggested_fashion_score": Float,\n'
            '  "overall_styling_advice": "String"\n'
            "}\n"
        )

        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
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
        print(f"[Fashion Engine] Gemini recommendation error: {e} — returning fallback.")
        return get_fallback_recommendations(face_data, style_data, preferences)
