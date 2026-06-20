import os
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from backend.database.db import get_db
from backend.database.models.image import ImageModel
from backend.database.models.look import LookModel
from backend.services.report.report_service import generate_style_report

router = APIRouter()

REPORTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "reports", "pdf")

@router.get("/report/data/{image_id}")
async def get_report_data(image_id: str, db: Session = Depends(get_db)):
    db_image = db.query(ImageModel).filter(ImageModel.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image record not found.")

    db_look = db.query(LookModel).filter(LookModel.image_id == image_id).order_by(LookModel.created_at.desc()).first()
    
    face_data = db_image.face_data or {}
    style_data = db_image.style_data or {}
    recs = db_look.recommendations or {} if db_look else {}

    return {
        "image_id": db_image.id,
        "face_shape": face_data.get("face_shape", "N/A"),
        "skin_tone": style_data.get("skin_tone", "N/A"),
        "hair_type": face_data.get("hair_type", "N/A"),
        "current_style": style_data.get("current_style", "N/A"),
        "fashion_score": style_data.get("fashion_score", 0.0),
        "outfit": recs.get("outfit", {}),
        "hairstyles": recs.get("hairstyles", []),
        "accessories": recs.get("accessories", {}),
        "palette": recs.get("palette", {}),
        "makeup": recs.get("makeup", {})
    }

@router.get("/report/pdf/{image_id}")
async def get_report_pdf(image_id: str, db: Session = Depends(get_db)):
    db_image = db.query(ImageModel).filter(ImageModel.id == image_id).first()
    if not db_image:
        raise HTTPException(status_code=404, detail="Image record not found.")

    db_look = db.query(LookModel).filter(LookModel.image_id == image_id).order_by(LookModel.created_at.desc()).first()
    
    os.makedirs(REPORTS_DIR, exist_ok=True)
    pdf_filename = f"{image_id}.pdf"
    pdf_path = os.path.join(REPORTS_DIR, pdf_filename)
    
    try:
        generate_style_report(db_image, db_look, pdf_path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF report: {str(e)}")
        
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=500, detail="PDF generation succeeded but file was not found on disk.")
        
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=f"StyleMirror_Report_{image_id}.pdf"
    )
