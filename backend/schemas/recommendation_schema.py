from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class RecommendationRequest(BaseModel):
    image_id: str
    occasion: str
    season: str
    budget: float
    style_input: str
    gender: Optional[str] = "male"

class RecommendationResponse(BaseModel):
    recommendation_id: str
    image_id: str
    outfit: Dict[str, Any]
    hairstyles: List[str]
    accessories: Dict[str, Any]
    palette: Dict[str, Any]
    makeup: Dict[str, Any]
