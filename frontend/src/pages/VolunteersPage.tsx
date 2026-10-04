import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Volunteer, VolunteerAssignment, VolunteerHour } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { 
  HandHeart, 
  Search, 
  Plus, 
  Clock, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Star,
  UserCheck
} from 'lucide-react';

export const VolunteersPage: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'directory' | 'assignments' | 'hours' | 'recognition'>('directory');
  
  // Data
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [assignments, setAssignments] = useState<VolunteerAssignment[]>([]);
  const [hours, setHours] = useState<VolunteerHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isLogHoursOpen, setIsLogHoursOpen] = useState(false);

  // Form States
  const [assignForm, setAssignForm] = useState({
    volunteer_id: 1,
    title: '',
    description: '',
    start_date: '2026-10-01',
    priority: 'Medium',
    responsibilities: ''
  });

  const [hoursForm, setHoursForm] = useState({
    volunteer_id: 1,
    activity_name: '',
    date: '2026-09-25',
    hours: 3.5,
    notes: ''
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [vRes, aRes, hRes] = await Promise.all([
        api.getVolunteers({ search }),
        api.getAssignments(),
        api.getHours()
      ]);
      setVolunteers(vRes || []);
      setAssignments(aRes || []);
      setHours(hRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [search]);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAssignment(assignForm);
      showToast('Volunteer assignment created!', 'success');
      setIsAssignModalOpen(false);
      loadAllData();
    } catch (err: any) {
      showToast('Failed to create assignment', 'error');
    }
  };

  const handleLogHours = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.logHours(hoursForm);
      showToast('Volunteer hours logged & approved!', 'success');
      setIsLogHoursOpen(false);
      loadAllData();
    } catch (err: any) {
      showToast('Failed to log hours', 'error');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Volunteer Management</h1>
          <p className="text-xs text-slate-500 font-medium">Volunteer profiles, task assignments, hours tracking, and recognition</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsLogHoursOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm"
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Log Volunteer Hours</span>
          </button>
          <button
            onClick={() => setIsAssignModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Task Assignment</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'directory' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Volunteer Directory ({volunteers.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'assignments' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Task Assignments ({assignments.length})
        </button>
        <button
          onClick={() => setActiveTab('hours')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'hours' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Hours Logged ({hours.length})
        </button>
        <button
          onClick={() => setActiveTab('recognition')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'recognition' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Recognition Wall 🏆
        </button>
      </div>

      {/* Directory Tab */}
      {activeTab === 'directory' && (
        <div className="space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search volunteers by name or skill..."
                className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {volunteers.map((v) => (
              <div key={v.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{v.member_name}</h3>
                    <p className="text-[11px] text-teal-600 font-semibold">{v.committee_name || 'General Volunteer'}</p>
                  </div>
                  <Badge variant={v.total_hours > 100 ? 'gold' : v.total_hours > 50 ? 'info' : 'neutral'}>
                    {v.recognition_level}
                  </Badge>
                </div>

                <div className="space-y-1 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <p><span className="font-bold text-slate-800">Skills:</span> {v.skills}</p>
                  <p><span className="font-bold text-slate-800">Availability:</span> {v.availability}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Total Contributed:</span>
                  <span className="font-extrabold text-slate-900">{v.total_hours} hrs</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Assignment Title</th>
                <th className="px-6 py-3.5">Assigned Volunteer</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Start Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{a.title}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{a.volunteer_name}</td>
                  <td className="px-6 py-4">
                    <Badge variant={a.priority === 'High' ? 'danger' : 'info'}>{a.priority}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={a.status === 'Completed' ? 'success' : 'warning'}>{a.status}</Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-500">{a.start_date || '2026-10-01'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Hours Logged Tab */}
      {activeTab === 'hours' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Activity Name</th>
                <th className="px-6 py-3.5">Volunteer</th>
                <th className="px-6 py-3.5">Hours</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {hours.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{h.activity_name}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{h.volunteer_name}</td>
                  <td className="px-6 py-4 font-black text-emerald-600">{h.hours} hrs</td>
                  <td className="px-6 py-4 font-medium text-slate-500">{h.date}</td>
                  <td className="px-6 py-4"><Badge variant="success">{h.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recognition Wall Tab */}
      {activeTab === 'recognition' && (
        <div className="p-8 bg-gradient-to-r from-amber-500/10 via-white to-amber-500/10 rounded-3xl border border-amber-200/80 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30">
            <Star className="w-8 h-8 fill-current" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900">Parish Volunteer Leaders Wall</h2>
            <p className="text-xs text-slate-500 font-medium">Honoring our top contributors who selflessly serve our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {volunteers.sort((a,b) => b.total_hours - a.total_hours).slice(0, 3).map((v, idx) => (
              <div key={v.id} className="p-6 bg-white rounded-2xl border border-amber-200 shadow-md space-y-2 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 text-[10px] font-black bg-amber-500 text-slate-950 rounded-full">
                  RANK #{idx + 1}
                </div>
                <h3 className="text-base font-extrabold text-slate-900 pt-2">{v.member_name}</h3>
                <p className="text-xs text-teal-600 font-semibold">{v.committee_name}</p>
                <div className="text-2xl font-black text-amber-600">{v.total_hours} Hours</div>
                <Badge variant="gold">{v.recognition_level}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Hours Modal */}
      <Modal
        isOpen={isLogHoursOpen}
        onClose={() => setIsLogHoursOpen(false)}
        title="Log Volunteer Hours"
        subtitle="Record contributed volunteer hours"
      >
        <form onSubmit={handleLogHours} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Select Volunteer *</label>
            <select
              value={hoursForm.volunteer_id}
              onChange={(e) => setHoursForm({ ...hoursForm, volunteer_id: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
            >
              {volunteers.map(v => (
                <option key={v.id} value={v.id}>{v.member_name} ({v.committee_name})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Activity Name *</label>
            <input
              type="text"
              value={hoursForm.activity_name}
              onChange={(e) => setHoursForm({ ...hoursForm, activity_name: e.target.value })}
              placeholder="Healthcare Clinic Assistance"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Hours Contributed *</label>
              <input
                type="number"
                step="0.5"
                value={hoursForm.hours}
                onChange={(e) => setHoursForm({ ...hoursForm, hours: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Date *</label>
              <input
                type="date"
                value={hoursForm.date}
                onChange={(e) => setHoursForm({ ...hoursForm, date: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
          >
            Submit & Approve Hours
          </button>
        </form>
      </Modal>

      {/* Assignment Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Create Volunteer Task Assignment"
        subtitle="Assign a volunteer to a parish project or event"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Assignment Title *</label>
            <input
              type="text"
              value={assignForm.title}
              onChange={(e) => setAssignForm({ ...assignForm, title: e.target.value })}
              placeholder="Lead Coordinator - Health Camp"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Select Volunteer *</label>
            <select
              value={assignForm.volunteer_id}
              onChange={(e) => setAssignForm({ ...assignForm, volunteer_id: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
            >
              {volunteers.map(v => (
                <option key={v.id} value={v.id}>{v.member_name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            Create Task Assignment
          </button>
        </form>
      </Modal>
    </div>
  );
};
