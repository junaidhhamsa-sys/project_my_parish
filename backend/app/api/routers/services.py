from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("")
def list_services(category: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Service)
    if category and category != "All":
        query = query.filter(models.Service.category == category)
    if search:
        s = f"%{search}%"
        query = query.filter(models.Service.name.ilike(s) | models.Service.description.ilike(s))

    services = query.all()
    res = []
    for s in services:
        req_count = db.query(models.ServiceRequest).filter(models.ServiceRequest.service_id == s.id).count()
        res.append({
            "id": s.id,
            "name": s.name,
            "category": s.category,
            "description": s.description,
            "eligibility": s.eligibility,
            "contact_person": s.contact_person,
            "location": s.location,
            "schedule": s.schedule,
            "capacity": s.capacity,
            "status": s.status,
            "required_documents": s.required_documents,
            "request_count": req_count,
            "created_at": s.created_at
        })
    return res

@router.post("")
def create_service(payload: schemas.ServiceCreate, db: Session = Depends(get_db)):
    srv = models.Service(**payload.dict(), status="Active")
    db.add(srv)
    db.commit()
    db.refresh(srv)
    return srv

@router.get("/requests")
def list_service_requests(
    status: Optional[str] = None,
    member_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.ServiceRequest)
    if status and status != "All":
        query = query.filter(models.ServiceRequest.status == status)
    if member_id:
        query = query.filter(models.ServiceRequest.member_id == member_id)

    reqs = query.order_by(models.ServiceRequest.id.desc()).all()
    return reqs

@router.post("/requests")
def create_service_request(payload: schemas.ServiceRequestCreate, db: Session = Depends(get_db)):
    srv = db.query(models.Service).filter(models.Service.id == payload.service_id).first()
    mem = db.query(models.Member).filter(models.Member.id == payload.member_id).first()
    if not srv or not mem:
        raise HTTPException(status_code=400, detail="Invalid service or member ID")

    # Generate request number
    count = db.query(models.ServiceRequest).count()
    rnum = f"SR-2026-{1001 + count}"

    req = models.ServiceRequest(
        request_number=rnum,
        service_id=payload.service_id,
        member_id=payload.member_id,
        member_name=f"{mem.first_name} {mem.last_name}",
        service_name=srv.name,
        status="Submitted",
        priority=payload.priority or "Medium",
        details=payload.details,
        notes="Awaiting staff review."
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@router.patch("/requests/{request_id}/status")
def update_service_request_status(
    request_id: int,
    payload: schemas.ServiceRequestUpdateStatus,
    db: Session = Depends(get_db)
):
    req = db.query(models.ServiceRequest).filter(models.ServiceRequest.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Service request not found")

    req.status = payload.status
    if payload.notes:
        req.notes = payload.notes
    db.commit()
    db.refresh(req)
    return req
