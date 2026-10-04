import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Church, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email, password);
      login(res.access_token, res.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-slate-100 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white mx-auto shadow-lg shadow-teal-600/30">
            <Church className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            MY PARISH <span className="text-teal-600">MY PROUD</span>
          </h2>
          <p className="text-xs font-semibold text-slate-400">Sign in to your parish portal</p>
        </div>

        {error && (
          <div className="p-3 text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4 text-teal-400" />
          </button>
        </form>

        {/* Demo Accounts Quick-Fill Section */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
            <span>Quick Demo Credentials</span>
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => fillDemo('admin@example.com', 'admin123')}
              className="p-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold border border-purple-100 text-left transition-colors"
            >
              Super Admin
            </button>
            <button
              onClick={() => fillDemo('communityadmin@example.com', 'admin123')}
              className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 font-semibold border border-teal-100 text-left transition-colors"
            >
              Parish Admin
            </button>
            <button
              onClick={() => fillDemo('leader@example.com', 'leader123')}
              className="p-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold border border-blue-100 text-left transition-colors"
            >
              Committee Leader
            </button>
            <button
              onClick={() => fillDemo('volunteer@example.com', 'volunteer123')}
              className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold border border-emerald-100 text-left transition-colors"
            >
              Lead Volunteer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
