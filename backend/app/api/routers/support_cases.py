from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/welfare", tags=["Welfare & Support Cases"])

@router.get("/cases")
def list_support_cases(
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.SupportCase)
    if status and status != "All":
        query = query.filter(models.SupportCase.status == status)
    if priority and priority != "All":
        query = query.filter(models.SupportCase.priority == priority)
    if category and category != "All":
        query = query.filter(models.SupportCase.category == category)

    cases = query.order_by(models.SupportCase.id.desc()).all()

    # Log audit event for sensitive record access
    audit = models.AuditLog(
        user_name="Parish Admin",
        user_role="parish_admin",
        action="SUPPORT_CASES_VIEW",
        resource_type="SupportCase",
        resource_id="ALL",
        details="Accessed confidential welfare support cases list."
    )
    db.add(audit)
    db.commit()

    res = []
    for c in cases:
        res.append({
            "id": c.id,
            "case_number": c.case_number,
            "member_id": c.member_id,
            "member_name": c.member_name,
            "category": c.category,
            "priority": c.priority,
            "title": c.title,
            "description": c.description,
            "assigned_staff": c.assigned_staff,
            "status": c.status,
            "created_date": c.created_date,
            "follow_up_date": c.follow_up_date,
            "assistance_provided": c.assistance_provided,
            "notes": c.notes,
            "created_at": str(c.created_at) if c.created_at else None
        })
    return res

@router.get("/cases/{case_id}")
def get_support_case(case_id: int, db: Session = Depends(get_db)):
    case_obj = db.query(models.SupportCase).filter(models.SupportCase.id == case_id).first()
    if not case_obj:
        raise HTTPException(status_code=404, detail="Support case not found")
    
    notes = db.query(models.CaseNote).filter(models.CaseNote.case_id == case_id).all()
    
    # Audit log
    audit = models.AuditLog(
        user_name="Parish Admin",
        user_role="parish_admin",
        action="SENSITIVE_CASE_ACCESS",
        resource_type="SupportCase",
        resource_id=str(case_obj.case_number),
        details=f"Viewed confidential details for case {case_obj.case_number}"
    )
    db.add(audit)
    db.commit()

    return {
        "case": {
            "id": case_obj.id,
            "case_number": case_obj.case_number,
            "member_id": case_obj.member_id,
            "member_name": case_obj.member_name,
            "category": case_obj.category,
            "priority": case_obj.priority,
            "title": case_obj.title,
            "description": case_obj.description,
            "assigned_staff": case_obj.assigned_staff,
            "status": case_obj.status,
            "created_date": case_obj.created_date,
            "follow_up_date": case_obj.follow_up_date,
            "assistance_provided": case_obj.assistance_provided,
            "notes": case_obj.notes,
            "created_at": str(case_obj.created_at) if case_obj.created_at else None
        },
        "notes": [
            {
                "id": n.id,
                "case_id": n.case_id,
                "author_name": n.author_name,
                "note": n.note,
                "is_private": n.is_private,
                "created_at": str(n.created_at) if n.created_at else None
            }
            for n in notes
        ]
    }

@router.post("/cases")
def create_support_case(payload: schemas.SupportCaseCreate, db: Session = Depends(get_db)):
    member_id = payload.member_id or 1
    mname = payload.member_name
    if payload.member_id:
        mem = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
        if mem:
            mname = f"{mem.first_name} {mem.last_name}"
            member_id = mem.id
    
    if not mname:
        mname = "Parish Applicant"
    
    count = db.query(models.SupportCase).count()
    cnum = f"CASE-2026-{501 + count}"

    c_obj = models.SupportCase(
        case_number=cnum,
        member_id=member_id,
        member_name=mname,
        category=payload.category,
        priority=payload.priority or "Medium",
        title=payload.title,
        description=payload.description,
        assigned_staff=payload.assigned_staff or "Sister Maria Rodriguez",
        status="New",
        created_date="2026-09-25",
        follow_up_date=payload.follow_up_date or "2026-10-05",
        assistance_provided=payload.assistance_provided or "Under review by parish welfare committee",
        notes="Confidential welfare record created."
    )
    db.add(c_obj)
    db.commit()
    db.refresh(c_obj)
    return c_obj

@router.delete("/cases/{case_id}")
def delete_support_case(case_id: int, db: Session = Depends(get_db)):
    c_obj = db.query(models.SupportCase).filter(models.SupportCase.id == case_id).first()
    if not c_obj:
        raise HTTPException(status_code=404, detail="Support case not found")
    
    db.query(models.CaseNote).filter(models.CaseNote.case_id == case_id).delete()
    db.delete(c_obj)
    db.commit()
    return {"message": "Support case deleted successfully"}

@router.patch("/cases/{case_id}/status")
def update_case_status(
    case_id: int,
    payload: schemas.SupportCaseStatusUpdate,
    db: Session = Depends(get_db)
):
    c_obj = db.query(models.SupportCase).filter(models.SupportCase.id == case_id).first()
    if not c_obj:
        raise HTTPException(status_code=404, detail="Support case not found")
    
    c_obj.status = payload.status
    if payload.notes:
        note = models.CaseNote(
            case_id=c_obj.id,
            author_name="Sister Maria Rodriguez",
            note=f"Status changed to {payload.status}. {payload.notes}",
            is_private=True
        )
        db.add(note)
    
    db.commit()
    db.refresh(c_obj)
    return c_obj

@router.post("/cases/{case_id}/notes")
def add_case_note(case_id: int, payload: schemas.CaseNoteCreate, db: Session = Depends(get_db)):
    note = models.CaseNote(
        case_id=case_id,
        author_name=payload.author_name,
        note=payload.note,
        is_private=payload.is_private
    )
    db.add(note)
    db.commit()
    db.refresh(note)
    return note
