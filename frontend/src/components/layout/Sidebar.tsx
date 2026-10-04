import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Home, 
  Award, 
  HandHeart, 
  Briefcase, 
  Calendar, 
  HeartPulse, 
  Megaphone, 
  DollarSign, 
  FolderKanban, 
  BarChart3, 
  Target, 
  Building2, 
  BookOpen, 
  ShieldAlert, 
  Sparkles,
  X,
  Church
} from 'lucide-react';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { role } = useAuth();

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Community Impact', path: '/impact', icon: Sparkles },
      ]
    },
    {
      group: 'Community',
      items: [
        { label: 'Members', path: '/members', icon: Users },
        { label: 'Families', path: '/families', icon: Home },
        { label: 'Committees', path: '/committees', icon: Award },
      ]
    },
    {
      group: 'Operations',
      items: [
        { label: 'Volunteers', path: '/volunteers', icon: HandHeart },
        { label: 'Services', path: '/services', icon: Briefcase },
        { label: 'Events', path: '/events', icon: Calendar },
        { label: 'Welfare & Support', path: '/welfare', icon: HeartPulse },
      ]
    },
    {
      group: 'Outreach & Resources',
      items: [
        { label: 'Announcements', path: '/announcements', icon: Megaphone },
        { label: 'Fundraising', path: '/fundraising', icon: DollarSign },
        { label: 'Documents', path: '/documents', icon: FolderKanban },
      ]
    },
    {
      group: 'Governance & SOP',
      items: [
        { label: 'Analytics', path: '/analytics', icon: BarChart3 },
        { label: 'KPI Framework', path: '/kpis', icon: Target },
        { label: 'Partnerships', path: '/partners', icon: Building2 },
        { label: 'SOP Manual', path: '/sops', icon: BookOpen },
        { label: 'Administration', path: '/admin', icon: ShieldAlert, adminOnly: true },
      ]
    }
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 border-r border-slate-800">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-slate-800">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 font-bold shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
            <Church className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold tracking-tight text-white uppercase font-sans">
              MY PARISH <span className="text-teal-400">MY PROUD</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">Community Platform</p>
          </div>
        </NavLink>
        <button
          onClick={onCloseMobile}
          className="p-1 text-slate-400 rounded-lg lg:hidden hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((g, idx) => (
          <div key={idx}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              {g.group}
            </div>
            <div className="space-y-1">
              {g.items.map((item) => {
                if (item.adminOnly && role !== 'super_admin' && role !== 'parish_admin') {
                  return null;
                }
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                        isActive
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Tag */}
      <div className="p-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
        <p className="font-semibold text-slate-400">Parish Development v1.0</p>
        <p className="text-[10px] mt-0.5">45-Day Community Framework</p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-xs h-full bg-slate-900 shadow-2xl z-50 animate-in slide-in-from-left">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
