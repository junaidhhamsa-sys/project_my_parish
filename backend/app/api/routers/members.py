from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/members", tags=["Members"])

@router.get("")
def list_members(
    search: Optional[str] = None,
    status: Optional[str] = None,
    family_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.Member)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (models.Member.first_name.ilike(s)) |
            (models.Member.last_name.ilike(s)) |
            (models.Member.email.ilike(s)) |
            (models.Member.phone.ilike(s))
        )
    if status:
        query = query.filter(models.Member.membership_status == status)
    if family_id:
        query = query.filter(models.Member.family_id == family_id)

    total = query.count()
    items = query.offset(skip).limit(limit).all()

    # Format result with family name
    result = []
    for item in items:
        d = {
            "id": item.id,
            "first_name": item.first_name,
            "last_name": item.last_name,
            "full_name": f"{item.first_name} {item.last_name}",
            "email": item.email,
            "phone": item.phone,
            "address": item.address,
            "date_of_birth": item.date_of_birth,
            "gender": item.gender,
            "family_id": item.family_id,
            "family_name": item.family.name if item.family else "Individual Member",
            "membership_status": item.membership_status,
            "emergency_contact": item.emergency_contact,
            "joined_date": item.joined_date,
            "bio": item.bio
        }
        result.append(d)

    return {"total": total, "items": result}

@router.get("/{member_id}")
def get_member(member_id: int, db: Session = Depends(get_db)):
    mem = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not mem:
        raise HTTPException(status_code=404, detail="Member not found")
    
    # Also fetch related volunteer info, event registrations, service requests
    vol = db.query(models.Volunteer).filter(models.Volunteer.member_id == member_id).first()
    regs = db.query(models.EventRegistration).filter(models.EventRegistration.member_id == member_id).all()
    sreqs = db.query(models.ServiceRequest).filter(models.ServiceRequest.member_id == member_id).all()

    return {
        "member": {
            "id": mem.id,
            "first_name": mem.first_name,
            "last_name": mem.last_name,
            "full_name": f"{mem.first_name} {mem.last_name}",
            "email": mem.email,
            "phone": mem.phone,
            "address": mem.address,
            "date_of_birth": mem.date_of_birth,
            "gender": mem.gender,
            "family_id": mem.family_id,
            "family_name": mem.family.name if mem.family else None,
            "membership_status": mem.membership_status,
            "emergency_contact": mem.emergency_contact,
            "joined_date": mem.joined_date,
            "bio": mem.bio
        },
        "volunteer": vol,
        "registrations": regs,
        "service_requests": sreqs
    }

@router.post("")
def create_member(payload: schemas.MemberCreate, db: Session = Depends(get_db)):
    mem = models.Member(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        phone=payload.phone,
        address=payload.address,
        date_of_birth=payload.date_of_birth,
        gender=payload.gender,
        family_id=payload.family_id,
        membership_status=payload.membership_status or "active",
        emergency_contact=payload.emergency_contact,
        joined_date="2026-09-25",
        bio=payload.bio
    )
    db.add(mem)
    db.commit()
    db.refresh(mem)
    return mem

@router.put("/{member_id}")
def update_member(member_id: int, payload: schemas.MemberCreate, db: Session = Depends(get_db)):
    mem = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not mem:
        raise HTTPException(status_code=404, detail="Member not found")
    
    mem.first_name = payload.first_name
    mem.last_name = payload.last_name
    mem.email = payload.email
    mem.phone = payload.phone
    mem.address = payload.address
    mem.date_of_birth = payload.date_of_birth
    mem.gender = payload.gender
    mem.family_id = payload.family_id
    mem.membership_status = payload.membership_status
    mem.emergency_contact = payload.emergency_contact
    mem.bio = payload.bio
    
    db.commit()
    db.refresh(mem)
    return mem

@router.delete("/{member_id}")
def delete_member(member_id: int, db: Session = Depends(get_db)):
    mem = db.query(models.Member).filter(models.Member.id == member_id).first()
    if not mem:
        raise HTTPException(status_code=404, detail="Member not found")
    db.delete(mem)
    db.commit()
    return {"message": "Member deleted successfully"}
