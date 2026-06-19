from backend.services.recommendation.outfit_service import generate_outfit_recommendations
from backend.services.recommendation.hairstyle_service import generate_hairstyle_recommendations
from backend.services.recommendation.accessory_service import get_accessory_recommendations
from backend.services.recommendation.color_palette_engine import generate_color_palette
from backend.services.recommendation.makeup_service import get_makeup_recommendations

def generate_complete_recommendation(
    face_shape: str,
    skin_tone: str,
    hair_type: str,
    current_style: str,
    occasion: str,
    season: str,
    budget: float,
    gender: str = "male"
) -> dict:
    """Consolidated recommendation generator pulling together all Phase 3 engines."""
    
    outfit = generate_outfit_recommendations(
        face_shape=face_shape,
        skin_tone=skin_tone,
        current_style=current_style,
        occasion=occasion,
        season=season,
        budget=budget
    )
    
    hairstyles = generate_hairstyle_recommendations(
        face_shape=face_shape,
        hair_type=hair_type,
        gender=gender
    )
    
    accessories = get_accessory_recommendations(
        face_shape=face_shape,
        skin_tone=skin_tone,
        gender=gender
    )
    
    palette = generate_color_palette(
        skin_tone=skin_tone
    )
    
    makeup = get_makeup_recommendations(
        skin_tone=skin_tone,
        occasion=occasion,
        gender=gender
    )
    
    return {
        "outfit": outfit,
        "hairstyles": hairstyles,
        "accessories": accessories,
        "palette": palette,
        "makeup": makeup
    }
