from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/partners", tags=["Partnerships"])

@router.get("")
def list_partners(partner_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Partner)
    if partner_type and partner_type != "All":
        query = query.filter(models.Partner.partner_type == partner_type)
    return query.all()

@router.post("")
def create_partner(payload: schemas.PartnerCreate, db: Session = Depends(get_db)):
    p = models.Partner(**payload.dict(), status="Active")
    db.add(p)
    db.commit()
    db.refresh(p)
    return p
