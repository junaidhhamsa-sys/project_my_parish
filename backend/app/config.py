import os

class Settings:
    PROJECT_NAME: str = "MY PARISH MY PROUD - Community Development & Parish Management Platform"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-parish-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # SQLite fallback by default for instant local setup, PostgreSQL supported via env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./parish.db")
    
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8089",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8089",
        "*"
    ]

settings = Settings()
