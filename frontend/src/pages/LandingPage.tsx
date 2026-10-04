import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Church, 
  Users, 
  HandHeart, 
  Calendar, 
  HeartPulse, 
  ArrowRight, 
  ShieldCheck, 
  BookOpen, 
  Award,
  Sparkles
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-600/30">
              <Church className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
                MY PARISH <span className="text-teal-600">MY PROUD</span>
              </span>
              <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Community Development Platform
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <button onClick={() => navigate('/services')} className="hover:text-teal-600 transition-colors">Community Services</button>
            <button onClick={() => navigate('/events')} className="hover:text-teal-600 transition-colors">Upcoming Events</button>
            <button onClick={() => navigate('/impact')} className="hover:text-teal-600 transition-colors">Our Impact</button>
            <button onClick={() => navigate('/sops')} className="hover:text-teal-600 transition-colors">SOP Framework</button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-28 bg-gradient-to-b from-teal-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>45-Day Community Development Framework</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              My Parish. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">My People.</span> <br />
              My Future.
            </h1>

            <p className="text-base text-slate-600 font-normal leading-relaxed max-w-xl">
              One centralized platform unifying parish member management, volunteer mobilization, emergency welfare cases, free healthcare clinics, and transparent stewardship.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-2xl shadow-lg shadow-teal-600/30 transition-all flex items-center gap-2"
              >
                <span>Join the Community</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/services')}
                className="px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-2xl shadow-sm transition-all"
              >
                Explore Services
              </button>
            </div>

            {/* Micro Badges */}
            <div className="pt-6 flex items-center gap-6 text-xs text-slate-500 border-t border-slate-200/80">
              <span className="flex items-center gap-1.5 font-medium"><ShieldCheck className="w-4 h-4 text-teal-600" /> Confidential Welfare Access</span>
              <span className="flex items-center gap-1.5 font-medium"><Award className="w-4 h-4 text-emerald-600" /> Transparent Stewardship</span>
            </div>
          </div>

          {/* Hero Banner Visual */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 rounded-3xl blur-2xl -z-10" />
            <div className="p-4 bg-white rounded-3xl border border-slate-200 shadow-2xl space-y-4">
              <img
                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
                alt="Community Parish Event"
                className="w-full h-64 object-cover rounded-2xl"
              />
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Spotlight Project</span>
                  <h4 className="text-sm font-bold">Healthcare & Medical Wing Expansion</h4>
                  <p className="text-xs text-slate-400 mt-0.5">₹94,500 raised of ₹1,50,000 goal (63%)</p>
                </div>
                <button
                  onClick={() => navigate('/fundraising')}
                  className="px-3.5 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition-colors shrink-0"
                >
                  Support Fund
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community Statistics Grid */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-1">
            <div className="inline-flex p-3 rounded-2xl bg-teal-50 text-teal-600 mb-2"><Users className="w-6 h-6" /></div>
            <h3 className="text-3xl font-black text-slate-900">840+</h3>
            <p className="text-xs font-semibold text-slate-500">Registered Members</p>
          </div>
          <div className="text-center space-y-1">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-50 text-emerald-600 mb-2"><HandHeart className="w-6 h-6" /></div>
            <h3 className="text-3xl font-black text-slate-900">128</h3>
            <p className="text-xs font-semibold text-slate-500">Active Volunteers</p>
          </div>
          <div className="text-center space-y-1">
            <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2"><HeartPulse className="w-6 h-6" /></div>
            <h3 className="text-3xl font-black text-slate-900">920</h3>
            <p className="text-xs font-semibold text-slate-500">Patients Served YTD</p>
          </div>
          <div className="text-center space-y-1">
            <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-purple-600 mb-2"><Calendar className="w-6 h-6" /></div>
            <h3 className="text-3xl font-black text-slate-900">15+</h3>
            <p className="text-xs font-semibold text-slate-500">Upcoming Events</p>
          </div>
        </div>
      </section>

      {/* Core Community Services */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-teal-600 tracking-wider uppercase">Community Care Initiatives</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Comprehensive Parish Services</h2>
            <p className="text-xs text-slate-500 font-medium">Providing compassionate support across all stages of family life.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Free Medical & Wellness Clinic</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Bi-weekly blood pressure screenings, physician consultations, and free prescription aid for seniors and uninsured families.
              </p>
              <button onClick={() => navigate('/services')} className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Youth Literacy & Homework Hub</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Free after-school tutoring, STEM mentoring, and digital literacy classes for K-12 parish students led by accredited volunteers.
              </p>
              <button onClick={() => navigate('/services')} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <HandHeart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Emergency Welfare Relief</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Confidential micro-grants, food basket delivery, and temporary utility relief for families in crisis.
              </p>
              <button onClick={() => navigate('/welfare')} className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1">
                Learn More <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <Church className="w-5 h-5 text-teal-400" />
              <span>MY PARISH MY PROUD</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              St. Jude Parish Secretariat <br />
              100 Parish Way, St. Jude Quarter <br />
              Tel: +91 98765 0100
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Quick Navigation</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => navigate('/dashboard')} className="hover:text-white">Admin Dashboard</button></li>
              <li><button onClick={() => navigate('/members')} className="hover:text-white">Member Directory</button></li>
              <li><button onClick={() => navigate('/volunteers')} className="hover:text-white">Volunteer Portal</button></li>
              <li><button onClick={() => navigate('/events')} className="hover:text-white">Events Calendar</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Framework & Governance</h4>
            <ul className="space-y-2 text-slate-400">
              <li><button onClick={() => navigate('/sops')} className="hover:text-white">SOP Manual</button></li>
              <li><button onClick={() => navigate('/kpis')} className="hover:text-white">KPI Framework</button></li>
              <li><button onClick={() => navigate('/documents')} className="hover:text-white">Stewardship Reports</button></li>
              <li><button onClick={() => navigate('/partners')} className="hover:text-white">Community Partners</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Demo Credentials</h4>
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-[11px] space-y-1 font-mono">
              <p><span className="text-teal-400">Admin:</span> admin@example.com</p>
              <p><span className="text-teal-400">Pass:</span> admin123</p>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © 2026 MY PARISH MY PROUD Community Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};
