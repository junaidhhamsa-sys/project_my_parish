import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, HandHeart, HeartPulse, DollarSign, Award, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const ImpactPage: React.FC = () => {
  const navigate = useNavigate();

  const impactData = [
    { category: 'Healthcare', patients: 920, target: 1000 },
    { category: 'Education Tutoring', students: 185, target: 200 },
    { category: 'Welfare Baskets', families: 320, target: 350 },
    { category: 'Youth Programs', teens: 240, target: 250 },
    { category: 'Senior Care', seniors: 150, target: 160 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Dashboard
        </button>
        <span className="px-3 py-1 text-xs font-bold bg-teal-100 text-teal-800 rounded-full border border-teal-200">
          Annual Impact Report 2026
        </span>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>My Parish My Proud Framework</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Community Development & Social Impact
        </h1>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          Empirical measurements of parish progress across member growth, volunteer hours, emergency welfare relief, healthcare delivery, and fundraising stewardship.
        </p>
      </div>

      {/* Impact Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Members Reached</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600"><Users className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900">842</p>
          <p className="text-[11px] font-semibold text-emerald-600">+14% Growth from 2025</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Volunteer Hours</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600"><HandHeart className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900">4,820 hrs</p>
          <p className="text-[11px] font-semibold text-emerald-600">128 Active Volunteers</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Healthcare Patients</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600"><HeartPulse className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900">920</p>
          <p className="text-[11px] font-semibold text-blue-600">Free Checkups & Medication</p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase">Funds Raised</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600"><DollarSign className="w-5 h-5" /></div>
          </div>
          <p className="text-3xl font-black text-slate-900">₹2,48,000</p>
          <p className="text-[11px] font-semibold text-purple-600">82.6% of Annual Target</p>
        </div>
      </div>

      {/* Impact Chart */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Program Beneficiaries vs Target</h3>
          <span className="text-xs text-slate-400">Measured YTD 2026</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={impactData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="patients" fill="#0d9488" radius={[6, 6, 0, 0]} name="Served" />
              <Bar dataKey="target" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
