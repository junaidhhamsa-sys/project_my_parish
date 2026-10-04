# 05. REST API Documentation

## Auth Endpoints
- `POST /api/v1/auth/login`: Authenticate user, return JWT access token.
- `POST /api/v1/auth/register`: Register new parish user and member profile.
- `GET /api/v1/auth/me`: Fetch authenticated user context.

## Member & Family Endpoints
- `GET /api/v1/members`: Search and list parish members with pagination.
- `GET /api/v1/members/{id}`: Fetch member profile, volunteer record, and registrations.
- `POST /api/v1/members`: Create member.
- `GET /api/v1/families`: List household family units.

## Service & Welfare Endpoints
- `GET /api/v1/services`: List community services catalog.
- `POST /api/v1/services/requests`: Submit service request.
- `PATCH /api/v1/services/requests/{id}/status`: Update request workflow status.
- `GET /api/v1/welfare/cases`: Confidential support case listing (Audited).
- `POST /api/v1/welfare/cases`: Create welfare case.
- `POST /api/v1/welfare/cases/{id}/notes`: Add private case note.

## Event Endpoints
- `GET /api/v1/events`: List events.
- `POST /api/v1/events/register`: Register member for event.

## Fundraising Endpoints
- `GET /api/v1/fundraising/campaigns`: List development campaigns.
- `POST /api/v1/fundraising/donations`: Record contribution and issue receipt.

## AI Assistant & Analytics
- `POST /api/v1/ai/query`: Process natural language community questions.
- `GET /api/v1/analytics/dashboard-summary`: Executive KPIs & chart data.
