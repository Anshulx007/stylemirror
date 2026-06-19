import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from backend.app.core.config import settings
from backend.ai.face_analysis import analyze_face_image
from backend.ai.color_analyzer import analyze_color
from backend.ai.style_analyzer import analyze_style
from backend.ai.style_scorer import score_style
from backend.database.db import get_db
from backend.database.models.image import ImageModel
from backend.schemas.image_schema import AnalysisResponse

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Validate file type
    if not file.content_type or file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        # Fallback check on file extension
        ext = file.filename.split(".")[-1].lower() if file.filename else ""
        if ext not in ["jpg", "jpeg", "png"]:
            raise HTTPException(status_code=400, detail="Only JPEG and PNG images are supported.")
        
    # Ensure upload directory exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    # Generate unique image id
    image_id = str(uuid.uuid4())
    file_extension = file.filename.split(".")[-1] if file.filename and "." in file.filename else "jpg"
    saved_filename = f"{image_id}.{file_extension}"
    saved_path = os.path.join(settings.UPLOAD_DIR, saved_filename)
    
    # Save the file
    try:
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save uploaded file: {str(e)}")
        
    # Run face mesh, color, style, and score analysis
    try:
        face_data = analyze_face_image(saved_path)
        color_data = analyze_color(saved_path)
        style_data = analyze_style(saved_path)
        score_data = score_style(saved_path)
    except Exception as e:
        # Clean up file on failure
        if os.path.exists(saved_path):
            os.remove(saved_path)
        raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {str(e)}")
        
    preview_url = f"/uploads/{saved_filename}"
    
    face_shape = face_data.get("face_shape", "Oval").lower()
    skin_tone = color_data.get("skin_tone", "neutral").lower()
    hair_type = face_data.get("hair_type", "wavy").lower()
    current_style = style_data.get("current_style", "casual").lower()
    fashion_score = score_data.get("fashion_score", 7.4)

    # Save to database
    try:
        db_image = ImageModel(
            id=image_id,
            filename=saved_filename,
            preview_url=preview_url,
            face_data={
                "face_shape": face_shape,
                "hair_type": hair_type,
                "bounding_box": face_data.get("bounding_box"),
                "description": face_data.get("description")
            },
            style_data={
                "skin_tone": skin_tone,
                "current_style": current_style,
                "fashion_score": fashion_score,
                "strengths": style_data.get("strengths", []),
                "improvements": style_data.get("improvements", [])
            }
        )
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
    except Exception as e:
        if os.path.exists(saved_path):
            os.remove(saved_path)
        raise HTTPException(status_code=500, detail=f"Failed to save image metadata to database: {str(e)}")
    
    return AnalysisResponse(
        image_id=image_id,
        preview_url=preview_url,
        face_shape=face_shape,
        skin_tone=skin_tone,
        hair_type=hair_type,
        current_style=current_style,
        fashion_score=fashion_score
    )



