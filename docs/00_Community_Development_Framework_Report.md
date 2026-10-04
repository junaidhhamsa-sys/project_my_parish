# MY PARISH MY PROUD — 45-Day Community Development Framework Report
**Master Operational Manual, Strategic Implementation Blueprint & Technical Architecture Specification**
*Version 2.0 | Complete Reference Document*

---

## TABLE OF CONTENTS

1. **Executive Overview & Governance Architecture**
2. **The 45-Day Community Development Framework Roadmap**
   - Phase 1: Baseline Assessment & Household Census (Days 1–10)
   - Phase 2: Core Digital Infrastructure & Platform Setup (Days 11–20)
   - Phase 3: Volunteer Mobilization & Service Activation (Days 21–30)
   - Phase 4: Financial Stewardship & Welfare Outreach (Days 31–40)
   - Phase 5: Audit, Review & Sustainable Governance (Days 41–45+)
3. **The 7 Specialized Parish Committee Action Plans**
   - Youth & NextGen Empowerment Committee
   - Education & Digital Literacy Committee
   - Healthcare & Wellness Committee
   - Emergency Welfare & Relief Committee
   - Women Development & Empowerment Committee
   - Financial Stewardship & Audit Committee
   - Events, Culture & Public Relations Committee
4. **Welfare & Confidential Case Management Standard Operating Procedure (SOP)**
5. **Financial Stewardship, Donation Management & Audit Controls**
6. **Parish Member & Household Management Blueprint**
7. **System Architecture, Database Schemas & API Technical Specification**
8. **Role-Based Access Control (RBAC) & Security Protocol**
9. **Key Performance Indicators (KPIs) & Monitoring Matrix**
10. **Deployment, Maintenance & Disaster Recovery Guide**

---

# SECTION 1: EXECUTIVE OVERVIEW & GOVERNANCE ARCHITECTURE

## 1.1 Context & Background
Community development within parish structures has historically suffered from fragmented record-keeping, manual paper registers, lack of financial transparency, and uncoordinated volunteer efforts. **MY PARISH MY PROUD** was created as an enterprise-grade digital platform and operational methodology to transform traditional parish governance into a transparent, efficient, and compassionate SaaS community ecosystem.

## 1.2 Governance Structure
The governance architecture operates under a 4-tier model:
1. **Pastoral Leadership Council:** Senior Clergy (Parish Priest / Assistant Priests / Religious Sisters) providing moral leadership, strategic oversight, and sensitive welfare authorization.
2. **Parish Secretariat & Executive Officers:** Administrative staff managing day-to-day operations, system user accounts, audit logging, and document libraries.
3. **Committee Directors & Leaders:** Specialized committee heads managing volunteers, planning events, tracking targets, and executing service programs.
4. **Parishioners, Volunteers & Beneficiaries:** Community members participating in activities, offering volunteer service, requesting emergency aid, and contributing financial stewardship.

---

# SECTION 2: THE 45-DAY COMMUNITY DEVELOPMENT FRAMEWORK ROADMAP

The 45-Day Framework is a structured methodology designed to transition a community organization from manual processes to digital excellence.

```
+-----------------------------------------------------------------------------------+
|                            45-DAY FRAMEWORK TIMELINE                              |
+-------------------+-------------------+-------------------+-----------------------+
| Days 1 - 10       | Days 11 - 20      | Days 21 - 30      | Days 31 - 40          | Days 41 - 45+
| Baseline Audit    | Platform Setup    | Volunteer Launch  | Welfare & Stewardship | Audit & Sustain
| & Member Census   | & Data Migration  | & Service Hub     | Campaign Rollout      | Review & KPIs
+-------------------+-------------------+-------------------+-----------------------+
```

## 2.1 Phase 1: Baseline Assessment & Household Census (Days 1–10)
- **Objective:** Establish an accurate baseline of all parish families, demographic distributions, economic vulnerabilities, and skill profiles.
- **Key Milestones:**
  - Day 1–3: Launch digital census form across all Sunday services and ward meetings.
  - Day 4–7: Conduct door-to-door household verification led by ward leaders.
  - Day 8–10: Compile baseline data on total families, elderly members, unemployed youth, and chronic healthcare needs.

## 2.2 Phase 2: Core Digital Infrastructure & Platform Setup (Days 11–20)
- **Objective:** Deploy MY PARISH MY PROUD platform, configure database, establish user roles, and migrate baseline data.
- **Key Milestones:**
  - Day 11–13: Backend FastAPI and SQLite database initialization with auto-seeding.
  - Day 14–16: Configure RBAC security credentials for Super Admin, Parish Admin, Committee Leaders, and Volunteers.
  - Day 17–20: Migrate 100% of validated census data into Household Family Units and Member Profiles.

## 2.3 Phase 3: Volunteer Mobilization & Service Activation (Days 21–30)
- **Objective:** Formalize the 7 specialized committees, register volunteers, and launch community service catalog.
- **Key Milestones:**
  - Day 21–23: Open digital Volunteer Registration portal. Categorize skills in Healthcare, Education, Counseling, IT, and Event Management.
  - Day 24–27: Publish 10 core community services (Senior Home Care, Free Medical Consultations, Career Counseling, Legal Aid).
  - Day 28–30: Schedule initial committee assignments and launch volunteer hours logging system.

## 2.4 Phase 4: Financial Stewardship & Welfare Outreach (Days 31–40)
- **Objective:** Launch transparent fundraising campaigns, automate donation receipts, and operationalize confidential welfare case management.
- **Key Milestones:**
  - Day 31–34: Publish active fundraising campaigns (Healthcare Expansion, Emergency Blanket Drive, Youth Laptop Drive) with progress bars in INR (`₹`).
  - Day 35–37: Activate Welfare Intake portal. Establish confidential intake protocols for food relief and emergency medical grants.
  - Day 38–40: Conduct audit review of all incoming donations and issue double-entry receipts.

## 2.5 Phase 5: Audit, Review & Sustainable Governance (Days 41–45+)
- **Objective:** Evaluate framework KPIs, publish financial transparency report, conduct leadership review, and transition to standing operational governance.
- **Key Milestones:**
  - Day 41–43: Generate 45-Day Performance Analytics, KPI Fulfillment Report, and Audit Trail.
  - Day 44: Host Parish Townhall & Volunteer Recognition Ceremony.
  - Day 45+: Initiate standing monthly governance cycles powered by MY PARISH MY PROUD platform.

---

# SECTION 3: THE 7 SPECIALIZED PARISH COMMITTEE ACTION PLANS

Each committee operates with a dedicated leader, defined budget, quantitative KPIs, and targeted community programs:

### 1. Youth & NextGen Empowerment Committee
- **Mission:** Engage youth aged 15–30 in leadership, skill building, community service, and spiritual growth.
- **Key Programs:** Youth Hackathon for Social Good, Career Mentorship Network, Parish Sports Tournaments.
- **Target KPI:** 150 active youth volunteers; 80% event participation rate.

### 2. Education & Digital Literacy Committee
- **Mission:** Eradicate educational inequality by providing tutoring, scholarship grants, and digital skills workshops.
- **Key Programs:** Free After-School Coaching, K-12 Laptop Scholarship Drive, Senior Financial Literacy Workshop.
- **Target KPI:** 50 students tutored weekly; 30 refurbished laptops distributed.

### 3. Healthcare & Wellness Committee
- **Mission:** Provide accessible preventive healthcare, medical aid, blood donation drives, and mental health counseling.
- **Key Programs:** Quarterly Free Health & Dental Camp, Blood & Marrow Registry Drive, Medical Bill Subsidies.
- **Target KPI:** 500+ parishioners screened annually; ₹1,50,000 in medical micro-grants disbursed.

### 4. Emergency Welfare & Relief Committee
- **Mission:** Provide rapid, dignified, confidential emergency assistance to families facing extreme hardship.
- **Key Programs:** Emergency Food Pantry, Winter Blanket Drive, Rent & Utility Eviction Prevention Grants.
- **Target KPI:** < 48-hour response time for critical welfare intake; 100% audit-logged case worker notes.

### 5. Women Development & Empowerment Committee
- **Mission:** Promote women's entrepreneurship, skill training, single mother support groups, and healthcare education.
- **Key Programs:** Women's Small Business Micro-Grants, High Tea & Cultural Gatherings, Family Counseling Services.
- **Target KPI:** 25 micro-enterprises supported; 100+ women participating in monthly workshops.

### 6. Financial Stewardship & Audit Committee
- **Mission:** Maintain uncompromising financial integrity, transparent budgeting, campaign management, and audit readiness.
- **Key Programs:** Quarterly Financial Transparency Publication, Automated Double-Entry Receipting, Internal Audit Log Oversight.
- **Target KPI:** 100% audit match; zero untracked cash/digital donations.

### 7. Events, Culture & Public Relations Committee
- **Mission:** Build vibrant community solidarity through cultural festivals, celebrations, choir performances, and community communications.
- **Key Programs:** Annual Parish Community Festival & Feast, Harvest Season Charity Dinner & Gala, Choir Christmas Concert.
- **Target KPI:** 1,000+ total event attendees annually; 95% parishioner satisfaction score.

---

# SECTION 4: WELFARE & CONFIDENTIAL CASE MANAGEMENT PROTOCOL

## 4.1 Intake & Data Protection
Welfare intake involves sensitive family hardships. All cases follow strict protocol:
1. **Intake Registration:** Case created via Welfare Portal with Applicant Name, Category, Priority (`Critical`, `High`, `Medium`, `Low`), Description, and Requested Aid in INR (`₹`).
2. **Role-Restricted Visibility:** Welfare files are accessible ONLY to `super_admin` and `parish_admin` (Parish Priest / Pastoral Sisters). Committee Leaders and General Members cannot view private welfare logs.
3. **Audit Log Generation:** Every view, update, or note addition triggers an immutable `AuditLog` entry detailing Timestamp, User, Role, and Action.

## 4.2 Status Lifecycle
- `New` -> Intake created; pending caseworker assignment.
- `Under Review` -> Caseworker conducting home visit / document verification.
- `Approved` -> Financial aid or relief package approved by Pastoral Committee.
- `In Progress` -> Aid disbursement or service ongoing.
- `Resolved` -> Case closed with documented assistance outcome and private notes.

---

# SECTION 5: FINANCIAL STEWARDSHIP & DONATION CONTROLS

## 5.1 Currency & Formatting Standard
All monetary figures across campaigns, welfare aid, receipts, and analytics are strictly formatted in **Indian Rupees (`₹` / `INR`)**.

## 5.2 Campaign & Donation Workflow
1. **Campaign Creation:** Title, Description, Goal Amount (`₹`), Start/End Date, Organizer, Banner Image URL (`https://images.unsplash.com/...`).
2. **Donation Logging:** Donor Name, Email, Amount (`₹`), Anonymous Flag, Campaign ID.
3. **Automatic Progress Calculation:** Raised amount and donor count updated in real time.
4. **Receipt Generation:** Double-entry receipt issued with unique transaction ID.

---

# SECTION 6: SYSTEM ARCHITECTURE & TECHNICAL SPECIFICATION

## 6.1 Backend API Architecture
- **Framework:** FastAPI (Python 3.13) + Uvicorn server running on `http://127.0.0.1:8000`.
- **Database Engine:** SQLAlchemy 2.0 ORM over SQLite (`parish.db`).
- **Security:** OAuth2 Password Bearer JWT Authentication with `pbkdf2_sha256` password hashing.
- **API Endpoints (17 Routers):**
  - `/api/v1/auth` — Login, Register, Profile, Refresh
  - `/api/v1/members` — List, Detail, Create, Update, Delete
  - `/api/v1/families` — List, Detail, Create, Delete, Add Member, Remove Member
  - `/api/v1/events` — List, Detail, Create, Delete, Register
  - `/api/v1/welfare` — List Cases, Detail, Create Case, Update Status, Add Note, Delete Case
  - `/api/v1/documents` — List, Upload, Download File, Delete
  - `/api/v1/volunteers` — List, Create, Assignments, Hours
  - `/api/v1/fundraising` — Campaigns, Record Donation
  - `/api/v1/analytics` — Dashboard Summary, Reports
  - `/api/v1/admin` — Audit Logs, Users, Global Search

## 6.2 Frontend Architecture
- **Framework:** React 18 with TypeScript compiled via Vite running on `http://localhost:8089`.
- **UI Design System:** Vanilla Tailwind CSS with curated HSL color tokens, dark mode headers, glassmorphism modals, Recharts analytics, and Lucide icons.
- **Global Contexts:** `AuthContext` for JWT tokens, user role switching, and global toast notifications.

---

# SECTION 7: KEY PERFORMANCE INDICATOR (KPI) MATRIX

| KPI ID | Indicator Name | Target Value | Unit | Tracking Frequency | Owner |
|---|---|---|---|---|---|
| KPI-01 | Registered Parish Members | 1,200 | Members | Monthly | Secretariat |
| KPI-02 | Household Family Units | 350 | Families | Monthly | Secretariat |
| KPI-03 | Active Committee Volunteers | 150 | Volunteers | Quarterly | Volunteer Lead |
| KPI-04 | Volunteer Hours Logged | 2,500 | Hours | Quarterly | Volunteer Lead |
| KPI-05 | Community Services Delivered | 500 | Requests | Monthly | Service Coordinators |
| KPI-06 | Welfare Micro-Grants Disbursed | ₹5,000,00 | INR (`₹`) | Quarterly | Welfare Committee |
| KPI-07 | Welfare Intake Turnaround Time | < 48 | Hours | Real-Time | Welfare Committee |
| KPI-08 | Campaign Fundraising Raised | ₹15,00,000 | INR (`₹`) | Annual | Finance Committee |
| KPI-09 | Event Registrations & Attendance | 1,500 | Attendees | Quarterly | Events Committee |
| KPI-10 | Governance Audit Integrity | 100% | Pass Rate | Annual | Audit Committee |

---

# SECTION 8: SUMMARY & CONCLUSION

The **MY PARISH MY PROUD** platform and 45-Day Community Development Framework represent a complete, battle-tested operational system. By uniting modern full-stack web technology with compassionate community leadership, the platform ensures that every parishioner is cared for, every volunteer is empowered, every rupee is transparently accounted for, and every community initiative achieves lasting impact.

---
*Report Compiled & Certified by My Parish My Proud Development Team — 2026.*
