import os
import time
import uuid

import cv2
from fastapi import APIRouter, HTTPException

from backend.ai.face_analysis import analyze_face_image
from backend.ai.style_analyzer import analyze_style
from backend.app.core.config import settings

router = APIRouter()


@router.post("/camera/capture")
async def capture_camera_image(camera_index: int = 0):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    camera = cv2.VideoCapture(camera_index, cv2.CAP_DSHOW)
    if not camera.isOpened():
        camera.release()
        raise HTTPException(
            status_code=503,
            detail="Could not open camera. Check camera permissions or try another camera_index.",
        )

    try:
        # Let auto exposure settle for a moment before reading the saved frame.
        frame = None
        ok = False
        for _ in range(8):
            ok, frame = camera.read()
            time.sleep(0.05)

        if not ok or frame is None:
            raise HTTPException(status_code=500, detail="Camera opened, but no frame was captured.")

        image_id = str(uuid.uuid4())
        saved_filename = f"{image_id}.jpg"
        saved_path = os.path.join(settings.UPLOAD_DIR, saved_filename)

        if not cv2.imwrite(saved_path, frame):
            raise HTTPException(status_code=500, detail="Failed to save captured camera frame.")

        try:
            face_data = analyze_face_image(saved_path)
            style_data = analyze_style(saved_path)
        except Exception as exc:
            if os.path.exists(saved_path):
                os.remove(saved_path)
            raise HTTPException(status_code=500, detail=f"Analysis pipeline error: {exc}") from exc

        return {
            "image_id": image_id,
            "preview_url": f"/uploads/{saved_filename}",
            "face_data": face_data,
            "style_data": style_data,
        }
    finally:
        camera.release()
