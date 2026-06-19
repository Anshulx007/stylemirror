from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    image_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
