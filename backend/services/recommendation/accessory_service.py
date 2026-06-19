def get_accessory_recommendations(
    face_shape: str,
    skin_tone: str,
    gender: str = "male"
) -> dict:
    """Recommend accessories like watch, belt, and glasses based on user features."""
    face_shape = face_shape.capitalize()
    skin_tone = skin_tone.lower()
    
    # 1. Determine metals and colors based on skin tone
    if skin_tone == "cool":
        watch_material = "Silver Watch with Blue Dial"
        belt_buckle = "Silver-buckle Black Leather Belt"
    elif skin_tone == "warm":
        watch_material = "Gold/Rose Gold Watch with Brown Leather Strap"
        belt_buckle = "Brass-buckle Tan Leather Belt"
    else:  # Neutral
        watch_material = "Gunmetal Grey Watch with Minimalist Face"
        belt_buckle = "Brushed Metal Buckle Dark Brown Leather Belt"
        
    # 2. Recommend glasses shape based on face shape (opposite of face shape lines)
    glasses_by_shape = {
        "Round": "Square Acetate Frame Glasses",
        "Square": "Round Metal Frame Glasses",
        "Oval": "Classic Wayfarer Style Glasses",
        "Heart": "Clubmaster or Cat-Eye Glasses",
        "Diamond": "Aviator or Rimless Glasses"
    }
    
    selected_glasses = glasses_by_shape.get(face_shape, "Classic Rectangular Glasses")
    
    return {
        "watch": watch_material,
        "belt": belt_buckle,
        "glasses": selected_glasses
    }
