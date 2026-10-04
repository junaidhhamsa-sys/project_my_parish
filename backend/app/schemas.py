from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

class LoginRequest(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    phone: Optional[str] = None
    role: Optional[str] = "member"

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str] = None
    role: str
    is_active: bool
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

# Member Schemas
class MemberCreate(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    family_id: Optional[int] = None
    membership_status: Optional[str] = "active"
    emergency_contact: Optional[str] = None
    bio: Optional[str] = None

class MemberResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    first_name: str
    last_name: str
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    family_id: Optional[int] = None
    membership_status: str
    emergency_contact: Optional[str] = None
    joined_date: Optional[str] = None
    bio: Optional[str] = None

    class Config:
        from_attributes = True

class FamilyMemberAdd(BaseModel):
    member_id: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[str] = None

class FamilyCreate(BaseModel):
    name: str
    primary_contact: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    emergency_contact: Optional[str] = None
    notes: Optional[str] = None
    initial_members: Optional[List[FamilyMemberAdd]] = []

# Committee Schemas
class CommitteeCreate(BaseModel):
    name: str
    description: Optional[str] = None
    leader_name: Optional[str] = None
    category: Optional[str] = None
    goals: Optional[str] = None

# Volunteer Schemas
class VolunteerCreate(BaseModel):
    member_id: int
    skills: Optional[str] = None
    availability: Optional[str] = None
    interests: Optional[str] = None
    committee_name: Optional[str] = None
    emergency_contact: Optional[str] = None

class VolunteerAssignmentCreate(BaseModel):
    volunteer_id: int
    event_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    priority: Optional[str] = "Medium"
    responsibilities: Optional[str] = None

class VolunteerHourCreate(BaseModel):
    volunteer_id: int
    assignment_id: Optional[int] = None
    activity_name: str
    date: str
    hours: float
    notes: Optional[str] = None

# Service Schemas
class ServiceCreate(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    eligibility: Optional[str] = None
    contact_person: Optional[str] = None
    location: Optional[str] = None
    schedule: Optional[str] = None
    capacity: Optional[int] = 50
    required_documents: Optional[str] = None

class ServiceRequestCreate(BaseModel):
    service_id: int
    member_id: int
    priority: Optional[str] = "Medium"
    details: Optional[str] = None

class ServiceRequestUpdateStatus(BaseModel):
    status: str
    notes: Optional[str] = None

# Support Case Schemas
class SupportCaseCreate(BaseModel):
    member_id: Optional[int] = None
    member_name: Optional[str] = None
    category: str
    priority: Optional[str] = "Medium"
    title: str
    description: Optional[str] = None
    assigned_staff: Optional[str] = None
    follow_up_date: Optional[str] = None
    assistance_provided: Optional[str] = None

class SupportCaseStatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class CaseNoteCreate(BaseModel):
    case_id: int
    author_name: str
    note: str
    is_private: Optional[bool] = False

# Event Schemas
class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    location: str
    start_time: str
    end_time: str
    organizer: Optional[str] = "Parish Events Committee"
    capacity: Optional[int] = 100
    registration_deadline: Optional[str] = None
    image_url: Optional[str] = None

class EventRegistrationCreate(BaseModel):
    event_id: int
    member_id: int
    notes: Optional[str] = None

# Announcement Schemas
class AnnouncementCreate(BaseModel):
    title: str
    content: str
    category: Optional[str] = "General"
    audience: Optional[str] = "Everyone"
    priority: Optional[str] = "Normal"
    publish_date: Optional[str] = None
    expiry_date: Optional[str] = None

# Campaign & Donation Schemas
class CampaignCreate(BaseModel):
    title: str
    description: Optional[str] = None
    goal_amount: float
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    organizer: Optional[str] = "Finance Committee"
    image_url: Optional[str] = None

class DonationCreate(BaseModel):
    campaign_id: Optional[int] = None
    donor_name: str
    donor_email: Optional[str] = None
    amount: float
    is_anonymous: Optional[bool] = False
    notes: Optional[str] = None

# Document Schemas
class DocumentCreate(BaseModel):
    title: str
    category: str
    file_path: str
    file_size: Optional[str] = "1.2 MB"
    file_type: Optional[str] = "PDF"
    access_level: Optional[str] = "Public"
    version: Optional[str] = "v1.0"
    description: Optional[str] = None

# Partner Schemas
class PartnerCreate(BaseModel):
    name: str
    contact_person: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    partner_type: str
    description: Optional[str] = None
    contribution_details: Optional[str] = None

# KPI & SOP Schemas
class KPICreate(BaseModel):
    name: str
    category: str
    target_value: float
    current_value: float
    unit: Optional[str] = "count"
    period: Optional[str] = "2026 Q3"
    owner: Optional[str] = "Parish Secretariat"

class SOPCreate(BaseModel):
    code: str
    title: str
    category: str
    version: Optional[str] = "1.0"
    owner: Optional[str] = "Parish Council"
    effective_date: Optional[str] = None
    steps_json: Optional[str] = None

# AI Query Schema
class AIQueryRequest(BaseModel):
    question: str
