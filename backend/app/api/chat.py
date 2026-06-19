from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from google import genai
from google.genai import types
from backend.app.core.config import settings
from backend.database.db import get_db
from backend.database.models.image import ImageModel
from backend.schemas.chat_schema import ChatRequest, ChatResponse

router = APIRouter()

SYSTEM_INSTRUCTION = (
    "You are StyleMirror, a friendly and professional AI fashion, style, and grooming consultant. "
    "Use any provided user profile data (face shape, skin tone, current style) to personalize your response. "
    "Answer all fashion-related questions constructly, encourage the user, and keep responses concise (under 150 words)."
)

def get_fallback_chat_reply(message_text: str, face_shape: str = None, skin_tone: str = None) -> str:
    """Mock/Rule-based chatbot response if Gemini key is missing or quota is exhausted."""
    msg = message_text.lower()
    
    if "hair" in msg:
        if face_shape:
            return f"Since you have a {face_shape} face shape, I recommend hairstyles that add vertical height (if round) or soften your angles (if square). Try styling a textured quiff or a side part!"
        return "For hairstyles, we always want to balance the natural shape of your face. Oval shapes are versatile, while round shapes benefit from shorter sides and longer tops."
        
    elif "color" in msg or "shade" in msg:
        if skin_tone:
            return f"Your skin tone has a {skin_tone} undertone. This means you look exceptional in warm shades like olive, cream, and terracotta (if warm) or cool tones like navy, emerald, and burgundy (if cool)."
        return "To find the best colors, we analyze your skin's warm or cool undertone. Navy blue and crisp whites are universally flattering bases."
        
    elif "wedding" in msg or "formal" in msg or "festive" in msg:
        return "For special occasions, try layering a structured jacket or Nehru vest over a solid cotton/silk kurta. Ensure the fit is tailored at the shoulders to elevate the silhouette."
        
    else:
        return "I'm here to help you navigate your style coordinates! Ask me about specific clothing items, hairstyles that match your face shape, or what colors coordinate best with your skin tone."

@router.post("/chat", response_model=ChatResponse)
async def chat_assistant(payload: ChatRequest, db: Session = Depends(get_db)):
    # 1. Retrieve user details if image_id is present
    face_shape = None
    skin_tone = None
    if payload.image_id:
        db_image = db.query(ImageModel).filter(ImageModel.id == payload.image_id).first()
        if db_image:
            face_shape = (db_image.face_data or {}).get("face_shape")
            skin_tone = (db_image.style_data or {}).get("skin_tone")
            
    # 2. Extract last message
    if not payload.messages:
        raise HTTPException(status_code=400, detail="Message list cannot be empty.")
    last_msg = payload.messages[-1].content
    
    # 3. Call Gemini if API key is present
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "YOUR_GEMINI_API_KEY_HERE":
        reply = get_fallback_chat_reply(last_msg, face_shape, skin_tone)
        return ChatResponse(reply=reply)
        
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        # Prepare content with system instruction and context
        context_prompt = ""
        if face_shape and skin_tone:
            context_prompt = f"[User Context: Face Shape = {face_shape}, Skin Undertone = {skin_tone}]\\n"
            
        full_prompt = f"{SYSTEM_INSTRUCTION}\\n{context_prompt}User asks: {last_msg}"
        
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=full_prompt,
        )
        return ChatResponse(reply=response.text.strip())
        
    except Exception as e:
        print(f"[Chatbot] Gemini error: {e} — returning fallback.")
        reply = get_fallback_chat_reply(last_msg, face_shape, skin_tone)
        return ChatResponse(reply=reply)
