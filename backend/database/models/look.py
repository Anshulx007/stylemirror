from sqlalchemy import Column, String, JSON, DateTime, ForeignKey
from datetime import datetime
from backend.database.db import Base

class LookModel(Base):
    __tablename__ = "looks"

    id = Column(String, primary_key=True, index=True)
    image_id = Column(String, ForeignKey("images.id"), nullable=False)
    occasion = Column(String, nullable=True)
    season = Column(String, nullable=True)
    budget = Column(JSON, nullable=True)
    style_input = Column(String, nullable=True)
    recommendations = Column(JSON, nullable=True)  # Store JSON response from recommendation engine
    makeover_url = Column(String, nullable=True)      # Path to generated makeover image
    created_at = Column(DateTime, default=datetime.utcnow)
