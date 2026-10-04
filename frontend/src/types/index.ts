export type UserRole = 'super_admin' | 'parish_admin' | 'committee_leader' | 'volunteer' | 'member' | 'viewer';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
}

export interface Member {
  id: number;
  user_id?: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: string;
  gender?: string;
  family_id?: number;
  family_name?: string;
  membership_status: 'active' | 'inactive' | 'pending';
  emergency_contact?: string;
  joined_date?: string;
  bio?: string;
}

export interface Family {
  id: number;
  name: string;
  primary_contact?: string;
  address?: string;
  phone?: string;
  emergency_contact?: string;
  member_count?: number;
  notes?: string;
}

export interface Committee {
  id: number;
  name: string;
  description?: string;
  leader_name?: string;
  category?: string;
  goals?: string;
  volunteer_count?: number;
}

export interface Volunteer {
  id: number;
  member_id: number;
  member_name?: string;
  email?: string;
  phone?: string;
  skills?: string;
  availability?: string;
  interests?: string;
  committee_name?: string;
  status: string;
  total_hours: number;
  recognition_level: string;
}

export interface VolunteerAssignment {
  id: number;
  volunteer_id: number;
  volunteer_name?: string;
  event_id?: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
  responsibilities?: string;
  hours_logged: number;
}

export interface VolunteerHour {
  id: number;
  volunteer_id: number;
  volunteer_name?: string;
  activity_name: string;
  date: string;
  hours: number;
  status: string;
  notes?: string;
}

export interface Service {
  id: number;
  name: string;
  category: string;
  description?: string;
  eligibility?: string;
  contact_person?: string;
  location?: string;
  schedule?: string;
  capacity: number;
  status: string;
  required_documents?: string;
  request_count?: number;
}

export interface ServiceRequest {
  id: number;
  request_number: string;
  service_id: number;
  member_id: number;
  member_name: string;
  service_name: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Assigned' | 'In Progress' | 'Completed' | 'Rejected';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  details?: string;
  notes?: string;
  created_at?: string;
}

export interface SupportCase {
  id: number;
  case_number: string;
  member_id: number;
  member_name: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  title: string;
  description?: string;
  assigned_staff?: string;
  status: 'New' | 'Under Review' | 'Approved' | 'In Progress' | 'Resolved' | 'Closed';
  created_date?: string;
  follow_up_date?: string;
  assistance_provided?: string;
  notes?: string;
}

export interface CaseNote {
  id: number;
  case_id: number;
  author_name: string;
  note: string;
  is_private: boolean;
  created_at?: string;
}

export interface Event {
  id: number;
  name: string;
  description?: string;
  category: string;
  location: string;
  start_time: string;
  end_time: string;
  organizer: string;
  capacity: number;
  registered_count: number;
  registration_deadline?: string;
  status: string;
  image_url?: string;
}

export interface EventRegistration {
  id: number;
  event_id: number;
  member_id: number;
  member_name: string;
  email: string;
  registration_date: string;
  status: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  audience: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: string;
  publish_date?: string;
  expiry_date?: string;
  author_name?: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  category: string;
  is_read: boolean;
  link?: string;
  created_at?: string;
}

export interface Campaign {
  id: number;
  title: string;
  description?: string;
  goal_amount: number;
  raised_amount: number;
  start_date?: string;
  end_date?: string;
  status: string;
  organizer?: string;
  image_url?: string;
  donor_count?: number;
  progress_percent?: number;
}

export interface Donation {
  id: number;
  campaign_id?: number;
  campaign_name?: string;
  donor_name: string;
  donor_email?: string;
  amount: number;
  date: string;
  payment_status: string;
  reference_number: string;
  is_anonymous: boolean;
  notes?: string;
}

export interface DocumentItem {
  id: number;
  title: string;
  category: string;
  file_path: string;
  file_size: string;
  file_type: string;
  access_level: string;
  version: string;
  description?: string;
  uploaded_by?: string;
  created_at?: string;
}

export interface Partner {
  id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  partner_type: string;
  description?: string;
  status: string;
  contribution_details?: string;
}

export interface SOPItem {
  id: number;
  code: string;
  title: string;
  category: string;
  version: string;
  owner: string;
  status: string;
  effective_date?: string;
  steps_json?: string;
}

export interface KPIItem {
  id: number;
  name: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  period: string;
  status: string;
  owner: string;
  trend: string;
  progress_percent?: number;
}

export interface AuditLogItem {
  id: number;
  user_id?: number;
  user_name: string;
  user_role: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  details?: string;
  ip_address?: string;
  created_at?: string;
}
