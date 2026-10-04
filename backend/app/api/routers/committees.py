from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/committees", tags=["Committees"])

@router.get("")
def list_committees(db: Session = Depends(get_db)):
    comms = db.query(models.Committee).all()
    res = []
    for c in comms:
        # Count members and volunteers
        vcount = db.query(models.Volunteer).filter(models.Volunteer.committee_name == c.name).count()
        res.append({
            "id": c.id,
            "name": c.name,
            "description": c.description,
            "leader_name": c.leader_name,
            "category": c.category,
            "goals": c.goals,
            "volunteer_count": vcount,
            "created_at": c.created_at
        })
    return res

@router.get("/{committee_id}")
def get_committee(committee_id: int, db: Session = Depends(get_db)):
    c = db.query(models.Committee).filter(models.Committee.id == committee_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Committee not found")
    
    vols = db.query(models.Volunteer).filter(models.Volunteer.committee_name == c.name).all()
    # Fetch volunteer member names
    vol_details = []
    for v in vols:
        m = db.query(models.Member).filter(models.Member.id == v.member_id).first()
        vol_details.append({
            "id": v.id,
            "member_id": v.member_id,
            "member_name": f"{m.first_name} {m.last_name}" if m else "Volunteer",
            "skills": v.skills,
            "total_hours": v.total_hours,
            "status": v.status,
            "recognition_level": v.recognition_level
        })
    return {"committee": c, "volunteers": vol_details}

@router.post("")
def create_committee(payload: schemas.CommitteeCreate, db: Session = Depends(get_db)):
    c = models.Committee(**payload.dict())
    db.add(c)
    db.commit()
    db.refresh(c)
    return c
