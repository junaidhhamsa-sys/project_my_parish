from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app import models

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_members = db.query(models.Member).count()
    active_volunteers = db.query(models.Volunteer).filter(models.Volunteer.status == "Active").count()
    upcoming_events = db.query(models.Event).filter(models.Event.status.in_(["Published", "Registration Open"])).count()
    open_cases = db.query(models.SupportCase).filter(models.SupportCase.status.in_(["New", "Under Review", "In Progress"])).count()
    
    total_raised = db.query(func.sum(models.Donation.amount)).scalar() or 0.0
    active_services = db.query(models.Service).filter(models.Service.status == "Active").count()
    service_requests_count = db.query(models.ServiceRequest).count()

    # Growth & Attendance trends (mocked realistic monthly trends)
    member_growth = [
        {"month": "May", "members": 620, "volunteers": 85},
        {"month": "Jun", "members": 680, "volunteers": 94},
        {"month": "Jul", "members": 730, "volunteers": 105},
        {"month": "Aug", "members": 790, "volunteers": 118},
        {"month": "Sep", "members": total_members, "volunteers": active_volunteers},
    ]

    service_breakdown = [
        {"name": "Healthcare", "requests": 42},
        {"name": "Education", "requests": 38},
        {"name": "Welfare", "requests": 55},
        {"name": "Counselling", "requests": 24},
        {"name": "Youth Programs", "requests": 31},
    ]

    fundraising_monthly = [
        {"month": "May", "raised": 28000},
        {"month": "Jun", "raised": 35000},
        {"month": "Jul", "raised": 42000},
        {"month": "Aug", "raised": 51000},
        {"month": "Sep", "raised": total_raised},
    ]

    recent_events = db.query(models.Event).order_by(models.Event.id.desc()).limit(5).all()
    recent_requests = db.query(models.ServiceRequest).order_by(models.ServiceRequest.id.desc()).limit(5).all()
    recent_donations = db.query(models.Donation).order_by(models.Donation.id.desc()).limit(5).all()
    announcements = db.query(models.Announcement).order_by(models.Announcement.id.desc()).limit(4).all()

    return {
        "kpis": {
            "total_members": total_members,
            "active_volunteers": active_volunteers,
            "upcoming_events": upcoming_events,
            "open_cases": open_cases,
            "total_raised": total_raised,
            "active_services": active_services,
            "service_requests_count": service_requests_count
        },
        "charts": {
            "member_growth": member_growth,
            "service_breakdown": service_breakdown,
            "fundraising_monthly": fundraising_monthly
        },
        "recent_events": recent_events,
        "recent_requests": recent_requests,
        "recent_donations": recent_donations,
        "announcements": announcements
    }
