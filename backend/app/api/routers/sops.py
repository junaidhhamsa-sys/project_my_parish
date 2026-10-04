from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/sops", tags=["SOP Management"])

@router.get("")
def list_sops(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.SOP)
    if category and category != "All":
        query = query.filter(models.SOP.category == category)
    return query.all()

@router.post("")
def create_sop(payload: schemas.SOPCreate, db: Session = Depends(get_db)):
    sop = models.SOP(**payload.dict(), status="Active")
    db.add(sop)
    db.commit()
    db.refresh(sop)
    return sop
