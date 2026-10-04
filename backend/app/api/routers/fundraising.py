from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/fundraising", tags=["Fundraising"])

@router.get("/campaigns")
def list_campaigns(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Campaign)
    if status and status != "All":
        query = query.filter(models.Campaign.status == status)
    campaigns = query.all()
    res = []
    for c in campaigns:
        dcount = db.query(models.Donation).filter(models.Donation.campaign_id == c.id).count()
        progress = round((c.raised_amount / c.goal_amount * 100), 1) if c.goal_amount > 0 else 0
        res.append({
            "id": c.id,
            "title": c.title,
            "description": c.description,
            "goal_amount": c.goal_amount,
            "raised_amount": c.raised_amount,
            "start_date": c.start_date,
            "end_date": c.end_date,
            "status": c.status,
            "organizer": c.organizer,
            "image_url": c.image_url,
            "donor_count": dcount,
            "progress_percent": progress
        })
    return res

@router.post("/campaigns")
def create_campaign(payload: schemas.CampaignCreate, db: Session = Depends(get_db)):
    cmp = models.Campaign(**payload.dict(), raised_amount=0.0, status="Active")
    db.add(cmp)
    db.commit()
    db.refresh(cmp)
    return cmp

@router.get("/donations")
def list_donations(campaign_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(models.Donation)
    if campaign_id:
        query = query.filter(models.Donation.campaign_id == campaign_id)
    donations = query.order_by(models.Donation.id.desc()).all()
    return donations

@router.post("/donations")
def record_donation(payload: schemas.DonationCreate, db: Session = Depends(get_db)):
    cmp = db.query(models.Campaign).filter(models.Campaign.id == payload.campaign_id).first() if payload.campaign_id else None
    
    count = db.query(models.Donation).count()
    ref_num = f"TXN-2026-90{100 + count}"

    don = models.Donation(
        campaign_id=payload.campaign_id,
        campaign_name=cmp.title if cmp else "General Parish Development Fund",
        donor_name=payload.donor_name if not payload.is_anonymous else "Anonymous Benefactor",
        donor_email=payload.donor_email if not payload.is_anonymous else None,
        amount=payload.amount,
        date="2026-09-25",
        payment_status="Completed",
        reference_number=ref_num,
        is_anonymous=payload.is_anonymous,
        notes=payload.notes
    )
    db.add(don)

    if cmp:
        cmp.raised_amount += payload.amount

    db.commit()
    db.refresh(don)
    return don
