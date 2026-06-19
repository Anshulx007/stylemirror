def generate_hairstyle_recommendations(
    face_shape: str,
    hair_type: str,
    gender: str
) -> list:
    """Recommend hairstyles based on face shape, hair type, and gender."""
    face_shape = face_shape.capitalize()
    hair_type = hair_type.lower()
    gender = gender.lower()
    
    # 1. Base hairstyle recommendations by face shape and gender
    if "female" in gender or "woman" in gender:
        hairstyles_by_shape = {
            "Oval": ["Long Layers with Soft Waves", "Classic Lob (Long Bob)", "Sleek Straight High Ponytail"],
            "Round": ["Side-Swept Bangs with Pixie Cut", "Long Textured Layers", "Asymmetrical Bob"],
            "Square": ["Soft Curtain Bangs with Shag Cut", "Wavy Lob with Side Part", "Wispy Layers"],
            "Heart": ["Side Part with Bouncy Curls", "Chin-Length Textured Bob", "Long Layers with Bangs"],
            "Diamond": ["Middle Part with Face-Framing Layers", "Side-Swept Lob", "Messy Updo with Tendrils"]
        }
    else:  # Male / default
        hairstyles_by_shape = {
            "Oval": ["Classic Pompadour", "Slicked Back Undercut", "Textured Crop"],
            "Round": ["High Volume Quiff", "Undercut with Pompadour", "Faux Hawk"],
            "Square": ["Classic Side Part", "Buzz Cut", "Textured Comb Over"],
            "Heart": ["Korean Fringe", "Textured Wavy Flow", "Messy Fringe with Volume"],
            "Diamond": ["Side-Swept Fringe", "Textured Crop with Mid Fade", "Modern Messy Shag"]
        }
        
    base_recs = hairstyles_by_shape.get(face_shape, hairstyles_by_shape["Oval"])
    
    # 2. Filter/Adapt based on hair type (curly, straight, wavy)
    if "curly" in hair_type:
        # Adapt names to sound suitable for curly hair
        base_recs = [r.replace("Sleek Straight", "Defined Curly").replace("Slicked Back", "Curly Fade") for r in base_recs]
        # Add a specific curly hairstyle
        if "female" in gender:
            base_recs[0] = "Voluminous Curly Shag"
        else:
            base_recs[0] = "Curly High Top with Taper"
    elif "straight" in hair_type:
        base_recs = [r.replace("Wavy", "Sleek").replace("Curly", "Straight") for r in base_recs]
        
    return base_recs
