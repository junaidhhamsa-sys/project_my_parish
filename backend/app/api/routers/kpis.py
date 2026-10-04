from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/kpis", tags=["KPI Framework"])

@router.get("")
def list_kpis(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.KPI)
    if category and category != "All":
        query = query.filter(models.KPI.category == category)
    kpis = query.all()
    res = []
    for k in kpis:
        progress = round((k.current_value / k.target_value * 100), 1) if k.target_value > 0 else 0
        res.append({
            "id": k.id,
            "name": k.name,
            "category": k.category,
            "target_value": k.target_value,
            "current_value": k.current_value,
            "unit": k.unit,
            "period": k.period,
            "status": k.status,
            "owner": k.owner,
            "trend": k.trend,
            "progress_percent": progress
        })
    return res

@router.post("")
def create_kpi(payload: schemas.KPICreate, db: Session = Depends(get_db)):
    kp = models.KPI(**payload.dict(), status="On Track", trend="+10%")
    db.add(kp)
    db.commit()
    db.refresh(kp)
    return kp
