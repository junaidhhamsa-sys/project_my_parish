# 04. Database Schema & Entity Relationship Design

## Database Entity Overview (24 Normalized Entities)

1. `users` (id, email, password_hash, full_name, phone, role, is_active, avatar_url, created_at)
2. `members` (id, user_id, first_name, last_name, email, phone, address, date_of_birth, gender, family_id, membership_status, emergency_contact, joined_date, bio)
3. `families` (id, name, primary_contact, address, phone, emergency_contact, notes)
4. `committees` (id, name, description, leader_name, leader_id, category, goals)
5. `committee_members` (id, committee_id, member_id, role_in_committee, joined_date)
6. `volunteers` (id, member_id, skills, availability, interests, committee_name, status, total_hours, recognition_level)
7. `volunteer_assignments` (id, volunteer_id, event_id, title, description, start_date, end_date, priority, status, responsibilities, hours_logged)
8. `volunteer_hours` (id, volunteer_id, assignment_id, activity_name, date, hours, status, notes)
9. `services` (id, name, category, description, eligibility, contact_person, location, schedule, capacity, status, required_documents)
10. `service_requests` (id, request_number, service_id, member_id, member_name, service_name, status, priority, details, notes)
11. `support_cases` (id, case_number, member_id, member_name, category, priority, title, description, assigned_staff, status, created_date, follow_up_date, assistance_provided, notes)
12. `case_notes` (id, case_id, author_name, note, is_private, created_at)
13. `events` (id, name, description, category, location, start_time, end_time, organizer, capacity, registered_count, registration_deadline, status, image_url)
14. `event_registrations` (id, event_id, member_id, member_name, email, registration_date, status, notes)
15. `announcements` (id, title, content, category, audience, priority, status, publish_date, expiry_date, author_name)
16. `notifications` (id, user_id, title, message, category, is_read, link)
17. `campaigns` (id, title, description, goal_amount, raised_amount, start_date, end_date, status, organizer, image_url)
18. `donations` (id, campaign_id, campaign_name, donor_name, donor_email, amount, date, payment_status, reference_number, is_anonymous, notes)
19. `documents` (id, title, category, file_path, file_size, file_type, access_level, version, description, uploaded_by)
20. `partners` (id, name, contact_person, email, phone, partner_type, description, status, contribution_details)
21. `sops` (id, code, title, category, version, owner, status, effective_date, review_date, steps_json)
22. `kpis` (id, name, category, target_value, current_value, unit, period, status, owner, trend)
23. `audit_logs` (id, user_id, user_name, user_role, action, resource_type, resource_id, details, ip_address, created_at)

## Indexes & Constraints
- Foreign key constraints linking `members` -> `families`, `volunteers` -> `members`, `service_requests` -> `services` & `members`, `support_cases` -> `members`.
- Indexes on `email`, `request_number`, `case_number`, and `reference_number`.
