"""Application Configuration. MSc Cloud DevOpsSec - Research Paper Annotation Tool"""
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/researchpaper"
    JWT_SECRET_KEY: str = "dev-secret-key-change-in-production-min-32-chars!!"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 1440
    APP_NAME: str = "Research Paper Annotation Tool API"
    DEBUG: bool = False
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
