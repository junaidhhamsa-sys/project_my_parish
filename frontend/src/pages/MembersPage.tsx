import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Member } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Trash2, 
  Edit, 
  Filter, 
  Calendar, 
  Briefcase, 
  HandHeart, 
  X,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export const MembersPage: React.FC = () => {
  const { showToast } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modals & Drawers
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    gender: 'Male',
    date_of_birth: '',
    membership_status: 'active',
    bio: ''
  });

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await api.getMembers({ search, status: statusFilter });
      setMembers(res.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [search, statusFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMember(formData);
      showToast('Member registered successfully!', 'success');
      setIsAddOpen(false);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: '',
        gender: 'Male',
        date_of_birth: '',
        membership_status: 'active',
        bio: ''
      });
      loadMembers();
    } catch (err: any) {
      showToast(err.message || 'Failed to create member', 'error');
    }
  };

  const openDetailDrawer = async (id: number) => {
    try {
      const res = await api.getMemberDetail(id);
      setSelectedMemberDetail(res);
    } catch (e) {
      showToast('Could not load member profile', 'error');
    }
  };

  const exportCSV = () => {
    const headers = ["ID", "First Name", "Last Name", "Email", "Phone", "Family", "Status", "Joined Date"];
    const rows = members.map(m => [m.id, m.first_name, m.last_name, m.email, m.phone || '', m.family_name || '', m.membership_status, m.joined_date || '']);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "parish_members_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV successfully', 'success');
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parish Members</h1>
          <p className="text-xs text-slate-500 font-medium">Directory of registered parish members and family connections</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Member</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl outline-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Data Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading members directory...
        </div>
      ) : members.length === 0 ? (
        <EmptyState
          title="No Members Found"
          description="No parish members matched your search criteria."
          actionLabel="Add New Member"
          onAction={() => setIsAddOpen(true)}
          icon={Users}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Member Name</th>
                  <th className="px-6 py-3.5">Contact Info</th>
                  <th className="px-6 py-3.5">Family Group</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Joined Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-extrabold flex items-center justify-center text-xs">
                          {m.first_name[0]}{m.last_name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{m.first_name} {m.last_name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{m.gender || 'Member'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-800">{m.email}</p>
                      <p className="text-[11px] text-slate-400">{m.phone || 'No phone'}</p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {m.family_name || 'Individual'}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={m.membership_status === 'active' ? 'success' : 'neutral'}>
                        {m.membership_status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-500">
                      {m.joined_date || '2026-01-01'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openDetailDrawer(m.id)}
                        className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Full Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add New Parish Member"
        subtitle="Register a new individual into parish management database"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">First Name *</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Last Name *</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email Address *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Phone Number</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
          >
            Save Member Record
          </button>
        </form>
      </Modal>

      {/* Detail Drawer */}
      {selectedMemberDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md h-full bg-white shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900">Member Profile</h3>
              <button onClick={() => setSelectedMemberDetail(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 font-black text-xl flex items-center justify-center mx-auto shadow-inner">
                {selectedMemberDetail.member.first_name[0]}{selectedMemberDetail.member.last_name[0]}
              </div>
              <h4 className="text-lg font-extrabold text-slate-900">{selectedMemberDetail.member.full_name}</h4>
              <Badge variant="success">{selectedMemberDetail.member.membership_status}</Badge>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /> {selectedMemberDetail.member.email}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /> {selectedMemberDetail.member.phone || 'No phone'}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /> {selectedMemberDetail.member.address || 'Address not logged'}</p>
            </div>

            {/* Volunteer Activity */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><HandHeart className="w-4 h-4 text-emerald-600" /> Volunteer Record</h5>
              {selectedMemberDetail.volunteer ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-emerald-900">{selectedMemberDetail.volunteer.committee_name}</p>
                  <p className="text-emerald-700 font-medium">{selectedMemberDetail.volunteer.total_hours} Hours Contributed ({selectedMemberDetail.volunteer.recognition_level})</p>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Not registered as volunteer.</p>
              )}
            </div>

            {/* Event Registrations */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-blue-600" /> Event Registrations</h5>
              <div className="space-y-1.5">
                {selectedMemberDetail.registrations?.map((r: any) => (
                  <div key={r.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between">
                    <span>Registered on {r.registration_date}</span>
                    <Badge variant="info">{r.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
