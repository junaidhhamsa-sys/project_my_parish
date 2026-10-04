from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/announcements", tags=["Announcements"])

@router.get("")
def list_announcements(
    audience: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Announcement).filter(models.Announcement.status == "Published")
    if audience and audience != "Everyone":
        query = query.filter((models.Announcement.audience == audience) | (models.Announcement.audience == "Everyone"))
    if category and category != "All":
        query = query.filter(models.Announcement.category == category)

    anc = query.order_by(models.Announcement.id.desc()).all()
    return anc

@router.post("")
def create_announcement(payload: schemas.AnnouncementCreate, db: Session = Depends(get_db)):
    anc = models.Announcement(
        **payload.dict(),
        status="Published",
        author_name="Parish Admin"
    )
    db.add(anc)
    db.commit()
    db.refresh(anc)
    return anc

@router.get("/notifications")
def list_notifications(user_id: Optional[int] = 1, db: Session = Depends(get_db)):
    notifs = db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.id.desc()).all()
    return notifs

@router.post("/notifications/read-all")
def mark_all_read(user_id: Optional[int] = 1, db: Session = Depends(get_db)):
    db.query(models.Notification).filter(models.Notification.user_id == user_id).update({"is_read": True})
    db.commit()
    return {"message": "All marked as read"}
