import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SupportCase, CaseNote } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { 
  HeartPulse, 
  Search, 
  Plus, 
  ShieldAlert, 
  Eye, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  FileText,
  UserCheck,
  Trash2,
  Calendar,
  IndianRupee,
  User
} from 'lucide-react';

export const WelfarePage: React.FC = () => {
  const { showToast, role } = useAuth();
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Drawer / Modals
  const [selectedCaseDetail, setSelectedCaseDetail] = useState<{ case: SupportCase; notes: CaseNote[] } | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<SupportCase | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  const [applicantType, setApplicantType] = useState<'member' | 'custom'>('member');
  const [selectedMemberId, setSelectedMemberId] = useState<number | ''>('');
  const [customApplicantName, setCustomApplicantName] = useState('');

  const [createForm, setCreateForm] = useState({
    title: '',
    category: 'Food & Basic Needs',
    priority: 'High',
    description: '',
    assigned_staff: 'Sister Maria Rodriguez',
    follow_up_date: '2026-10-15',
    assistance_provided: ''
  });

  const loadCases = async () => {
    setLoading(true);
    try {
      const res = await api.getCases({ status: statusFilter, priority: priorityFilter });
      setCases(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      const res = await api.getMembers();
      setMembers(res?.items || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadCases();
    loadMembers();
  }, [statusFilter, priorityFilter]);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.title.trim()) {
      showToast('Please enter a case title', 'error');
      return;
    }

    let memberId: number | undefined = undefined;
    let memberName: string | undefined = undefined;

    if (applicantType === 'member') {
      if (!selectedMemberId) {
        showToast('Please select a parish member applicant', 'error');
        return;
      }
      memberId = Number(selectedMemberId);
      const found = members.find(m => m.id === memberId);
      if (found) {
        memberName = found.full_name || `${found.first_name} ${found.last_name}`;
      }
    } else {
      if (!customApplicantName.trim()) {
        showToast('Please enter the applicant name', 'error');
        return;
      }
      memberName = customApplicantName.trim();
    }

    try {
      const payload = {
        ...createForm,
        member_id: memberId,
        member_name: memberName
      };

      await api.createCase(payload);
      showToast('Support case initiated successfully!', 'success');
      setIsCreateOpen(false);
      setCreateForm({
        title: '',
        category: 'Food & Basic Needs',
        priority: 'High',
        description: '',
        assigned_staff: 'Sister Maria Rodriguez',
        follow_up_date: '2026-10-15',
        assistance_provided: ''
      });
      setSelectedMemberId('');
      setCustomApplicantName('');
      loadCases();
    } catch (err: any) {
      showToast('Failed to create support case', 'error');
    }
  };

  const openCaseDetail = async (id: number) => {
    try {
      const res = await api.getCaseDetail(id);
      setSelectedCaseDetail(res);
    } catch (e) {
      showToast('Error opening confidential case file', 'error');
    }
  };

  const handleDeleteCase = async () => {
    if (!caseToDelete) return;
    try {
      await api.deleteCase(caseToDelete.id);
      showToast(`Case '${caseToDelete.case_number}' deleted successfully`, 'success');
      setCaseToDelete(null);
      if (selectedCaseDetail?.case?.id === caseToDelete.id) {
        setSelectedCaseDetail(null);
      }
      loadCases();
    } catch (e) {
      showToast('Failed to delete support case', 'error');
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseDetail || !newNoteText.trim()) return;

    try {
      await api.addCaseNote(selectedCaseDetail.case.id, 'Sister Maria Rodriguez', newNoteText, true);
      showToast('Private case note added', 'success');
      setNewNoteText('');
      openCaseDetail(selectedCaseDetail.case.id);
    } catch (e) {
      showToast('Failed to add case note', 'error');
    }
  };

  const handleUpdateStatus = async (caseId: number, status: string) => {
    try {
      await api.updateCaseStatus(caseId, status);
      showToast(`Case status updated to ${status}`, 'success');
      loadCases();
      if (selectedCaseDetail) openCaseDetail(caseId);
    } catch (e) {
      showToast('Failed to update case status', 'error');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welfare & Support Cases</h1>
          <p className="text-xs text-slate-500 font-medium">Confidential emergency relief, food support, and financial micro-grants in ₹</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Initiate Support Case</span>
        </button>
      </div>

      {/* Sensitive Audit Warning Banner */}
      <div className="p-4 bg-amber-50 border border-amber-200/80 rounded-2xl flex items-center gap-3 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <span className="font-bold">Confidential Welfare Portal Notice:</span> All access to sensitive support case records is strictly role-restricted and automatically recorded in system audit logs for parish governance.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Priority:</span>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
        <span className="text-slate-400 font-semibold">{cases.length} Total Welfare Cases</span>
      </div>

      {/* Cases Table */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading support cases...
        </div>
      ) : cases.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
          <HeartPulse className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold">No welfare support cases found</p>
          <p className="text-slate-400">Click "Initiate Support Case" above to log a hardship record.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Case ID</th>
                <th className="px-6 py-3.5">Applicant / Member</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Assigned Worker</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{c.case_number}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">{c.member_name}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{c.category}</td>
                  <td className="px-6 py-4">
                    <Badge variant={c.priority === 'Critical' ? 'danger' : c.priority === 'High' ? 'warning' : 'neutral'}>
                      {c.priority}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{c.assigned_staff || 'Pastoral Care'}</td>
                  <td className="px-6 py-4">
                    <Badge variant={c.status === 'Resolved' ? 'success' : c.status === 'New' ? 'danger' : 'info'}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openCaseDetail(c.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Open Confidential Case File"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCaseToDelete(c)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Support Case"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Case Detail Drawer */}
      {selectedCaseDetail && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg h-full bg-white shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Confidential Case File</span>
                <h3 className="text-base font-extrabold text-slate-900">{selectedCaseDetail.case.case_number}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCaseToDelete(selectedCaseDetail.case)}
                  className="px-2.5 py-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Case
                </button>
                <button onClick={() => setSelectedCaseDetail(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900">{selectedCaseDetail.case.title}</h4>
                <Badge variant={selectedCaseDetail.case.priority === 'Critical' ? 'danger' : 'warning'}>
                  {selectedCaseDetail.case.priority} Priority
                </Badge>
              </div>

              {/* Status Selector in Drawer */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Update Status:</span>
                <select
                  value={selectedCaseDetail.case.status}
                  onChange={(e) => handleUpdateStatus(selectedCaseDetail.case.id, e.target.value)}
                  className="px-3 py-1 bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                >
                  <option value="New">New</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Hardship Description:</label>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {selectedCaseDetail.case.description || 'No description recorded.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Applicant Name:</span>
                  <p className="font-bold text-slate-900">{selectedCaseDetail.case.member_name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Category:</span>
                  <p className="font-bold text-slate-900">{selectedCaseDetail.case.category}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Caseworker:</span>
                  <p className="font-medium text-slate-800">{selectedCaseDetail.case.assigned_staff || 'Sister Maria Rodriguez'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Follow-up Date:</span>
                  <p className="font-medium text-slate-800">{selectedCaseDetail.case.follow_up_date || '2026-10-15'}</p>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
                <span className="font-bold text-emerald-900">Assistance / Relief Measures Provided:</span>
                <p className="text-emerald-800">{selectedCaseDetail.case.assistance_provided || 'Under evaluation by parish welfare committee.'}</p>
              </div>
            </div>

            {/* Private Notes Log */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><Lock className="w-4 h-4 text-rose-600" /> Private Case Worker Notes</h4>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {selectedCaseDetail.notes.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No notes logged yet.</p>
                ) : (
                  selectedCaseDetail.notes.map((n) => (
                    <div key={n.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{n.author_name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">Restricted</span>
                      </div>
                      <p className="text-slate-600">{n.note}</p>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Add confidential case note..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl"
                >
                  Add Private Note
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Case Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Initiate Welfare Support Case"
        subtitle="Confidential welfare intake record"
      >
        <form onSubmit={handleCreateCase} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* Applicant Selection */}
          <div className="space-y-2 p-3 bg-rose-50/60 border border-rose-200 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-rose-900">Applicant / Beneficiary *</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setApplicantType('member')}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-lg ${applicantType === 'member' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  Parish Member
                </button>
                <button
                  type="button"
                  onClick={() => setApplicantType('custom')}
                  className={`px-2 py-0.5 text-[11px] font-bold rounded-lg ${applicantType === 'custom' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                >
                  Manual Name
                </button>
              </div>
            </div>

            {applicantType === 'member' ? (
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(Number(e.target.value) || '')}
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl"
                required
              >
                <option value="">-- Select Registered Parish Member --</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name || `${m.first_name} ${m.last_name}`} ({m.email})
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={customApplicantName}
                onChange={(e) => setCustomApplicantName(e.target.value)}
                placeholder="Enter Full Name of Applicant"
                className="w-full px-3 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl"
                required
              />
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Case Title / Request Summary *</label>
            <input
              type="text"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="e.g. Medical Bill & Ration Support Request"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Welfare Category *</label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Food & Basic Needs">Food & Basic Needs</option>
                <option value="Healthcare Relief">Healthcare Relief</option>
                <option value="Financial Aid">Financial Aid</option>
                <option value="Housing Support">Housing Support</option>
                <option value="Family Crisis">Family Crisis</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Priority Level *</label>
              <select
                value={createForm.priority}
                onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Assigned Caseworker</label>
              <input
                type="text"
                value={createForm.assigned_staff}
                onChange={(e) => setCreateForm({ ...createForm, assigned_staff: e.target.value })}
                placeholder="Sister Maria Rodriguez"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Follow-up Date</label>
              <input
                type="date"
                value={createForm.follow_up_date}
                onChange={(e) => setCreateForm({ ...createForm, follow_up_date: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Assistance / Financial Relief Granted (in ₹)</label>
            <input
              type="text"
              value={createForm.assistance_provided}
              onChange={(e) => setCreateForm({ ...createForm, assistance_provided: e.target.value })}
              placeholder="e.g. ₹15,000 direct medical aid & food ration basket"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Hardship Case Details *</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Provide confidential background details of applicant hardship..."
              rows={3}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-md"
          >
            Create Confidential Support Case
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      {caseToDelete && (
        <Modal
          isOpen={!!caseToDelete}
          onClose={() => setCaseToDelete(null)}
          title="Confirm Delete Welfare Case"
          subtitle="Delete welfare case record from system"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Are you sure you want to delete case '{caseToDelete.case_number}'?</p>
                <p className="text-[11px] text-rose-700 mt-1">
                  Title: {caseToDelete.title} ({caseToDelete.member_name}). This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCaseToDelete(null)}
                className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCase}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Yes, Delete Support Case
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
