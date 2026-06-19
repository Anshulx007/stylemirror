def generate_outfit_recommendations(
    face_shape: str,
    skin_tone: str,
    current_style: str,
    occasion: str,
    season: str,
    budget: float
) -> dict:
    """Recommend tops, bottoms, and footwear based on user features and preferences."""
    # Standardize inputs
    occasion = occasion.lower()
    season = season.lower()
    skin_tone = skin_tone.lower()
    
    # 1. Base suggestions depending on occasion
    if "wedding" in occasion or "festive" in occasion or "traditional" in occasion:
        if budget < 3000:
            tops = ["Cotton Kurta with Chikankari embroidery", "Mandarin collar short Kurta"]
            bottoms = ["Cotton pyjamas", "Neat tapered Chinos"]
            footwear = ["Juttis", "Tan leather sandals"]
        elif budget < 7000:
            tops = ["Silk blend Kurta with Nehru jacket", "Asymmetrical drape Kurta"]
            bottoms = ["Churidar pyjamas", "Aligarh style pajamas"]
            footwear = ["Premium Kolhapuris", "Leather Juttis"]
        else:
            tops = ["Embellished Sherwani", "Designer Bandhgala jacket with silk Kurta"]
            bottoms = ["Slim-fit cowl trousers", "Premium silk Dhoti pants"]
            footwear = ["Handcrafted Mojaris", "Premium monk-strap dress shoes"]
            
    elif "formal" in occasion or "interview" in occasion or "office" in occasion:
        tops = ["Crisp White Oxford button-down shirt", "Light Blue structured dress shirt"]
        bottoms = ["Charcoal Grey slim-fit trousers", "Navy Blue tailored Chinos"]
        footwear = ["Dark Brown Leather Oxford shoes", "Tan double monk straps"]
        if budget > 5000:
            tops.append("Tailored Navy Blazer")
            
    elif "party" in occasion or "clubbing" in occasion or "dinner" in occasion:
        tops = ["Black satin button-up shirt", "Textured Cuban collar shirt"]
        bottoms = ["Black slim-fit denim", "Grey ankle-length trousers"]
        footwear = ["Black Chelsea boots", "Suede loafers"]
        
    else:  # Casual / Daily Wear
        tops = ["Minimalist Olive Green crewneck Tee", "Beige oversized linen shirt"]
        bottoms = ["Light-wash relaxed fit denim", "Off-white cotton drawstring shorts"]
        footwear = ["Minimalist white leather sneakers", "Sporty running trainers"]

    # 2. Adjust colors based on skin tone rules
    # Cool undertones look best in cool/deep colors. Warm looks best in warm/earthy colors.
    if skin_tone == "cool":
        # Introduce cool/jewel tones to tops
        tops = [t.replace("Olive Green", "Emerald Green").replace("Beige", "Cool Grey") for t in tops]
    elif skin_tone == "warm":
        # Introduce warm/earthy tones
        tops = [t.replace("White", "Off-White/Ivory").replace("Light Blue", "Warm Sand") for t in tops]

    # 3. Filter/Adjust list size to ensure neat outputs
    return {
        "tops": tops[:3],
        "bottoms": bottoms[:3],
        "footwear": footwear[:3]
    }
