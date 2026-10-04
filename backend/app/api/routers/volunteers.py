from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])

@router.get("")
def list_volunteers(
    search: Optional[str] = None,
    committee: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Volunteer)
    if status:
        query = query.filter(models.Volunteer.status == status)
    if committee:
        query = query.filter(models.Volunteer.committee_name == committee)

    vols = query.all()
    res = []
    for v in vols:
        m = db.query(models.Member).filter(models.Member.id == v.member_id).first()
        if not m:
            continue
        full_name = f"{m.first_name} {m.last_name}"
        if search and (search.lower() not in full_name.lower() and search.lower() not in (v.skills or "").lower()):
            continue

        res.append({
            "id": v.id,
            "member_id": v.member_id,
            "member_name": full_name,
            "email": m.email,
            "phone": m.phone,
            "skills": v.skills,
            "availability": v.availability,
            "interests": v.interests,
            "committee_name": v.committee_name,
            "status": v.status,
            "total_hours": v.total_hours,
            "recognition_level": v.recognition_level,
            "created_at": v.created_at
        })
    return res

@router.get("/assignments")
def list_assignments(db: Session = Depends(get_db)):
    assignments = db.query(models.VolunteerAssignment).all()
    res = []
    for a in assignments:
        v = db.query(models.Volunteer).filter(models.Volunteer.id == a.volunteer_id).first()
        m = db.query(models.Member).filter(models.Member.id == v.member_id).first() if v else None
        res.append({
            "id": a.id,
            "volunteer_id": a.volunteer_id,
            "volunteer_name": f"{m.first_name} {m.last_name}" if m else "Unassigned",
            "event_id": a.event_id,
            "title": a.title,
            "description": a.description,
            "start_date": a.start_date,
            "end_date": a.end_date,
            "priority": a.priority,
            "status": a.status,
            "responsibilities": a.responsibilities,
            "hours_logged": a.hours_logged,
            "created_at": a.created_at
        })
    return res

@router.post("/assignments")
def create_assignment(payload: schemas.VolunteerAssignmentCreate, db: Session = Depends(get_db)):
    assign = models.VolunteerAssignment(**payload.dict(), status="Assigned")
    db.add(assign)
    db.commit()
    db.refresh(assign)
    return assign

@router.get("/hours")
def list_hours(db: Session = Depends(get_db)):
    hours = db.query(models.VolunteerHour).order_by(models.VolunteerHour.id.desc()).all()
    res = []
    for h in hours:
        v = db.query(models.Volunteer).filter(models.Volunteer.id == h.volunteer_id).first()
        m = db.query(models.Member).filter(models.Member.id == v.member_id).first() if v else None
        res.append({
            "id": h.id,
            "volunteer_id": h.volunteer_id,
            "volunteer_name": f"{m.first_name} {m.last_name}" if m else "Volunteer",
            "activity_name": h.activity_name,
            "date": h.date,
            "hours": h.hours,
            "status": h.status,
            "notes": h.notes
        })
    return res

@router.post("/hours")
def log_hours(payload: schemas.VolunteerHourCreate, db: Session = Depends(get_db)):
    vh = models.VolunteerHour(**payload.dict(), status="Approved")
    db.add(vh)

    # Update total hours on volunteer record
    v = db.query(models.Volunteer).filter(models.Volunteer.id == payload.volunteer_id).first()
    if v:
        v.total_hours += payload.hours
        # Update badge
        if v.total_hours > 100:
            v.recognition_level = "Gold Star Leadership"
        elif v.total_hours > 50:
            v.recognition_level = "Silver Star Achiever"

    db.commit()
    db.refresh(vh)
    return vh

@router.post("")
def create_volunteer(payload: schemas.VolunteerCreate, db: Session = Depends(get_db)):
    vol = models.Volunteer(**payload.dict(), status="Active", total_hours=0.0, recognition_level="Bronze Star")
    db.add(vol)
    db.commit()
    db.refresh(vol)
    return vol
