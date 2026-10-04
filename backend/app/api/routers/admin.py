from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, security

router = APIRouter(prefix="/admin", tags=["Administration"])

@router.get("/users")
def list_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()

@router.post("/users")
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    usr = models.User(
        email=payload.email,
        password_hash=security.get_password_hash(payload.password),
        full_name=payload.full_name,
        phone=payload.phone,
        role=payload.role or "member",
        is_active=True
    )
    db.add(usr)
    db.commit()
    db.refresh(usr)
    return usr

@router.get("/audit-logs")
def list_audit_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    logs = db.query(models.AuditLog).order_by(models.AuditLog.id.desc()).offset(skip).limit(limit).all()
    return logs

@router.get("/search")
def global_search(q: str = Query(..., min_length=2), db: Session = Depends(get_db)):
    pattern = f"%{q}%"

    members = db.query(models.Member).filter(
        (models.Member.first_name.ilike(pattern)) |
        (models.Member.last_name.ilike(pattern)) |
        (models.Member.email.ilike(pattern))
    ).limit(5).all()

    events = db.query(models.Event).filter(
        (models.Event.name.ilike(pattern)) |
        (models.Event.location.ilike(pattern))
    ).limit(5).all()

    services = db.query(models.Service).filter(
        (models.Service.name.ilike(pattern)) |
        (models.Service.category.ilike(pattern))
    ).limit(5).all()

    announcements = db.query(models.Announcement).filter(
        (models.Announcement.title.ilike(pattern)) |
        (models.Announcement.content.ilike(pattern))
    ).limit(5).all()

    documents = db.query(models.Document).filter(
        (models.Document.title.ilike(pattern)) |
        (models.Document.category.ilike(pattern))
    ).limit(5).all()

    results = []
    for m in members:
        results.append({"type": "Member", "title": f"{m.first_name} {m.last_name}", "subtitle": m.email, "link": "/members"})
    for e in events:
        results.append({"type": "Event", "title": e.name, "subtitle": e.start_time, "link": "/events"})
    for s in services:
        results.append({"type": "Service", "title": s.name, "subtitle": s.category, "link": "/services"})
    for a in announcements:
        results.append({"type": "Announcement", "title": a.title, "subtitle": a.category, "link": "/announcements"})
    for d in documents:
        results.append({"type": "Document", "title": d.title, "subtitle": d.category, "link": "/documents"})

    return results
