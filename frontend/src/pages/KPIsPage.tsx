import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { KPIItem } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { Target, Plus, TrendingUp, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const KPIsPage: React.FC = () => {
  const { showToast } = useAuth();
  const [kpis, setKpis] = useState<KPIItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    category: 'Community',
    target_value: 1000,
    current_value: 842,
    unit: 'members',
    period: '2026 Q3',
    owner: 'Parish Secretariat'
  });

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const res = await api.getKPIs();
      setKpis(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKPIs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createKPI(createForm);
      showToast('KPI metric added to framework!', 'success');
      setIsCreateOpen(false);
      loadKPIs();
    } catch (e) {
      showToast('Error creating KPI', 'error');
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Key Performance Indicators (KPIs)</h1>
          <p className="text-xs text-slate-500 font-medium">45-day framework benchmark tracking & progress status</p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add KPI Metric</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading KPI tracking metrics...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kpis.map((k) => (
            <div key={k.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="info">{k.category}</Badge>
                <Badge variant={k.status === 'Completed' ? 'success' : k.status === 'On Track' ? 'info' : 'warning'}>
                  {k.status}
                </Badge>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900">{k.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Owner: {k.owner} • {k.period}</p>
              </div>

              {/* Progress */}
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-900">{k.current_value.toLocaleString()} {k.unit}</span>
                  <span className="text-slate-400">Target: {k.target_value.toLocaleString()} {k.unit}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full"
                    style={{ width: `${Math.min(100, k.progress_percent || 0)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> {k.trend}
                  </span>
                  <span className="font-bold text-slate-700">{k.progress_percent}% Achieved</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add KPI Metric"
        subtitle="Track a quantitative community goal"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Metric Name *</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="Active Parish Member Engagement"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Target Value *</label>
              <input
                type="number"
                value={createForm.target_value}
                onChange={(e) => setCreateForm({ ...createForm, target_value: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Current Value *</label>
              <input
                type="number"
                value={createForm.current_value}
                onChange={(e) => setCreateForm({ ...createForm, current_value: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            Save KPI Metric
          </button>
        </form>
      </Modal>
    </div>
  );
};
