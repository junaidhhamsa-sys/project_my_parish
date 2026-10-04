from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("")
def list_events(
    category: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Event)
    if category and category != "All":
        query = query.filter(models.Event.category == category)
    if status and status != "All":
        query = query.filter(models.Event.status == status)
    if search:
        s = f"%{search}%"
        query = query.filter(models.Event.name.ilike(s) | models.Event.location.ilike(s))

    events = query.order_by(models.Event.start_time.asc()).all()
    return events

@router.get("/{event_id}")
def get_event(event_id: int, db: Session = Depends(get_db)):
    ev = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")
    
    regs = db.query(models.EventRegistration).filter(models.EventRegistration.event_id == event_id).all()
    return {
        "event": ev,
        "registrations": regs
    }

@router.post("")
def create_event(payload: schemas.EventCreate, db: Session = Depends(get_db)):
    ev = models.Event(**payload.dict(), status="Published", registered_count=0)
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev

@router.delete("/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db)):
    ev = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Delete registrations for this event
    db.query(models.EventRegistration).filter(models.EventRegistration.event_id == event_id).delete()
    db.delete(ev)
    db.commit()
    return {"message": "Event deleted successfully"}

@router.post("/register")
def register_for_event(payload: schemas.EventRegistrationCreate, db: Session = Depends(get_db)):
    ev = db.query(models.Event).filter(models.Event.id == payload.event_id).first()
    mem = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
    if not ev or not mem:
        raise HTTPException(status_code=400, detail="Invalid event or member ID")

    # Check capacity
    if ev.registered_count >= ev.capacity:
        raise HTTPException(status_code=400, detail="Event registration is full")

    # Check existing registration
    existing = db.query(models.EventRegistration).filter(
        models.EventRegistration.event_id == payload.event_id,
        models.EventRegistration.member_id == payload.member_id
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Already registered for this event")

    reg = models.EventRegistration(
        event_id=ev.id,
        member_id=mem.id,
        member_name=f"{mem.first_name} {mem.last_name}",
        email=mem.email,
        registration_date="2026-09-25",
        status="Registered",
        notes=payload.notes
    )
    db.add(reg)

    ev.registered_count += 1
    db.commit()
    db.refresh(reg)

    # Create notification for member
    if mem.user_id:
        notif = models.Notification(
            user_id=mem.user_id,
            title="Event Registration Confirmed",
            message=f"You are registered for {ev.name} on {ev.start_time}.",
            category="Event",
            is_read=False,
            link="/events"
        )
        db.add(notif)
        db.commit()

    return reg
