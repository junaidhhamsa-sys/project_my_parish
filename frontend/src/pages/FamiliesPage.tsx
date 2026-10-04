import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Family } from '../types';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { Home, Users, Search, Plus, Phone, MapPin, Trash2, UserPlus, X, UserX, AlertTriangle, Link } from 'lucide-react';

interface InitialMemberInput {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
}

export const FamiliesPage: React.FC = () => {
  const { showToast } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<any>(null);
  const [familyToDelete, setFamilyToDelete] = useState<Family | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<any | null>(null);

  // Form Data for creating family
  const [formData, setFormData] = useState({
    name: '',
    primary_contact: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [initialMembers, setInitialMembers] = useState<InitialMemberInput[]>([]);

  // Add person inside family detail modal
  const [showAddPersonForm, setShowAddPersonForm] = useState(false);
  const [addPersonMode, setAddPersonMode] = useState<'new' | 'existing'>('new');
  const [newPerson, setNewPerson] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'Male'
  });
  const [selectedExistingMemberId, setSelectedExistingMemberId] = useState<number | ''>('');

  const loadFamilies = async () => {
    setLoading(true);
    try {
      const res = await api.getFamilies(search);
      setFamilies(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadAllMembers = async () => {
    try {
      const res = await api.getMembers();
      setAllMembers(res?.items || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadFamilies();
    loadAllMembers();
  }, [search]);

  const handleAddInitialMemberRow = () => {
    setInitialMembers([...initialMembers, { first_name: '', last_name: '', email: '', phone: '', gender: 'Male' }]);
  };

  const handleRemoveInitialMemberRow = (index: number) => {
    setInitialMembers(initialMembers.filter((_, i) => i !== index));
  };

  const handleInitialMemberChange = (index: number, field: keyof InitialMemberInput, val: string) => {
    const updated = [...initialMembers];
    updated[index][field] = val;
    setInitialMembers(updated);
  };

  const handleCreateFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        initial_members: initialMembers.filter(m => m.first_name.trim() !== '' && m.last_name.trim() !== '')
      };
      await api.createFamily(payload);
      showToast('Family record registered with members successfully', 'success');
      setIsAddOpen(false);
      setFormData({ name: '', primary_contact: '', phone: '', address: '', notes: '' });
      setInitialMembers([]);
      loadFamilies();
      loadAllMembers();
    } catch (err: any) {
      showToast(err.message || 'Error creating family', 'error');
    }
  };

  const viewFamilyDetail = async (id: number) => {
    try {
      const res = await api.getFamilyDetail(id);
      setSelectedFamily(res);
      setShowAddPersonForm(false);
    } catch (e) {
      showToast('Could not load family profile', 'error');
    }
  };

  const handleDeleteFamily = async () => {
    if (!familyToDelete) return;
    try {
      await api.deleteFamily(familyToDelete.id);
      showToast(`Family '${familyToDelete.name}' deleted successfully`, 'success');
      setFamilyToDelete(null);
      if (selectedFamily?.family?.id === familyToDelete.id) {
        setSelectedFamily(null);
      }
      loadFamilies();
      loadAllMembers();
    } catch (err: any) {
      showToast('Failed to delete family', 'error');
    }
  };

  const handleAddPersonToFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFamily) return;

    try {
      if (addPersonMode === 'existing') {
        if (!selectedExistingMemberId) {
          showToast('Please select a parish member to add', 'error');
          return;
        }
        const updated = await api.addMemberToFamily(selectedFamily.family.id, { member_id: Number(selectedExistingMemberId) });
        setSelectedFamily(updated);
        showToast('Parish member added to family household', 'success');
      } else {
        if (!newPerson.first_name || !newPerson.last_name) {
          showToast('First name and last name are required', 'error');
          return;
        }
        const updated = await api.addMemberToFamily(selectedFamily.family.id, newPerson);
        setSelectedFamily(updated);
        showToast('New person registered and added to family', 'success');
      }
      setNewPerson({ first_name: '', last_name: '', email: '', phone: '', gender: 'Male' });
      setSelectedExistingMemberId('');
      setShowAddPersonForm(false);
      loadFamilies();
      loadAllMembers();
    } catch (err: any) {
      showToast('Error adding person to family', 'error');
    }
  };

  const handleRemoveMemberFromFamily = async (memberId: number, memberName: string) => {
    if (!selectedFamily) return;
    try {
      const updated = await api.removeMemberFromFamily(selectedFamily.family.id, memberId);
      setSelectedFamily(updated);
      showToast(`${memberName} unlinked from family`, 'success');
      loadFamilies();
      loadAllMembers();
    } catch (err: any) {
      showToast('Failed to remove member from family', 'error');
    }
  };

  const handleDeleteMemberPermanently = async () => {
    if (!memberToDelete || !selectedFamily) return;
    try {
      await api.deleteMember(memberToDelete.id);
      showToast(`Person '${memberToDelete.first_name} ${memberToDelete.last_name}' deleted permanently`, 'success');
      setMemberToDelete(null);
      const res = await api.getFamilyDetail(selectedFamily.family.id);
      setSelectedFamily(res);
      loadFamilies();
      loadAllMembers();
    } catch (err: any) {
      showToast('Failed to delete person', 'error');
    }
  };

  const unassignedMembers = allMembers.filter(m => !m.family_id || (selectedFamily && m.family_id !== selectedFamily.family.id));

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parish Families</h1>
          <p className="text-xs text-slate-500 font-medium">Group parish members into household family units with full member management</p>
        </div>
        <button
          onClick={() => {
            setIsAddOpen(true);
            setInitialMembers([{ first_name: '', last_name: '', email: '', phone: '+91 98765-0100', gender: 'Head' }]);
          }}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register Family</span>
        </button>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search families by name..."
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading family profiles...
        </div>
      ) : families.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
          <Home className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold">No parish families found</p>
          <p className="text-slate-400">Click "Register Family" above to add a household.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {families.map((fam) => (
            <div key={fam.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 font-bold">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{fam.name}</h3>
                      <p className="text-[11px] text-slate-400 font-medium">Head: {fam.primary_contact || 'Primary Contact'}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                    {fam.member_count} Members
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400" /> {fam.phone || 'N/A'}</p>
                  <p className="flex items-center gap-2 truncate"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {fam.address || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => viewFamilyDetail(fam.id)}
                  className="flex-1 py-2 text-xs font-bold text-teal-600 hover:bg-teal-50 rounded-xl transition-colors border border-teal-100 text-center"
                >
                  Manage Family Profile
                </button>
                <button
                  onClick={() => setFamilyToDelete(fam)}
                  title="Delete Family"
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Family Modal with Household Members Input */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Parish Family"
        subtitle="Create a household family grouping and add family members"
      >
        <form onSubmit={handleCreateFamily} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-teal-700">Family Info</h4>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Family / Household Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. The D'Souza Family"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Primary Contact Person / Head of Family</label>
              <input
                type="text"
                value={formData.primary_contact}
                onChange={(e) => setFormData({ ...formData, primary_contact: e.target.value })}
                placeholder="e.g. Joseph D'Souza"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765-0100"
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street / Quarter / Sector"
                  className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Household Members Section */}
          <div className="space-y-3 pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600" />
                Add Household People / Members
              </h4>
              <button
                type="button"
                onClick={handleAddInitialMemberRow}
                className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700"
              >
                <Plus className="w-3.5 h-3.5" /> Add Person Row
              </button>
            </div>

            {initialMembers.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No family members added yet. Click above to add members to this family.</p>
            ) : (
              <div className="space-y-2">
                {initialMembers.map((m, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveInitialMemberRow(idx)}
                      className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 p-1"
                      title="Remove row"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={m.first_name}
                        onChange={(e) => handleInitialMemberChange(idx, 'first_name', e.target.value)}
                        placeholder="First Name *"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        required
                      />
                      <input
                        type="text"
                        value={m.last_name}
                        onChange={(e) => handleInitialMemberChange(idx, 'last_name', e.target.value)}
                        placeholder="Last Name *"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={m.phone}
                        onChange={(e) => handleInitialMemberChange(idx, 'phone', e.target.value)}
                        placeholder="Phone (+91...)"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                      <select
                        value={m.gender}
                        onChange={(e) => handleInitialMemberChange(idx, 'gender', e.target.value)}
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Child">Child</option>
                        <option value="Head">Head</option>
                        <option value="Spouse">Spouse</option>
                      </select>
                      <input
                        type="email"
                        value={m.email}
                        onChange={(e) => handleInitialMemberChange(idx, 'email', e.target.value)}
                        placeholder="Email (Optional)"
                        className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
          >
            Save Family Record & Add Members
          </button>
        </form>
      </Modal>

      {/* Detail Modal with Member Add / Remove capabilities */}
      {selectedFamily && (
        <Modal
          isOpen={!!selectedFamily}
          onClose={() => setSelectedFamily(null)}
          title={selectedFamily.family.name}
          subtitle={`Primary Contact: ${selectedFamily.family.primary_contact || 'N/A'}`}
        >
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header / Actions */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <p className="text-xs font-bold text-slate-900">{selectedFamily.family.name}</p>
                <p className="text-[11px] text-slate-500">Address: {selectedFamily.family.address || 'N/A'} | Phone: {selectedFamily.family.phone || 'N/A'}</p>
              </div>
              <button
                onClick={() => setFamilyToDelete(selectedFamily.family)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Family</span>
              </button>
            </div>

            {/* Household Members Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-teal-600" />
                Household Members ({selectedFamily.members.length})
              </h4>
              <button
                onClick={() => setShowAddPersonForm(!showAddPersonForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Add Person to Family</span>
              </button>
            </div>

            {/* Add Person to Family Form */}
            {showAddPersonForm && (
              <form onSubmit={handleAddPersonToFamily} className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-900">Add Person to Family</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAddPersonMode('new')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${addPersonMode === 'new' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                    >
                      Create New Person
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddPersonMode('existing')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-lg ${addPersonMode === 'existing' ? 'bg-teal-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
                    >
                      Link Existing Member
                    </button>
                  </div>
                </div>

                {addPersonMode === 'new' ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newPerson.first_name}
                        onChange={(e) => setNewPerson({ ...newPerson, first_name: e.target.value })}
                        placeholder="First Name *"
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                        required
                      />
                      <input
                        type="text"
                        value={newPerson.last_name}
                        onChange={(e) => setNewPerson({ ...newPerson, last_name: e.target.value })}
                        placeholder="Last Name *"
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newPerson.phone}
                        onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                        placeholder="Phone (+91 98765...)"
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      />
                      <select
                        value={newPerson.gender}
                        onChange={(e) => setNewPerson({ ...newPerson, gender: e.target.value })}
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <input
                        type="email"
                        value={newPerson.email}
                        onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                        placeholder="Email (Optional)"
                        className="px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Select Parish Member to Link</label>
                    <select
                      value={selectedExistingMemberId}
                      onChange={(e) => setSelectedExistingMemberId(Number(e.target.value) || '')}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                    >
                      <option value="">-- Choose Member --</option>
                      {unassignedMembers.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.full_name || `${m.first_name} ${m.last_name}`} ({m.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddPersonForm(false)}
                    className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                  >
                    Add Person to Household
                  </button>
                </div>
              </form>
            )}

            {/* List of members */}
            <div className="space-y-2">
              {selectedFamily.members.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  No people in this family yet. Click "Add Person to Family" above.
                </div>
              ) : (
                selectedFamily.members.map((m: any) => (
                  <div key={m.id} className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex justify-between items-center hover:border-slate-300 transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900">{m.first_name} {m.last_name}</p>
                        {m.gender && (
                          <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded-md">
                            {m.gender}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">{m.email} | {m.phone || 'No Phone'}</p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleRemoveMemberFromFamily(m.id, `${m.first_name} ${m.last_name}`)}
                        className="px-2.5 py-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
                        title="Unlink member from family"
                      >
                        <UserX className="w-3 h-3" />
                        <span>Unlink</span>
                      </button>
                      <button
                        onClick={() => setMemberToDelete(m)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-rose-100"
                        title="Delete person permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Family Confirmation Modal */}
      {familyToDelete && (
        <Modal
          isOpen={!!familyToDelete}
          onClose={() => setFamilyToDelete(null)}
          title="Confirm Delete Family"
          subtitle="Delete family record from system"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Are you sure you want to delete '{familyToDelete.name}'?</p>
                <p className="text-[11px] text-rose-700 mt-1">
                  Associated members will remain in the parish member directory as individual members and will not be deleted.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setFamilyToDelete(null)}
                className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteFamily}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Yes, Delete Family
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Member Confirmation Modal */}
      {memberToDelete && (
        <Modal
          isOpen={!!memberToDelete}
          onClose={() => setMemberToDelete(null)}
          title="Confirm Delete Person"
          subtitle="Permanently remove person from parish database"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Delete '{memberToDelete.first_name} {memberToDelete.last_name}'?</p>
                <p className="text-[11px] text-rose-700 mt-1">
                  This will permanently delete this member record from the entire parish system.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMemberPermanently}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Yes, Delete Person
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
