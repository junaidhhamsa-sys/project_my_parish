import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  Search, 
  Bell, 
  Bot, 
  UserCircle, 
  LogOut, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface HeaderProps {
  onOpenCommandPalette: () => void;
  onOpenAIAssistant: () => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCommandPalette,
  onOpenAIAssistant,
  onOpenMobileMenu
}) => {
  const { user, role, setRole, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const rolesList: { key: UserRole; label: string; badgeBg: string }[] = [
    { key: 'super_admin', label: 'Super Admin', badgeBg: 'bg-purple-100 text-purple-800 border-purple-200' },
    { key: 'parish_admin', label: 'Parish Admin', badgeBg: 'bg-teal-100 text-teal-800 border-teal-200' },
    { key: 'committee_leader', label: 'Committee Leader', badgeBg: 'bg-blue-100 text-blue-800 border-blue-200' },
    { key: 'volunteer', label: 'Volunteer', badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    { key: 'member', label: 'Member', badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { key: 'viewer', label: 'Viewer / Auditor', badgeBg: 'bg-amber-100 text-amber-800 border-amber-200' },
  ];

  const currentRoleObj = rolesList.find(r => r.key === role) || rolesList[0];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200 shadow-sm">
      {/* Mobile Menu Toggle & Brand Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3.5 py-1.5 text-sm text-slate-400 bg-slate-100 hover:bg-slate-200/70 rounded-full border border-slate-200 transition-colors w-48 md:w-80"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">Search members, events, services...</span>
          <span className="sm:hidden">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-1.5 py-0.5 ml-auto text-[10px] font-semibold text-slate-500 bg-white rounded border border-slate-300">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full border transition-all ${currentRoleObj.badgeBg}`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentRoleObj.label}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Switch Role Context
              </div>
              {rolesList.map((r) => (
                <button
                  key={r.key}
                  onClick={() => {
                    setRole(r.key);
                    setShowRoleMenu(false);
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 text-xs font-medium transition-colors ${
                    role === r.key ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{r.label}</span>
                  {role === r.key && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAIAssistant}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 rounded-full transition-all shadow-sm"
          title="Ask AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
          <span className="hidden md:inline">AI Assistant</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-100 text-teal-800 rounded-full">3 New</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 text-xs">
                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                  <p className="font-semibold text-slate-800">Event Registration Confirmed</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Annual Community Festival registration confirmed for 2 family members.</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                  <p className="font-semibold text-slate-800">Volunteer Assignment Update</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Assigned lead volunteer role for Healthcare Clinic on Oct 8th.</p>
                </div>
                <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                  <p className="font-semibold text-slate-800">New Announcement Published</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Q3 Financial Audit & Stewardship report now available in Documents.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <img
              src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={user?.full_name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-teal-500/30"
            />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.full_name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
