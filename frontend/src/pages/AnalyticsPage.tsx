import React, { useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend 
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'community' | 'volunteers' | 'services' | 'events' | 'fundraising'>('community');

  const communityGrowth = [
    { month: 'Jan', members: 510, volunteers: 65 },
    { month: 'Feb', members: 560, volunteers: 72 },
    { month: 'Mar', members: 610, volunteers: 84 },
    { month: 'Apr', members: 660, volunteers: 95 },
    { month: 'May', members: 710, volunteers: 108 },
    { month: 'Jun', members: 770, volunteers: 118 },
    { month: 'Jul', members: 842, volunteers: 128 },
  ];

  const volunteerHoursByCommittee = [
    { name: 'Welfare Committee', hours: 1420 },
    { name: 'Events & Cultural', hours: 1180 },
    { name: 'Healthcare & Wellness', hours: 980 },
    { name: 'Youth Committee', hours: 750 },
    { name: 'Education Committee', hours: 490 },
  ];

  const serviceDemand = [
    { name: 'Welfare Food Basket', value: 320 },
    { name: 'Free Medical Checkup', value: 280 },
    { name: 'Youth Tutoring', value: 185 },
    { name: 'Family Counseling', value: 120 },
    { name: 'Vocational Skills', value: 95 },
  ];

  const COLORS = ['#0d9488', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

  const eventAttendance = [
    { name: 'Parish Festival', registered: 480, capacity: 500 },
    { name: 'Health Camp', registered: 240, capacity: 250 },
    { name: 'Charity Dinner', registered: 145, capacity: 150 },
    { name: 'Clean-up Drive', registered: 120, capacity: 120 },
    { name: 'Youth Retreat', registered: 58, capacity: 60 },
  ];

  const fundraisingTarget = [
    { month: 'May', raised: 28000, target: 35000 },
    { month: 'Jun', raised: 35000, target: 40000 },
    { month: 'Jul', raised: 42000, target: 45000 },
    { month: 'Aug', raised: 51000, target: 50000 },
    { month: 'Sep', raised: 94500, target: 80000 },
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports & Deep Analytics</h1>
        <p className="text-xs text-slate-500 font-medium">Interactive performance visualization for parish decision makers</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('community')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'community' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Community Analytics
        </button>
        <button
          onClick={() => setActiveTab('volunteers')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'volunteers' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Volunteer Participation
        </button>
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'services' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Service Utilization
        </button>
        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'events' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Event Attendance Rates
        </button>
        <button
          onClick={() => setActiveTab('fundraising')}
          className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'fundraising' ? 'bg-teal-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Fundraising Performance
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {activeTab === 'community' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Member & Volunteer Growth Trajectory (2026 YTD)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={communityGrowth}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="members" stroke="#0d9488" strokeWidth={3} name="Total Members" />
                  <Line type="monotone" dataKey="volunteers" stroke="#10b981" strokeWidth={2.5} name="Active Volunteers" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'volunteers' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Total Volunteer Hours Contributed by Committee</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={volunteerHoursByCommittee} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={160} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#10b981" radius={[0, 6, 6, 0]} name="Hours Contributed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Service Request Volume Breakdown</h3>
            <div className="h-80 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceDemand} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                    {serviceDemand.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Major Event Attendance vs Venue Capacity</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventAttendance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="registered" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Registered" />
                  <Bar dataKey="capacity" fill="#cbd5e1" radius={[6, 6, 0, 0]} name="Venue Capacity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'fundraising' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Fundraising Raised vs Target Benchmarks ($)</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={fundraisingTarget}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="raised" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="Actual Raised ($)" />
                  <Area type="monotone" dataKey="target" stroke="#cbd5e1" fill="transparent" strokeDasharray="5 5" name="Monthly Target ($)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
