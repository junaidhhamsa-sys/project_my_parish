import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { 
  Users, 
  HandHeart, 
  Calendar, 
  HeartPulse, 
  DollarSign, 
  Briefcase, 
  Megaphone, 
  ArrowRight, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await api.getDashboardSummary();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="p-8 space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="h-20 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { kpis, charts, recent_events, recent_requests, recent_donations, announcements } = data;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto font-sans">
      {/* Welcome Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-full">
            Role: {role.replace('_', ' ').toUpperCase()} Context
          </span>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mt-2">
            Welcome back, {user?.full_name || 'Parish Administrator'}
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Overview of community operations, volunteer engagements, and welfare case management.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => navigate('/members')}
            className="px-4 py-2.5 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl shadow-md transition-colors flex items-center gap-1.5"
          >
            <span>Manage Members</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 6 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard
          title="Total Members"
          value={kpis.total_members}
          subtitle="Registered parishioners"
          icon={Users}
          trend="+14%"
          color="teal"
        />
        <StatCard
          title="Active Volunteers"
          value={kpis.active_volunteers}
          subtitle="across 7 committees"
          icon={HandHeart}
          trend="+22%"
          color="emerald"
        />
        <StatCard
          title="Upcoming Events"
          value={kpis.upcoming_events}
          subtitle="Registration open"
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Open Welfare Cases"
          value={kpis.open_cases}
          subtitle="Requires attention"
          icon={HeartPulse}
          trend="1 Critical"
          trendPositive={false}
          color="rose"
        />
        <StatCard
          title="Total Raised"
          value={`₹${(kpis.total_raised / 1000).toFixed(1)}k`}
          subtitle="Fundraising campaigns"
          icon={DollarSign}
          trend="82.6%"
          color="purple"
        />
        <StatCard
          title="Active Services"
          value={kpis.active_services}
          subtitle="Community programs"
          icon={Briefcase}
          color="amber"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member & Volunteer Growth */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Member Growth Trend</h3>
              <p className="text-[11px] text-slate-400">Monthly parish registration trajectory</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts.member_growth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} name="Members" />
                <Line type="monotone" dataKey="volunteers" stroke="#10b981" strokeWidth={2} name="Volunteers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Requests Breakdown */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Service Category Demand</h3>
              <p className="text-[11px] text-slate-400">Member request volume by sector</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts.service_breakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="requests" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Fundraising Performance */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Fundraising Growth</h3>
              <p className="text-[11px] text-slate-400">Cumulative donations received (₹)</p>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={charts.fundraising_monthly}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="raised" fill="#8b5cf6" fillOpacity={0.15} stroke="#8b5cf6" strokeWidth={2.5} name="Raised (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Main Grid: Events & Service Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Parish Events</h3>
            </div>
            <button onClick={() => navigate('/events')} className="text-xs font-bold text-teal-600 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recent_events.slice(0, 4).map((ev: any) => (
              <div key={ev.id} className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{ev.name}</span>
                    <Badge variant="info">{ev.category}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                    <span><Clock className="w-3 h-3 inline mr-1" />{ev.start_time}</span>
                    <span>• {ev.location}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-800">{ev.registered_count} / {ev.capacity}</span>
                  <span className="block text-[10px] text-slate-400 font-semibold">Registered</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Service Requests */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Service Requests</h3>
            </div>
            <button onClick={() => navigate('/services')} className="text-xs font-bold text-teal-600 hover:underline">
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recent_requests.slice(0, 4).map((req: any) => (
              <div key={req.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{req.service_name}</span>
                    <Badge variant={req.priority === 'Critical' || req.priority === 'High' ? 'danger' : 'neutral'}>
                      {req.priority}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Requested by <span className="font-semibold text-slate-700">{req.member_name}</span> ({req.request_number})
                  </p>
                </div>

                <Badge variant={req.status === 'Completed' ? 'success' : req.status === 'Submitted' ? 'warning' : 'info'}>
                  {req.status}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Donations & Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">Recent Donations</h3>
            </div>
            <button onClick={() => navigate('/fundraising')} className="text-xs font-bold text-teal-600 hover:underline">
              Fundraising Portal
            </button>
          </div>

          <div className="space-y-3">
            {recent_donations.slice(0, 4).map((don: any) => (
              <div key={don.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800">{don.donor_name}</p>
                  <p className="text-[11px] text-slate-400">{don.campaign_name}</p>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-600 text-sm">+₹{don.amount.toLocaleString()}</span>
                  <span className="block text-[10px] text-slate-400">{don.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Announcements */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">Parish Announcements</h3>
            </div>
            <button onClick={() => navigate('/announcements')} className="text-xs font-bold text-teal-600 hover:underline">
              Announcements Feed
            </button>
          </div>

          <div className="space-y-3">
            {announcements.slice(0, 3).map((anc: any) => (
              <div key={anc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{anc.title}</span>
                  <Badge variant={anc.priority === 'High' || anc.priority === 'Urgent' ? 'danger' : 'info'}>
                    {anc.priority}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{anc.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
