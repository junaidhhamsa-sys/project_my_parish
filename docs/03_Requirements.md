# 03. Functional & Non-Functional Requirements

## Functional Requirements (FR)
- **FR-1 Member Management**: Create, edit, search, filter, and export parish member profiles. Group members into family households.
- **FR-2 Volunteer Management**: Skill profiling, committee assignment, volunteer hours logging, recognition badge calculation.
- **FR-3 Community Services**: Service catalog management (Healthcare, Education, Welfare), service request submission, workflow status updates.
- **FR-4 Support Cases**: Confidential welfare intake, priority flags (Low, Medium, High, Critical), private case notes, audit access tracking.
- **FR-5 Event Management**: Calendar and grid views, event registration, capacity enforcement, registration notifications.
- **FR-6 Fundraising**: Active campaigns, donation logging with reference numbers, anonymous donor flags, tax receipts.
- **FR-7 AI Assistant**: Controlled natural language processing for parish metrics.

## Non-Functional Requirements (NFR)
- **NFR-1 Security**: Passwords stored as PBKDF2/bcrypt hashes. Sensitive welfare case views logged to audit database.
- **NFR-2 Performance**: Page load time under 1.5 seconds. API response latency under 150ms.
- **NFR-3 Responsiveness**: Fully responsive across Mobile, Tablet, Laptop, and Desktop screens.
