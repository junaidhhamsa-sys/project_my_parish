from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/ai", tags=["AI Community Assistant"])

@router.post("/query")
def process_ai_query(payload: schemas.AIQueryRequest, db: Session = Depends(get_db)):
    q = payload.question.lower().strip()

    # Controlled structured database queries based on query intent
    if "volunteer" in q:
        v_count = db.query(models.Volunteer).filter(models.Volunteer.status == "Active").count()
        tot_hours = db.query(models.Volunteer).all()
        sum_hours = sum(v.total_hours for v in tot_hours)
        return {
            "answer": f"We currently have **{v_count} active volunteers** in the parish who have contributed a total of **{sum_hours:.1f} volunteer hours** across 7 community committees!",
            "data_summary": {"active_volunteers": v_count, "total_hours_logged": sum_hours},
            "suggested_actions": ["View Volunteers", "Assign Volunteer Task"]
        }

    elif "event" in q:
        upcoming = db.query(models.Event).filter(models.Event.status.in_(["Published", "Registration Open"])).all()
        titles = [f"• **{e.name}** ({e.start_time})" for e in upcoming[:3]]
        return {
            "answer": f"There are **{len(upcoming)} upcoming events** scheduled:\n\n" + "\n".join(titles),
            "data_summary": {"upcoming_count": len(upcoming)},
            "suggested_actions": ["View Events Calendar", "Create Event"]
        }

    elif "welfare" in q or "case" in q:
        open_c = db.query(models.SupportCase).filter(models.SupportCase.status.in_(["New", "Under Review", "In Progress"])).count()
        critical_c = db.query(models.SupportCase).filter(models.SupportCase.priority == "Critical").count()
        return {
            "answer": f"There are currently **{open_c} open welfare support cases** requiring administration. **{critical_c} case(s)** are flagged as Critical Priority.",
            "data_summary": {"open_cases": open_c, "critical_cases": critical_c},
            "suggested_actions": ["View Welfare Cases", "Review Support Requests"]
        }

    elif "service" in q or "demand" in q:
        s_count = db.query(models.Service).count()
        req_count = db.query(models.ServiceRequest).count()
        return {
            "answer": f"The parish operates **{s_count} active community services**. Welfare Food Baskets and Free Healthcare Clinics have experienced the highest member demand this month with **{req_count} total service requests** processed.",
            "data_summary": {"total_services": s_count, "total_requests": req_count},
            "suggested_actions": ["View Services", "Request Service"]
        }

    elif "donation" in q or "fund" in q or "money" in q:
        donations = db.query(models.Donation).all()
        total_raised = sum(d.amount for d in donations)
        return {
            "answer": f"Parish fundraising campaigns have raised a total of **${total_raised:,.2f}** across 5 active development campaigns, supported by {len(donations)} donations.",
            "data_summary": {"total_raised": total_raised, "total_donations": len(donations)},
            "suggested_actions": ["View Campaigns", "Record Donation"]
        }

    else:
        mem_count = db.query(models.Member).count()
        vol_count = db.query(models.Volunteer).count()
        return {
            "answer": f"Welcome to the **My Parish My Proud AI Assistant**! Our community platform is serving **{mem_count} registered members** with **{vol_count} active volunteers**. How can I assist you with parish events, services, or reports today?",
            "data_summary": {"members": mem_count, "volunteers": vol_count},
            "suggested_actions": ["View Dashboard", "Community Analytics", "Parish SOPs"]
        }
