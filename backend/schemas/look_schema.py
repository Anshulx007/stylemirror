from pydantic import BaseModel
from typing import Optional

class MakeoverRequest(BaseModel):
    recommendation_id: str

class MakeoverResponse(BaseModel):
    recommendation_id: str
    image_id: str
    makeover_url: str
