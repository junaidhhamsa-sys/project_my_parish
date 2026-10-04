import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

def utcnow():
    return datetime.datetime.utcnow()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    role = Column(String, default="member", nullable=False) # super_admin, parish_admin, committee_leader, volunteer, member, viewer
    is_active = Column(Boolean, default=True)
    avatar_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Member(Base):
    __tablename__ = "members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    address = Column(String, nullable=True)
    date_of_birth = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=True)
    membership_status = Column(String, default="active") # active, inactive, pending
    emergency_contact = Column(String, nullable=True)
    joined_date = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    family = relationship("Family", back_populates="members")

class Family(Base):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    primary_contact = Column(String, nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    emergency_contact = Column(String, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

    members = relationship("Member", back_populates="family")

class Committee(Base):
    __tablename__ = "committees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    leader_name = Column(String, nullable=True)
    leader_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    category = Column(String, nullable=True)
    goals = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class CommitteeMember(Base):
    __tablename__ = "committee_members"

    id = Column(Integer, primary_key=True, index=True)
    committee_id = Column(Integer, ForeignKey("committees.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    role_in_committee = Column(String, default="Member")
    joined_date = Column(String, nullable=True)

class Volunteer(Base):
    __tablename__ = "volunteers"

    id = Column(Integer, primary_key=True, index=True)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    skills = Column(String, nullable=True) # Comma separated
    availability = Column(String, nullable=True)
    interests = Column(String, nullable=True)
    committee_name = Column(String, nullable=True)
    status = Column(String, default="Active") # Active, Inactive, On Leave
    total_hours = Column(Float, default=0.0)
    recognition_level = Column(String, default="Bronze Star")
    emergency_contact = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class VolunteerAssignment(Base):
    __tablename__ = "volunteer_assignments"

    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id"), nullable=False)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    priority = Column(String, default="Medium") # Low, Medium, High
    status = Column(String, default="Assigned") # Pending, Assigned, In Progress, Completed, Cancelled
    responsibilities = Column(Text, nullable=True)
    hours_logged = Column(Float, default=0.0)
    created_at = Column(DateTime, default=utcnow)

class VolunteerHour(Base):
    __tablename__ = "volunteer_hours"

    id = Column(Integer, primary_key=True, index=True)
    volunteer_id = Column(Integer, ForeignKey("volunteers.id"), nullable=False)
    assignment_id = Column(Integer, ForeignKey("volunteer_assignments.id"), nullable=True)
    activity_name = Column(String, nullable=False)
    date = Column(String, nullable=False)
    hours = Column(Float, nullable=False)
    status = Column(String, default="Approved")
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Education, Healthcare, Welfare, Counselling, Youth, Family Support, Emergency Assistance
    description = Column(Text, nullable=True)
    eligibility = Column(Text, nullable=True)
    contact_person = Column(String, nullable=True)
    location = Column(String, nullable=True)
    schedule = Column(String, nullable=True)
    capacity = Column(Integer, default=50)
    status = Column(String, default="Active")
    required_documents = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class ServiceRequest(Base):
    __tablename__ = "service_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_number = Column(String, unique=True, index=True, nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    member_name = Column(String, nullable=False)
    service_name = Column(String, nullable=False)
    status = Column(String, default="Submitted") # Submitted, Under Review, Approved, Assigned, In Progress, Completed, Rejected
    priority = Column(String, default="Medium")
    details = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

class SupportCase(Base):
    __tablename__ = "support_cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True, nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    member_name = Column(String, nullable=False)
    category = Column(String, nullable=False) # Food & Basic Needs, Healthcare Relief, Financial Aid, Housing Support, Family Crisis
    priority = Column(String, default="Medium") # Low, Medium, High, Critical
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    assigned_staff = Column(String, nullable=True)
    status = Column(String, default="New") # New, Under Review, Approved, In Progress, Resolved, Closed
    created_date = Column(String, nullable=True)
    follow_up_date = Column(String, nullable=True)
    assistance_provided = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class CaseNote(Base):
    __tablename__ = "case_notes"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("support_cases.id"), nullable=False)
    author_name = Column(String, nullable=False)
    note = Column(Text, nullable=False)
    is_private = Column(Boolean, default=False)
    created_at = Column(DateTime, default=utcnow)

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=False) # Community, Education, Youth, Welfare, Fundraising, Healthcare, Cultural, Volunteer
    location = Column(String, nullable=False)
    start_time = Column(String, nullable=False)
    end_time = Column(String, nullable=False)
    organizer = Column(String, default="Parish Events Committee")
    capacity = Column(Integer, default=100)
    registered_count = Column(Integer, default=0)
    registration_deadline = Column(String, nullable=True)
    status = Column(String, default="Published") # Draft, Published, Registration Open, Registration Closed, Completed, Cancelled
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class EventRegistration(Base):
    __tablename__ = "event_registrations"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"), nullable=False)
    member_id = Column(Integer, ForeignKey("members.id"), nullable=False)
    member_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    registration_date = Column(String, nullable=False)
    status = Column(String, default="Registered") # Registered, Attended, Cancelled, Waitlist
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, default="General")
    audience = Column(String, default="Everyone") # Everyone, Members, Volunteers, Youth, Families, Committee
    priority = Column(String, default="Normal") # Low, Normal, High, Urgent
    status = Column(String, default="Published") # Draft, Published, Scheduled, Expired
    publish_date = Column(String, nullable=True)
    expiry_date = Column(String, nullable=True)
    author_name = Column(String, default="Parish Admin")
    created_at = Column(DateTime, default=utcnow)

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String, default="General")
    is_read = Column(Boolean, default=False)
    link = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Campaign(Base):
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    goal_amount = Column(Float, nullable=False)
    raised_amount = Column(Float, default=0.0)
    start_date = Column(String, nullable=True)
    end_date = Column(String, nullable=True)
    status = Column(String, default="Active") # Active, Completed, Upcoming
    organizer = Column(String, default="Parish Finance Committee")
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Donation(Base):
    __tablename__ = "donations"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(Integer, ForeignKey("campaigns.id"), nullable=True)
    campaign_name = Column(String, nullable=True)
    donor_name = Column(String, nullable=False)
    donor_email = Column(String, nullable=True)
    amount = Column(Float, nullable=False)
    date = Column(String, nullable=False)
    payment_status = Column(String, default="Completed") # Completed, Pending, Failed
    reference_number = Column(String, unique=True, nullable=False)
    is_anonymous = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False) # Policies, Forms, Reports, Guidelines, Meeting Documents, Community Resources
    file_path = Column(String, nullable=False)
    file_size = Column(String, default="1.2 MB")
    file_type = Column(String, default="PDF")
    access_level = Column(String, default="Public") # Public, Members, Admin
    version = Column(String, default="v1.0")
    description = Column(Text, nullable=True)
    uploaded_by = Column(String, default="Parish Admin")
    created_at = Column(DateTime, default=utcnow)

class Partner(Base):
    __tablename__ = "partners"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_person = Column(String, nullable=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    partner_type = Column(String, nullable=False) # NGO, School, Hospital, Business, Government, Community Organization
    description = Column(Text, nullable=True)
    status = Column(String, default="Active")
    contribution_details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=utcnow)

class SOP(Base):
    __tablename__ = "sops"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    version = Column(String, default="1.0")
    owner = Column(String, default="Parish Council")
    status = Column(String, default="Active")
    effective_date = Column(String, nullable=True)
    review_date = Column(String, nullable=True)
    steps_json = Column(Text, nullable=True) # JSON serialized steps
    created_at = Column(DateTime, default=utcnow)

class KPI(Base):
    __tablename__ = "kpis"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    target_value = Column(Float, nullable=False)
    current_value = Column(Float, nullable=False)
    unit = Column(String, default="count")
    period = Column(String, default="2026 Q3")
    status = Column(String, default="On Track") # On Track, At Risk, Needs Attention, Completed
    owner = Column(String, default="Parish Secretariat")
    trend = Column(String, default="+12%")
    created_at = Column(DateTime, default=utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_name = Column(String, nullable=False)
    user_role = Column(String, nullable=False)
    action = Column(String, nullable=False)
    resource_type = Column(String, nullable=False)
    resource_id = Column(String, nullable=True)
    details = Column(Text, nullable=True)
    ip_address = Column(String, default="127.0.0.1")
    created_at = Column(DateTime, default=utcnow)
