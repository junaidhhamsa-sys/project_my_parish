import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Committee } from '../types';
import { Modal } from '../components/common/Modal';
import { Award, HandHeart, Target, Users, Plus } from 'lucide-react';

export const CommitteesPage: React.FC = () => {
  const [committees, setCommittees] = useState<Committee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommittee, setSelectedCommittee] = useState<any>(null);

  const loadCommittees = async () => {
    setLoading(true);
    try {
      const res = await api.getCommittees();
      setCommittees(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommittees();
  }, []);

  const openDetail = async (id: number) => {
    try {
      const res = await api.getCommitteeDetail(id);
      setSelectedCommittee(res);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Community Committees</h1>
          <p className="text-xs text-slate-500 font-medium">Parish leadership & operational committees</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading committees...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {committees.map((c) => (
            <div key={c.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    {c.volunteer_count} Volunteers
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{c.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                  <p><span className="font-bold text-slate-800">Leader:</span> {c.leader_name}</p>
                  <p className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]"><Target className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {c.goals}</p>
                </div>
              </div>

              <button
                onClick={() => openDetail(c.id)}
                className="w-full py-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors border border-purple-100 mt-2"
              >
                View Committee Roster
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedCommittee && (
        <Modal
          isOpen={!!selectedCommittee}
          onClose={() => setSelectedCommittee(null)}
          title={selectedCommittee.committee.name}
          subtitle={`Leader: ${selectedCommittee.committee.leader_name}`}
        >
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5"><HandHeart className="w-4 h-4 text-emerald-600" /> Assigned Volunteers</h4>
            <div className="space-y-2">
              {selectedCommittee.volunteers.map((v: any) => (
                <div key={v.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{v.member_name}</p>
                    <p className="text-[11px] text-slate-400">Skills: {v.skills}</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{v.total_hours} hrs</span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
