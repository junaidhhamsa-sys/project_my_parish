import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Search, X, Users, Calendar, Briefcase, Megaphone, FolderKanban, ArrowRight } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open handled outside
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.globalSearch(query);
        setResults(res || []);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'Member': return Users;
      case 'Event': return Calendar;
      case 'Service': return Briefcase;
      case 'Announcement': return Megaphone;
      case 'Document': return FolderKanban;
      default: return Search;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search members, events, services..."
            className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="py-8 text-center text-xs font-medium text-slate-400">
              Searching parish records...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for "{query}".
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-4 text-xs text-slate-400 font-medium">
              Quick shortcuts:
              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={() => { navigate('/members'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-left font-semibold"
                >
                  <Users className="w-4 h-4 text-teal-600" /> Member Directory
                </button>
                <button
                  onClick={() => { navigate('/events'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-left font-semibold"
                >
                  <Calendar className="w-4 h-4 text-blue-600" /> Upcoming Events
                </button>
                <button
                  onClick={() => { navigate('/welfare'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-left font-semibold"
                >
                  <Briefcase className="w-4 h-4 text-rose-600" /> Support Cases
                </button>
                <button
                  onClick={() => { navigate('/documents'); onClose(); }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-left font-semibold"
                >
                  <FolderKanban className="w-4 h-4 text-amber-600" /> Document Library
                </button>
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-1">
              {results.map((r, idx) => {
                const Icon = getIcon(r.type);
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      navigate(r.link);
                      onClose();
                    }}
                    className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-teal-50 group-hover:text-teal-600 text-slate-500 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">{r.title}</p>
                        <p className="text-[11px] text-slate-400">{r.subtitle}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-teal-600">
                      {r.type} <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[10px] text-slate-400">
          <span>Search parish database</span>
          <span className="font-semibold">ESC to close</span>
        </div>
      </div>
    </div>
  );
};
