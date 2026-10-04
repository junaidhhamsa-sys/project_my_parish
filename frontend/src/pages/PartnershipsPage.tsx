import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Partner } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { Building2, Plus, Phone, Mail, Handshake } from 'lucide-react';

export const PartnershipsPage: React.FC = () => {
  const { showToast } = useAuth();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    partner_type: 'NGO',
    description: '',
    contribution_details: ''
  });

  const loadPartners = async () => {
    setLoading(true);
    try {
      const res = await api.getPartners();
      setPartners(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPartner(addForm);
      showToast('Partner organization registered!', 'success');
      setIsAddOpen(false);
      loadPartners();
    } catch (e) {
      showToast('Error registering partner', 'error');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Community Partnerships</h1>
          <p className="text-xs text-slate-500 font-medium">Collaborations with hospitals, schools, NGOs, and municipal agencies</p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Partner</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading partner organizations...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((p) => (
            <div key={p.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <Badge variant="purple">{p.partner_type}</Badge>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{p.description}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-800">Contribution:</span>
                  <p className="text-slate-600">{p.contribution_details}</p>
                </div>

                <div className="space-y-1 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                  <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {p.email || 'N/A'}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {p.phone || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Partner Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Partner Organization"
        subtitle="Add institutional or NGO partner"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Organization Name *</label>
            <input
              type="text"
              value={addForm.name}
              onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Partner Type</label>
              <select
                value={addForm.partner_type}
                onChange={(e) => setAddForm({ ...addForm, partner_type: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="NGO">NGO</option>
                <option value="School">School</option>
                <option value="Hospital">Hospital</option>
                <option value="Business">Business</option>
                <option value="Government">Government</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Contact Person</label>
              <input
                type="text"
                value={addForm.contact_person}
                onChange={(e) => setAddForm({ ...addForm, contact_person: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            Save Partner Organization
          </button>
        </form>
      </Modal>
    </div>
  );
};
