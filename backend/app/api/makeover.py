import os
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models.image import ImageModel
from backend.database.models.look import LookModel
from backend.schemas.look_schema import MakeoverRequest, MakeoverResponse
from backend.ai.makeover import generate_identity_preserving_makeover
from backend.app.core.config import settings

router = APIRouter()

@router.post("/makeover", response_model=MakeoverResponse)
async def create_makeover(payload: MakeoverRequest, db: Session = Depends(get_db)):
    # 1. Fetch look/recommendation record
    db_look = db.query(LookModel).filter(LookModel.id == payload.recommendation_id).first()
    if not db_look:
        raise HTTPException(status_code=404, detail="Recommendation record not found.")
        
    # 2. Fetch original image record
    db_image = db.query(ImageModel).filter(ImageModel.id == db_look.image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Original image analysis record not found.")
        
    # 3. Construct original image absolute path
    original_image_path = os.path.join(settings.UPLOAD_DIR, db_image.filename)
    if not os.path.exists(original_image_path):
        raise HTTPException(status_code=404, detail="Original image file not found on disk.")
        
    # 4. Generate identity preserving makeover
    try:
        makeover_url = generate_identity_preserving_makeover(
            original_image_path=original_image_path,
            face_data=db_image.face_data or {},
            recommendations=db_look.recommendations or {}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Makeover generation failed: {str(e)}")
        
    # 5. Save makeover URL to look record
    try:
        db_look.makeover_url = makeover_url
        db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update database with makeover URL: {str(e)}")
        
    return MakeoverResponse(
        recommendation_id=payload.recommendation_id,
        image_id=db_look.image_id,
        makeover_url=makeover_url
    )
