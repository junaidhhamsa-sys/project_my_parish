# 02. System Architecture & Tech Stack

## Architectural Overview
The platform follows a decoupled client-server architecture built for high availability, security, and scalability.

```
[ React 18 + Vite + Tailwind CSS ]  <--- HTTP/JSON REST --->  [ FastAPI Python Backend ]
        |                                                                |
 [ Recharts + Lucide ]                                         [ SQLAlchemy ORM Engine ]
                                                                         |
                                                               [ SQLite / PostgreSQL DB ]
```

## Layer Component Breakdown

### Frontend Layer
- **Framework**: React 18 with TypeScript & Vite
- **Styling**: Tailwind CSS with custom Parish palette (`#0d9488` teal accent, slate neutrals)
- **UI Components**: Reusable StatCards, Badges, Modals, Drawers, DataTables
- **Analytics Visualization**: Recharts (Line, Bar, Area, Pie charts)
- **Icons**: Lucide React

### Backend API Layer
- **Framework**: Python FastAPI 0.141
- **Validation**: Pydantic v2 schemas
- **Security & JWT**: PyJWT + Passlib (pbkdf2_sha256 password hashing)
- **ORMs**: SQLAlchemy 2.0 with engine connection pooling

### Database Layer
- **Local Dev / Single Instance**: SQLite (`parish.db`) with zero-config auto-seeding
- **Production Enterprise**: PostgreSQL 15+ with normalized foreign keys and indexes

### Security Architecture
- Role-Based Access Control (RBAC) middleware
- Restricted sensitive case file access with automated Audit Logging
- CORS domain restrictions
