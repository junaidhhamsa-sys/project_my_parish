# MY PARISH MY PROUD — Community Development & Parish Management Platform

> **Enterprise-style community management platform built as a practical digital implementation of the 45-Day Community Development Framework.**

---

## 🌟 Overview
**MY PARISH MY PROUD** digitally transforms parish and community organization operations. It unifies administrators, committee leaders, volunteers, and parishioners into a single transparent, secure digital platform.

---

## 🚀 Key Features

### 🏛️ Community & Member Management
- **Member Directory**: Complete searchable & filterable member database with export options.
- **Family Households**: Group parish members into family units.
- **Committees**: Youth, Education, Healthcare, Welfare, Women Development, Events, Finance.

### 🤝 Volunteer Operations
- **Volunteer Profiling**: Skills, availability, and committee assignments.
- **Task Assignments**: Task priority, dates, and status workflow.
- **Hours Tracking**: Hour submission and automatic badge recognition (Bronze, Silver, Gold Star).
- **Recognition Wall**: Celebrate top community contributors.

### 🩺 Community Services & Healthcare
- **Service Catalog**: Free Medical Clinics, Literacy Tutoring, Food Baskets, Counseling.
- **Request Workflow**: Submitted -> Under Review -> Approved -> In Progress -> Completed.

### 🛡️ Confidential Welfare Management
- **Support Cases**: Emergency intake with priority flags (Low, Medium, High, Critical).
- **Sensitive Audit Logs**: Every case access attempt is logged for governance and security.

### 📅 Events & Registration
- **List & Calendar Views**: Event categories, venue capacity progress, registration modal.

### 💰 Fundraising & Stewardship
- **Campaign Progress**: Goal vs raised progress tracking.
- **Donation Ledger**: Double-entry transaction receipts with reference numbers (`TXN-2026-90XXX`).

### 🤖 AI Community Assistant
- **Natural Language Assistant**: Natural language query engine for parish analytics.

---

## 🛠️ Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router.
- **Backend**: Python FastAPI, Pydantic, SQLAlchemy 2.0, PyJWT, Passlib.
- **Database**: SQLite (local zero-config) / PostgreSQL (production).
- **DevOps**: Docker & Docker Compose.

---

## 🔑 Demo Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Super Admin** | `admin@example.com` | `admin123` |
| **Parish Admin** | `communityadmin@example.com` | `admin123` |
| **Committee Leader** | `leader@example.com` | `leader123` |
| **Lead Volunteer** | `volunteer@example.com` | `volunteer123` |
| **Member** | `member@example.com` | `member123` |

---

## 🏃 Quick Start Guide

### 1. Backend Startup
```bash
cd backend
../venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Startup
```bash
cd frontend
npm run dev -- --port 8089
```
Access in browser: `http://localhost:8089`

---

## 📁 Documentation Suite
Comprehensive documentation manuals in `/docs`:
- `01_Project_Overview.md`
- `02_System_Architecture.md`
- `03_Requirements.md`
- `04_Database_Design.md`
- `05_API_Documentation.md`
- `06_Roles_and_Permissions.md`
- `07_Community_Governance_Framework.md`
- `08_Volunteer_Framework.md`
- `09_Community_Services_Framework.md`
- `10_SOP_Manual.md`
- `11_Technology_Requirements.md`
- `12_Fundraising_Strategy.md`
- `13_Implementation_Roadmap.md`
- `14_KPI_Framework.md`
- `15_Security_and_Privacy.md`
- `16_Testing_Report.md`
- `17_Deployment_Guide.md`
# project_my_parish
# project_my_parish
