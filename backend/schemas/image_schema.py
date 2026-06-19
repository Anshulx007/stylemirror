from pydantic import BaseModel

class AnalysisResponse(BaseModel):
    image_id: str
    preview_url: str
    face_shape: str
    skin_tone: str
    hair_type: str
    current_style: str
    fashion_score: float
