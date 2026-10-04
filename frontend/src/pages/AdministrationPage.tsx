import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AuditLogItem, UserRole } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, ShieldCheck, Key, Lock, RefreshCw, Plus, CheckCircle2, X } from 'lucide-react';

export const AdministrationPage: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'audit' | 'users' | 'matrix' | 'config'>('audit');
  
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'member',
    password: 'password123'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [aRes, uRes] = await Promise.all([
        api.getAuditLogs(),
        api.getUsers()
      ]);
      setAuditLogs(aRes || []);
      setUsers(uRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/v1/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });
      showToast('User account created successfully!', 'success');
      setIsAddUserOpen(false);
      loadData();
    } catch (e) {
      showToast('Error creating user account', 'error');
    }
  };

  const rolesMatrix = [
    { module: 'Member CRUD', superAdmin: true, parishAdmin: true, leader: false, volunteer: false, member: false, viewer: false },
    { module: 'Volunteer Assignments', superAdmin: true, parishAdmin: true, leader: true, volunteer: true, member: false, viewer: false },
    { module: 'Welfare Support Cases', superAdmin: true, parishAdmin: true, leader: false, volunteer: false, member: false, viewer: false },
    { module: 'Event Management', superAdmin: true, parishAdmin: true, leader: true, volunteer: false, member: false, viewer: false },
    { module: 'Fundraising Ledger', superAdmin: true, parishAdmin: true, leader: false, volunteer: false, member: false, viewer: false },
    { module: 'System Audit Logs', superAdmin: true, parishAdmin: true, leader: false, volunteer: false, member: false, viewer: false },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Administration</h1>
          <p className="text-xs text-slate-500 font-medium">RBAC permissions matrix, user management, audit logs, and security controls</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create User Account</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'audit' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Audit Logs ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'users' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          User Accounts ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'matrix' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Roles & Permissions Matrix
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'config' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          System Config
        </button>
      </div>

      {/* Audit Logs Tab */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Timestamp</th>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Action Type</th>
                <th className="px-6 py-3.5">Resource</th>
                <th className="px-6 py-3.5">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-[11px] text-slate-500">{log.created_at || 'Just now'}</td>
                  <td className="px-6 py-4 font-bold text-slate-900">{log.user_name}</td>
                  <td className="px-6 py-4"><Badge variant="info">{log.user_role}</Badge></td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-800">{log.action}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{log.resource_type} #{log.resource_id}</td>
                  <td className="px-6 py-4 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Accounts Tab */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">User ID</th>
                <th className="px-6 py-3.5">Full Name</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Assigned Role</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">#{u.id}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{u.full_name}</td>
                  <td className="px-6 py-4 text-slate-600">{u.email}</td>
                  <td className="px-6 py-4"><Badge variant="purple">{u.role}</Badge></td>
                  <td className="px-6 py-4"><Badge variant="success">Active</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Roles Matrix Tab */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-900 text-white text-[11px] font-bold uppercase">
              <tr>
                <th className="px-6 py-3.5">Module / Privilege</th>
                <th className="px-4 py-3.5 text-center">Super Admin</th>
                <th className="px-4 py-3.5 text-center">Parish Admin</th>
                <th className="px-4 py-3.5 text-center">Committee Leader</th>
                <th className="px-4 py-3.5 text-center">Volunteer</th>
                <th className="px-4 py-3.5 text-center">Member</th>
                <th className="px-4 py-3.5 text-center">Viewer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rolesMatrix.map((r, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{r.module}</td>
                  <td className="px-4 py-4 text-center">{r.superAdmin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}</td>
                  <td className="px-4 py-4 text-center">{r.parishAdmin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}</td>
                  <td className="px-4 py-4 text-center">{r.leader ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}</td>
                  <td className="px-4 py-4 text-center">{r.volunteer ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}</td>
                  <td className="px-4 py-4 text-center">{r.member ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}</td>
                  <td className="px-4 py-4 text-center">{r.viewer ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <X className="w-4 h-4 text-slate-300 inline" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Config Tab */}
      {activeTab === 'config' && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 max-w-2xl">
          <h3 className="text-sm font-bold text-slate-900">System Environment Configuration</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono">
              <p><span className="text-slate-400">DATABASE_URL:</span> sqlite:///./parish.db</p>
              <p><span className="text-slate-400">JWT_ALGORITHM:</span> HS256</p>
              <p><span className="text-slate-400">CORS_ORIGINS:</span> http://localhost:5173, http://127.0.0.1:8000</p>
              <p><span className="text-slate-400">ENVIRONMENT:</span> Production Demo Readiness</p>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Create System User Account"
        subtitle="Provision a user with RBAC role"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Full Name *</label>
            <input
              type="text"
              value={userForm.full_name}
              onChange={(e) => setUserForm({ ...userForm, full_name: e.target.value })}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Email *</label>
              <input
                type="email"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="super_admin">Super Admin</option>
                <option value="parish_admin">Parish Admin</option>
                <option value="committee_leader">Committee Leader</option>
                <option value="volunteer">Volunteer</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md"
          >
            Create User Account
          </button>
        </form>
      </Modal>
    </div>
  );
};
