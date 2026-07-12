from pydantic_settings import BaseSettings
from pydantic import field_validator
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "TransitOps"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./transitops.db"

    # JWT
    SECRET_KEY: str = "change-me-to-a-long-random-secret-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # Mail (optional — for license expiry reminders)
    MAIL_USERNAME: Optional[str] = None
    MAIL_PASSWORD: Optional[str] = None
    MAIL_FROM: Optional[str] = None
    MAIL_SERVER: Optional[str] = "smtp.gmail.com"
    MAIL_PORT: int = 587
    MAIL_TLS: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
