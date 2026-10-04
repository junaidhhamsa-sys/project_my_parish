import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SOPItem } from '../types';
import { Badge } from '../components/common/Badge';
import { BookOpen, CheckCircle2, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';

export const SOPsPage: React.FC = () => {
  const [sops, setSops] = useState<SOPItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSOP, setSelectedSOP] = useState<SOPItem | null>(null);

  const loadSOPs = async () => {
    setLoading(true);
    try {
      const res = await api.getSOPs();
      setSops(res || []);
      if (res && res.length > 0) setSelectedSOP(res[0]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSOPs();
  }, []);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Standard Operating Procedures (SOP Manual)</h1>
        <p className="text-xs text-slate-500 font-medium">Standardized operational workflows across all 45-day framework domains</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading SOP manual...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* SOP List Sidebar */}
          <div className="space-y-2">
            {sops.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSOP(s)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  selectedSOP?.id === s.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-teal-400">{s.code}</span>
                  <p className="text-xs font-bold leading-tight">{s.title}</p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0 opacity-60" />
              </button>
            ))}
          </div>

          {/* Selected SOP Detail Viewer */}
          {selectedSOP && (
            <div className="lg:col-span-2 p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-teal-600 uppercase">{selectedSOP.code}</span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">{selectedSOP.title}</h2>
                </div>
                <Badge variant="info">Ver {selectedSOP.version}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Process Owner:</span>
                  <p className="font-bold text-slate-800">{selectedSOP.owner}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Domain Category:</span>
                  <p className="font-bold text-slate-800">{selectedSOP.category}</p>
                </div>
              </div>

              {/* Step-by-Step Step Visualization */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Step-by-Step Procedure Workflow:</h4>
                <div className="space-y-3">
                  {(selectedSOP.steps_json || '').split('\n').map((stepLine, idx) => (
                    <div key={idx} className="flex gap-3 items-start p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                        {idx + 1}
                      </div>
                      <p className="pt-0.5 font-medium leading-relaxed">{stepLine.replace(/^\d+\.\s*/, '')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
