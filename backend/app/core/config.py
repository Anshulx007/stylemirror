from pydantic_settings import BaseSettings
from pydantic import Field
from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    GEMINI_API_KEY: str = Field(default="")
    UPLOAD_DIR: str = Field(default="uploads")
    PORT: int = Field(default=8000)
    HOST: str = Field(default="0.0.0.0")

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

