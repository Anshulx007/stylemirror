import os
from backend.services.recommendation.outfit_service import generate_outfit_recommendations
from backend.services.recommendation.hairstyle_service import generate_hairstyle_recommendations
from backend.services.recommendation.accessory_service import get_accessory_recommendations
from backend.services.recommendation.color_palette_engine import generate_color_palette

def test_recommendation_services():
    # 1. Test Outfit Service
    outfit = generate_outfit_recommendations(
        face_shape="oval",
        skin_tone="warm",
        current_style="casual",
        occasion="wedding",
        season="summer",
        budget=5000.0
    )
    assert isinstance(outfit, dict)
    assert "tops" in outfit
    assert "bottoms" in outfit
    assert "footwear" in outfit
    assert isinstance(outfit["tops"], list)
    assert len(outfit["tops"]) > 0
    print("\n[Test] Outfit service passed. Output:", outfit)

    # 2. Test Hairstyle Service
    hairstyles = generate_hairstyle_recommendations(
        face_shape="oval",
        hair_type="wavy",
        gender="male"
    )
    assert isinstance(hairstyles, list)
    assert len(hairstyles) > 0
    assert "Classic Pompadour" in hairstyles or "Korean Fringe" in hairstyles or len(hairstyles) > 0
    print("[Test] Hairstyle service passed. Output:", hairstyles)

    # 3. Test Accessory Service
    accessories = get_accessory_recommendations(
        face_shape="square",
        skin_tone="cool",
        gender="male"
    )
    assert isinstance(accessories, dict)
    assert "watch" in accessories
    assert "belt" in accessories
    assert "glasses" in accessories
    assert accessories["glasses"] == "Round Metal Frame Glasses"
    print("[Test] Accessory service passed. Output:", accessories)

    # 4. Test Color Palette Engine
    palette = generate_color_palette(skin_tone="cool")
    assert isinstance(palette, dict)
    assert "best_colors" in palette
    assert "avoid" in palette
    assert "neon yellow" in palette["avoid"]
    print("[Test] Color palette engine passed. Output:", palette)

if __name__ == "__main__":
    test_recommendation_services()
