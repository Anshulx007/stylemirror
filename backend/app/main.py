import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from backend.app.core.config import settings
from backend.app.api.analyze import router as analyze_router
from backend.app.api.camera import router as camera_router
from backend.app.api.recommend import router as recommend_router
from backend.app.api.makeover import router as makeover_router
from backend.app.api.chat import router as chat_router
from backend.database.db import engine, Base

# Create SQLite database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="StyleMirror AI API",
    description="Identity-Preserving Fashion Designer & Virtual Makeover Assistant Backend",
    version="1.0.0"
)

# Configure CORS (Cross-Origin Resource Sharing)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

# Mount the upload folder to serve saved style images
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Register route controllers
app.include_router(analyze_router, prefix="/api/v1", tags=["Analysis"])
app.include_router(recommend_router, prefix="/api/v1", tags=["Recommendation"])
app.include_router(makeover_router, prefix="/api/v1", tags=["Makeover"])
app.include_router(chat_router, prefix="/api/v1", tags=["Chat"])
app.include_router(camera_router, prefix="/api/v1", tags=["Camera"])


@app.get("/")
async def root():
    return {
        "status": "online",
        "project": "StyleMirror AI Backend API",
        "docs_url": "/docs"
    }

