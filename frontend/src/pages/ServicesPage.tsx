import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Service, ServiceRequest } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Search, 
  Plus, 
  HeartPulse, 
  BookOpen, 
  HandHeart, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  MapPin,
  Calendar,
  FileText
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { showToast, role } = useAuth();
  const [activeTab, setActiveTab] = useState<'catalog' | 'requests'>('catalog');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [services, setServices] = useState<Service[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [requestDetails, setRequestDetails] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [sRes, rRes] = await Promise.all([
        api.getServices(categoryFilter),
        api.getServiceRequests()
      ]);
      setServices(sRes || []);
      setRequests(rRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleRequestService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    try {
      await api.createServiceRequest({
        service_id: selectedService.id,
        member_id: 1, // Default active member
        priority: 'Medium',
        details: requestDetails
      });
      showToast(`Service request submitted for ${selectedService.name}!`, 'success');
      setIsRequestModalOpen(false);
      setRequestDetails('');
      loadData();
    } catch (err: any) {
      showToast('Failed to submit service request', 'error');
    }
  };

  const handleUpdateStatus = async (requestId: number, newStatus: string) => {
    try {
      await api.updateServiceRequestStatus(requestId, newStatus);
      showToast(`Request status updated to ${newStatus}`, 'success');
      loadData();
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  const categories = [
    'All', 'Healthcare', 'Education', 'Welfare', 'Counselling', 'Family Support', 'Youth Programs', 'Emergency Assistance'
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Community Services</h1>
          <p className="text-xs text-slate-500 font-medium">Free parish programs, healthcare clinics, literacy tutoring, and assistance</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab(activeTab === 'catalog' ? 'requests' : 'catalog')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 rounded-xl hover:bg-teal-100 transition-colors"
          >
            <span>{activeTab === 'catalog' ? `Service Requests (${requests.length})` : 'Service Catalog'}</span>
            <ArrowRight className="w-4 h-4 text-teal-600" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      {activeTab === 'catalog' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
                categoryFilter === c
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Catalog Tab */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{s.category}</Badge>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Cap: {s.capacity} Patients/Students
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{s.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-3">{s.description}</p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {s.location}</p>
                  <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {s.schedule}</p>
                  <p className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" /> Docs: {s.required_documents || 'None'}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedService(s);
                  setIsRequestModalOpen(true);
                }}
                className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-sm transition-colors mt-2"
              >
                Request Service
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Requests Workflow Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-700 flex justify-between items-center">
            <span>Service Requests Tracking Workflow</span>
            <span className="text-slate-400">{requests.length} Total Requests</span>
          </div>

          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Request #</th>
                <th className="px-6 py-3.5">Service Name</th>
                <th className="px-6 py-3.5">Member Name</th>
                <th className="px-6 py-3.5">Priority</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Update Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{r.request_number}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{r.service_name}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{r.member_name}</td>
                  <td className="px-6 py-4">
                    <Badge variant={r.priority === 'Critical' || r.priority === 'High' ? 'danger' : 'neutral'}>{r.priority}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={r.status === 'Completed' ? 'success' : r.status === 'Submitted' ? 'warning' : 'info'}>
                      {r.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right space-x-1">
                    {(role === 'super_admin' || role === 'parish_admin') && (
                      <select
                        value={r.status}
                        onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                        className="px-2 py-1 text-[11px] font-semibold bg-slate-100 border border-slate-200 rounded-lg outline-none"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Request Modal */}
      {selectedService && (
        <Modal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          title={`Request: ${selectedService.name}`}
          subtitle={`Category: ${selectedService.category}`}
        >
          <form onSubmit={handleRequestService} className="space-y-4">
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs space-y-1 text-teal-900">
              <p className="font-bold">Required Documents:</p>
              <p>{selectedService.required_documents || 'No special documents required'}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Specific Request Details / Notes *</label>
              <textarea
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Explain family situation or specific requirements..."
                rows={4}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
            >
              Submit Service Request
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};
