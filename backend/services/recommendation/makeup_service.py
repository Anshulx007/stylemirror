def get_makeup_recommendations(
    skin_tone: str,
    occasion: str,
    gender: str = "male"
) -> dict:
    """Recommend makeup based on skin tone, occasion, and gender."""
    skin_tone = skin_tone.lower()
    occasion = occasion.lower()
    gender = gender.lower()
    
    # 1. Male/Grooming vs Female/Makeup distinctions
    if "female" in gender or "woman" in gender:
        # Determine Look style
        if "wedding" in occasion or "festive" in occasion:
            look = "Traditional Glam"
            eye_style = "Metallic Gold Shimmer with Winged Liner"
        elif "party" in occasion or "dinner" in occasion:
            look = "Dewy Night Glam"
            eye_style = "Soft Smokey Eye"
        elif "formal" in occasion or "office" in occasion:
            look = "Classic Professional"
            eye_style = "Neutral Nude Matte"
        else:
            look = "No-Makeup Natural"
            eye_style = "Soft Kohl Liner"
            
        # Lip color based on skin tone
        lip_colors = {
            "fair": "Soft Rose Pink" if "casual" in occasion else "Classic Crimson Red",
            "medium": "Warm Coral" if "casual" in occasion else "Rich Terracotta",
            "wheatish": "Dusty Mauve" if "casual" in occasion else "Deep Ruby Red",
            "dark": "Nude Peach" if "casual" in occasion else "Warm Plum",
            "deep": "Glossy Berry" if "casual" in occasion else "Deep Cocoa Burgundy"
        }
        lip_color = lip_colors.get(skin_tone, "Rose Pink")
        
        # Foundation shade recommendation
        foundations = {
            "fair": "Porcelain / Light Ivory",
            "medium": "Warm Beige",
            "wheatish": "Honey / Natural Tan",
            "dark": "Golden Amber",
            "deep": "Rich Espresso"
        }
        foundation = foundations.get(skin_tone, "Natural Beige")
        
    else:  # Male / Grooming focus
        if "wedding" in occasion or "festive" in occasion:
            look = "Festive Grooming"
            lip_color = "Nourishing Matte Lip Balm"
            eye_style = "Groomed Eyebrows (Tamed & Shaped)"
        elif "formal" in occasion or "office" in occasion:
            look = "Clean Professional Grooming"
            lip_color = "Hydrating Clear Lip Balm"
            eye_style = "None"
        else:
            look = "Minimalist Grooming"
            lip_color = "Clear Lip Balm"
            eye_style = "None"
            
        # Face foundation/concealer suggestion based on skin tone
        foundations = {
            "fair": "Anti-Shine Moisturizer (Light)",
            "medium": "Anti-Shine Mattifying Gel (Medium)",
            "wheatish": "Tinted Sunscreen (Natural Bronze)",
            "dark": "Matte Finish Moisturizer (Deep)",
            "deep": "Oil-Control Hydrator (Espresso)"
        }
        foundation = foundations.get(skin_tone, "Anti-Shine Mattifying Gel")
        
    return {
        "look": look,
        "lip_color": lip_color,
        "eye_style": eye_style,
        "foundation": foundation
    }
