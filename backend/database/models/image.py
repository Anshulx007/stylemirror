from sqlalchemy import Column, String, JSON, DateTime
from datetime import datetime
from backend.database.db import Base

class ImageModel(Base):
    __tablename__ = "images"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    preview_url = Column(String, nullable=False)
    face_data = Column(JSON, nullable=True)
    style_data = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
