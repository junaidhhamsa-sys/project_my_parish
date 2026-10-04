from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app import models
from app.seed import seed_db

from app.api.routers import (
    auth, members, families, committees, volunteers, services,
    support_cases, events, announcements, fundraising, documents,
    partners, sops, kpis, analytics, admin, ai_assistant
)

# Ensure tables exist
Base.metadata.create_all(bind=engine)

# Auto seed if database is empty
db = SessionLocal()
if db.query(models.User).count() == 0:
    print("Empty database detected. Running seed script...")
    db.close()
    seed_db()
else:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
api_v1 = settings.API_V1_STR
app.include_router(auth.router, prefix=api_v1)
app.include_router(members.router, prefix=api_v1)
app.include_router(families.router, prefix=api_v1)
app.include_router(committees.router, prefix=api_v1)
app.include_router(volunteers.router, prefix=api_v1)
app.include_router(services.router, prefix=api_v1)
app.include_router(support_cases.router, prefix=api_v1)
app.include_router(events.router, prefix=api_v1)
app.include_router(announcements.router, prefix=api_v1)
app.include_router(fundraising.router, prefix=api_v1)
app.include_router(documents.router, prefix=api_v1)
app.include_router(partners.router, prefix=api_v1)
app.include_router(sops.router, prefix=api_v1)
app.include_router(kpis.router, prefix=api_v1)
app.include_router(analytics.router, prefix=api_v1)
app.include_router(admin.router, prefix=api_v1)
app.include_router(ai_assistant.router, prefix=api_v1)

@app.get("/")
def root():
    return {
        "app": "MY PARISH MY PROUD - Community Development & Parish Management Platform",
        "status": "Online",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get(f"{api_v1}/health")
def health_check():
    return {"status": "healthy", "database": "connected"}
