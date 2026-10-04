import React, { useState } from 'react';
import { api } from '../../services/api';
import { Bot, Sparkles, X, Send, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; data?: any; actions?: string[] }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your **Parish AI Assistant**. Ask me anything about member statistics, volunteer hours, welfare cases, community services, or event schedules.'
    }
  ]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSend = async (queryText?: string) => {
    const q = queryText || input;
    if (!q.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: q }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);

    try {
      const res = await api.queryAI(q);
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: res.answer,
          data: res.data_summary,
          actions: res.suggested_actions
        }
      ]);
    } catch (e) {
      setMessages([
        ...newMsgs,
        {
          sender: 'ai',
          text: 'Sorry, I encountered an error querying the parish database. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: string) => {
    onClose();
    if (action.includes('Volunteer')) navigate('/volunteers');
    else if (action.includes('Event')) navigate('/events');
    else if (action.includes('Welfare') || action.includes('Support')) navigate('/welfare');
    else if (action.includes('Service')) navigate('/services');
    else if (action.includes('Campaign') || action.includes('Donation')) navigate('/fundraising');
    else navigate('/dashboard');
  };

  const examplePrompts = [
    "How many volunteers participated this month?",
    "Which events are coming next week?",
    "How many welfare cases are currently open?",
    "Which services have the highest demand?"
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/40">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Community AI Assistant</h2>
              <p className="text-[11px] text-teal-300 font-medium">Smart Parish Analytics & Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs shrink-0 shadow-sm font-bold">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-br-none shadow-md font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                }`}
              >
                <div dangerouslySetInnerHTML={{ __html: m.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />

                {/* Suggested Action Chips */}
                {m.actions && m.actions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act)}
                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-full border border-teal-200/80 transition-colors"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-center text-xs text-slate-400">
              <Bot className="w-4 h-4 text-teal-600 animate-spin" />
              <span>Analyzing parish database...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          {examplePrompts.map((p, pIdx) => (
            <button
              key={pIdx}
              onClick={() => handleSend(p)}
              className="px-2.5 py-1 text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI Assistant about parish statistics..."
            className="flex-1 px-4 py-2.5 text-xs font-medium text-slate-800 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-md transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
