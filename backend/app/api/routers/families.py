from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/families", tags=["Families"])

@router.get("")
def list_families(search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Family)
    if search:
        s = f"%{search}%"
        query = query.filter(models.Family.name.ilike(s))
    families = query.all()

    res = []
    for f in families:
        mcount = db.query(models.Member).filter(models.Member.family_id == f.id).count()
        res.append({
            "id": f.id,
            "name": f.name,
            "primary_contact": f.primary_contact,
            "address": f.address,
            "phone": f.phone,
            "emergency_contact": f.emergency_contact,
            "member_count": mcount,
            "notes": f.notes,
            "created_at": f.created_at
        })
    return res

@router.get("/{family_id}")
def get_family(family_id: int, db: Session = Depends(get_db)):
    fam = db.query(models.Family).filter(models.Family.id == family_id).first()
    if not fam:
        raise HTTPException(status_code=404, detail="Family not found")
    
    mems = db.query(models.Member).filter(models.Member.family_id == family_id).all()
    return {
        "family": fam,
        "members": mems
    }

@router.post("")
def create_family(payload: schemas.FamilyCreate, db: Session = Depends(get_db)):
    fam = models.Family(
        name=payload.name,
        primary_contact=payload.primary_contact,
        address=payload.address,
        phone=payload.phone,
        emergency_contact=payload.emergency_contact,
        notes=payload.notes
    )
    db.add(fam)
    db.commit()
    db.refresh(fam)

    # Process initial members if provided
    if payload.initial_members:
        for m_data in payload.initial_members:
            if m_data.member_id:
                mem = db.query(models.Member).filter(models.Member.id == m_data.member_id).first()
                if mem:
                    mem.family_id = fam.id
            elif m_data.first_name and m_data.last_name:
                email = m_data.email or f"{m_data.first_name.lower()}.{m_data.last_name.lower()}@parish.org"
                new_mem = models.Member(
                    first_name=m_data.first_name,
                    last_name=m_data.last_name,
                    email=email,
                    phone=m_data.phone,
                    gender=m_data.gender or "Other",
                    date_of_birth=m_data.date_of_birth,
                    family_id=fam.id,
                    membership_status="active",
                    joined_date="2026-09-25"
                )
                db.add(new_mem)
        db.commit()

    return fam

@router.delete("/{family_id}")
def delete_family(family_id: int, db: Session = Depends(get_db)):
    fam = db.query(models.Family).filter(models.Family.id == family_id).first()
    if not fam:
        raise HTTPException(status_code=404, detail="Family not found")
    
    # Unassign members associated with this family
    db.query(models.Member).filter(models.Member.family_id == family_id).update({"family_id": None})
    db.delete(fam)
    db.commit()
    return {"message": "Family deleted successfully"}

@router.post("/{family_id}/members")
def add_member_to_family(family_id: int, payload: schemas.FamilyMemberAdd, db: Session = Depends(get_db)):
    fam = db.query(models.Family).filter(models.Family.id == family_id).first()
    if not fam:
        raise HTTPException(status_code=404, detail="Family not found")
    
    if payload.member_id:
        mem = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
        if not mem:
            raise HTTPException(status_code=404, detail="Member not found")
        mem.family_id = family_id
        db.commit()
    elif payload.first_name and payload.last_name:
        email = payload.email or f"{payload.first_name.lower()}.{payload.last_name.lower()}@parish.org"
        new_mem = models.Member(
            first_name=payload.first_name,
            last_name=payload.last_name,
            email=email,
            phone=payload.phone,
            gender=payload.gender or "Other",
            date_of_birth=payload.date_of_birth,
            family_id=family_id,
            membership_status="active",
            joined_date="2026-09-25"
        )
        db.add(new_mem)
        db.commit()
    else:
        raise HTTPException(status_code=400, detail="Must provide member_id or first_name and last_name")
    
    mems = db.query(models.Member).filter(models.Member.family_id == family_id).all()
    return {"family": fam, "members": mems}

@router.delete("/{family_id}/members/{member_id}")
def remove_member_from_family(family_id: int, member_id: int, db: Session = Depends(get_db)):
    fam = db.query(models.Family).filter(models.Family.id == family_id).first()
    if not fam:
        raise HTTPException(status_code=404, detail="Family not found")
    
    mem = db.query(models.Member).filter(models.Member.id == member_id, models.Member.family_id == family_id).first()
    if not mem:
        raise HTTPException(status_code=404, detail="Member not found in this family")
    
    mem.family_id = None
    db.commit()
    
    mems = db.query(models.Member).filter(models.Member.family_id == family_id).all()
    return {"family": fam, "members": mems}
