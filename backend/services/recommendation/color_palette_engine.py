def generate_color_palette(skin_tone: str) -> dict:
    """Generate color palette recommendations (best colors to wear and colors to avoid) based on skin tone."""
    skin_tone = skin_tone.lower()
    
    # Season-based/Undertone color coordination rules
    if skin_tone == "cool":
        best_colors = ["navy blue", "emerald green", "cool grey", "lavender", "burgundy", "white"]
        avoid = ["neon yellow", "mustard", "orange", "warm brown"]
    elif skin_tone == "warm":
        best_colors = ["olive green", "warm sand", "mustard yellow", "terracotta", "cream", "coral"]
        avoid = ["neon pink", "stark white", "cool grey", "icy blue"]
    else:  # Neutral
        best_colors = ["navy blue", "white", "olive green", "dusty rose", "charcoal", "taupe"]
        avoid = ["neon yellow", "neon green", "overly saturated primary colors"]
        
    return {
        "best_colors": best_colors,
        "avoid": avoid
    }
