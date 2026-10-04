import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Announcement } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Plus, Bell, Clock, Users, ShieldAlert } from 'lucide-react';

export const AnnouncementsPage: React.FC = () => {
  const { showToast, role } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [audienceFilter, setAudienceFilter] = useState('Everyone');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    content: '',
    category: 'General',
    audience: 'Everyone',
    priority: 'Normal'
  });

  const loadAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.getAnnouncements();
      setAnnouncements(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createAnnouncement(createForm);
      showToast('Announcement published to parish feed!', 'success');
      setIsCreateOpen(false);
      loadAnnouncements();
    } catch (e) {
      showToast('Failed to publish announcement', 'error');
    }
  };

  const audiences = ['Everyone', 'Members', 'Volunteers', 'Youth', 'Families', 'Committee'];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Communication & Announcements</h1>
          <p className="text-xs text-slate-500 font-medium">Parish broadcasts, emergency alerts, and committee news</p>
        </div>

        {(role === 'super_admin' || role === 'parish_admin') && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
        )}
      </div>

      {/* Audience Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {audiences.map((aud) => (
          <button
            key={aud}
            onClick={() => setAudienceFilter(aud)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              audienceFilter === aud
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Audience: {aud}
          </button>
        ))}
      </div>

      {/* Announcements Feed */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading announcements feed...
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl">
          {announcements
            .filter(a => audienceFilter === 'Everyone' || a.audience === audienceFilter || a.audience === 'Everyone')
            .map((anc) => (
              <div key={anc.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={anc.priority === 'Urgent' || anc.priority === 'High' ? 'danger' : 'purple'}>
                      {anc.priority} Priority
                    </Badge>
                    <Badge variant="info">Target: {anc.audience}</Badge>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">Published {anc.publish_date || '2026-09-20'}</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900">{anc.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">{anc.content}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>Author: {anc.author_name}</span>
                  <span>Category: {anc.category}</span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Create Announcement Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Broadcast Parish Announcement"
        subtitle="Publish news to members or targeted groups"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Announcement Title *</label>
            <input
              type="text"
              value={createForm.title}
              onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
              placeholder="Notice: Emergency Food Drive"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Target Audience</label>
              <select
                value={createForm.audience}
                onChange={(e) => setCreateForm({ ...createForm, audience: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                {audiences.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Priority Level</label>
              <select
                value={createForm.priority}
                onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Message Content *</label>
            <textarea
              value={createForm.content}
              onChange={(e) => setCreateForm({ ...createForm, content: e.target.value })}
              placeholder="Detailed announcement content..."
              rows={4}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md"
          >
            Publish Announcement
          </button>
        </form>
      </Modal>
    </div>
  );
};
