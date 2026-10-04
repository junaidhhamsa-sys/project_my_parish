# 06. Roles and Permissions Matrix (RBAC)

## User Roles Hierarchy

| Role | System Scope & Permissions |
| :--- | :--- |
| **Super Admin** | Full system access, administrator management, audit log access, system configuration. |
| **Parish Admin** | Manage members, volunteers, committees, events, services, welfare cases, announcements, fundraising, documents. |
| **Committee Leader** | Manage assigned committee, activities, assigned volunteers, events, and reports. |
| **Volunteer** | View assigned activities, log volunteer hours, view events and community services. |
| **Member** | View profile, register for events, request services, submit support requests, view resources. |
| **Viewer / Auditor** | Read-only access to dashboards, reports, and stewardship metrics. |

## Permission Controls
- Sensitive welfare case access is restricted to `super_admin` and `parish_admin` roles.
- All sensitive access attempts emit an automated entry into `audit_logs`.
