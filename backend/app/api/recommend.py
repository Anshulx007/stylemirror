import uuid
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models.image import ImageModel
from backend.database.models.look import LookModel
from backend.schemas.recommendation_schema import RecommendationRequest, RecommendationResponse
from backend.services.recommendation.recommendation_service import generate_complete_recommendation

router = APIRouter()

@router.post("/recommend", response_model=RecommendationResponse)
async def recommend_style(payload: RecommendationRequest, db: Session = Depends(get_db)):
    # 1. Fetch image analysis from database
    db_image = db.query(ImageModel).filter(ImageModel.id == payload.image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image analysis record not found. Upload and analyze an image first.")
        
    # 2. Extract features from face/style analysis results
    face_data = db_image.face_data or {}
    style_data = db_image.style_data or {}
    
    face_shape = face_data.get("face_shape", "Oval")
    skin_tone = style_data.get("skin_tone", "Medium")
    hair_type = face_data.get("hair_type", "wavy")
    current_style = style_data.get("current_style", "casual")
    
    # 3. Call the consolidated recommendation service
    try:
        recs = generate_complete_recommendation(
            face_shape=face_shape,
            skin_tone=skin_tone,
            hair_type=hair_type,
            current_style=current_style,
            occasion=payload.occasion,
            season=payload.season,
            budget=payload.budget,
            gender=payload.gender or "male"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation pipeline failed: {str(e)}")
        
    # 4. Save style look to database
    recommendation_id = str(uuid.uuid4())
    try:
        db_look = LookModel(
            id=recommendation_id,
            image_id=payload.image_id,
            occasion=payload.occasion,
            season=payload.season,
            budget=payload.budget,
            style_input=payload.style_input,
            recommendations=recs
        )
        db.add(db_look)
        db.commit()
        db.refresh(db_look)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save recommendation to database: {str(e)}")
        
    # 5. Build response mapping schema fields
    return RecommendationResponse(
        recommendation_id=recommendation_id,
        image_id=payload.image_id,
        outfit=recs.get("outfit", {}),
        hairstyles=recs.get("hairstyles", []),
        accessories=recs.get("accessories", {}),
        palette=recs.get("palette", {}),
        makeup=recs.get("makeup", {})
    )
