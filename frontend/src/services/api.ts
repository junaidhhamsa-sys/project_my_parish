// Production API Base URL
const DEFAULT_API_URL = 'https://project-my-parish.onrender.com/api/v1';

// Normalize API_BASE to handle trailing slashes and ensure /api/v1 prefix
const getApiBase = () => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_URL).trim().replace(/\/+$/, '');
  if (!envUrl) return DEFAULT_API_URL;
  return envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;
};

const API_BASE = getApiBase();

async function fetchJson(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('parish_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(errData.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`API request to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Auth
  login: (email: string, pass: string) => fetchJson('/auth/login', { method: 'POST', body: JSON.stringify({ email, password: pass }) }),
  getMe: () => fetchJson('/auth/me'),
  register: (data: any) => fetchJson('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  // Dashboard & Analytics
  getDashboardSummary: () => fetchJson('/analytics/dashboard-summary'),

  // Members
  getMembers: (params?: { search?: string; status?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetchJson(`/members?${q}`);
  },
  getMemberDetail: (id: number) => fetchJson(`/members/${id}`),
  createMember: (data: any) => fetchJson('/members', { method: 'POST', body: JSON.stringify(data) }),

  // Families
  getFamilies: (search?: string) => fetchJson(`/families${search ? `?search=${encodeURIComponent(search)}` : ''}`),
  getFamilyDetail: (id: number) => fetchJson(`/families/${id}`),
  createFamily: (data: any) => fetchJson('/families', { method: 'POST', body: JSON.stringify(data) }),
  deleteFamily: (id: number) => fetchJson(`/families/${id}`, { method: 'DELETE' }),
  addMemberToFamily: (familyId: number, data: any) => fetchJson(`/families/${familyId}/members`, { method: 'POST', body: JSON.stringify(data) }),
  removeMemberFromFamily: (familyId: number, memberId: number) => fetchJson(`/families/${familyId}/members/${memberId}`, { method: 'DELETE' }),
  deleteMember: (memberId: number) => fetchJson(`/members/${memberId}`, { method: 'DELETE' }),

  // Committees
  getCommittees: () => fetchJson('/committees'),
  getCommitteeDetail: (id: number) => fetchJson(`/committees/${id}`),

  // Volunteers
  getVolunteers: (params?: { search?: string; committee?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetchJson(`/volunteers?${q}`);
  },
  getAssignments: () => fetchJson('/volunteers/assignments'),
  createAssignment: (data: any) => fetchJson('/volunteers/assignments', { method: 'POST', body: JSON.stringify(data) }),
  logHours: (data: any) => fetchJson('/volunteers/hours', { method: 'POST', body: JSON.stringify(data) }),
  getHours: () => fetchJson('/volunteers/hours'),

  // Services
  getServices: (category?: string) => fetchJson(`/services${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  createService: (data: any) => fetchJson('/services', { method: 'POST', body: JSON.stringify(data) }),
  getServiceRequests: (status?: string) => fetchJson(`/services/requests${status ? `?status=${encodeURIComponent(status)}` : ''}`),
  createServiceRequest: (data: any) => fetchJson('/services/requests', { method: 'POST', body: JSON.stringify(data) }),
  updateServiceRequestStatus: (id: number, status: string, notes?: string) => 
    fetchJson(`/services/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),

  // Welfare Support Cases
  getCases: (params?: { status?: string; priority?: string; category?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return fetchJson(`/welfare/cases?${q}`);
  },
  getCaseDetail: (id: number) => fetchJson(`/welfare/cases/${id}`),
  createCase: (data: any) => fetchJson('/welfare/cases', { method: 'POST', body: JSON.stringify(data) }),
  updateCaseStatus: (id: number, status: string, notes?: string) => 
    fetchJson(`/welfare/cases/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),
  addCaseNote: (id: number, author_name: string, note: string, is_private = true) => 
    fetchJson(`/welfare/cases/${id}/notes`, { method: 'POST', body: JSON.stringify({ case_id: id, author_name, note, is_private }) }),
  deleteCase: (id: number) => fetchJson(`/welfare/cases/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: (category?: string) => fetchJson(`/events${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  getEventDetail: (id: number) => fetchJson(`/events/${id}`),
  createEvent: (data: any) => fetchJson('/events', { method: 'POST', body: JSON.stringify(data) }),
  deleteEvent: (id: number) => fetchJson(`/events/${id}`, { method: 'DELETE' }),
  registerEvent: (eventId: number, memberId: number, notes?: string) => 
    fetchJson('/events/register', { method: 'POST', body: JSON.stringify({ event_id: eventId, member_id: memberId, notes }) }),

  // Announcements & Notifications
  getAnnouncements: () => fetchJson('/announcements'),
  createAnnouncement: (data: any) => fetchJson('/announcements', { method: 'POST', body: JSON.stringify(data) }),
  getNotifications: () => fetchJson('/announcements/notifications'),
  markNotificationsRead: () => fetchJson('/announcements/notifications/read-all', { method: 'POST' }),

  // Fundraising
  getCampaigns: () => fetchJson('/fundraising/campaigns'),
  createCampaign: (data: any) => fetchJson('/fundraising/campaigns', { method: 'POST', body: JSON.stringify(data) }),
  getDonations: () => fetchJson('/fundraising/donations'),
  recordDonation: (data: any) => fetchJson('/fundraising/donations', { method: 'POST', body: JSON.stringify(data) }),

  // Documents
  getDocuments: (category?: string) => fetchJson(`/documents${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  createDocument: (data: any) => fetchJson('/documents', { method: 'POST', body: JSON.stringify(data) }),
  deleteDocument: (id: number) => fetchJson(`/documents/${id}`, { method: 'DELETE' }),

  // Partners, SOPs, KPIs
  getPartners: () => fetchJson('/partners'),
  createPartner: (data: any) => fetchJson('/partners', { method: 'POST', body: JSON.stringify(data) }),
  getSOPs: () => fetchJson('/sops'),
  createSOP: (data: any) => fetchJson('/sops', { method: 'POST', body: JSON.stringify(data) }),
  getKPIs: () => fetchJson('/kpis'),
  createKPI: (data: any) => fetchJson('/kpis', { method: 'POST', body: JSON.stringify(data) }),

  // Admin & Audit Logs
  getAuditLogs: () => fetchJson('/admin/audit-logs'),
  getUsers: () => fetchJson('/admin/users'),
  globalSearch: (query: string) => fetchJson(`/admin/search?q=${encodeURIComponent(query)}`),

  // AI Assistant
  queryAI: (question: string) => fetchJson('/ai/query', { method: 'POST', body: JSON.stringify({ question }) }),
};
