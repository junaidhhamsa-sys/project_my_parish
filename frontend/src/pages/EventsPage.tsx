import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Event, EventRegistration } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Search, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Grid, 
  List, 
  CheckCircle2, 
  UserCheck,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

export const EventsPage: React.FC = () => {
  const { showToast } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [createForm, setCreateForm] = useState({
    name: '',
    category: 'Community',
    location: '',
    start_time: '2026-10-15 10:00',
    end_time: '2026-10-15 16:00',
    capacity: 100,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500'
  });

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await api.getEvents(categoryFilter);
      setEvents(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [categoryFilter]);

  const handleRegister = async () => {
    if (!selectedEvent) return;
    try {
      await api.registerEvent(selectedEvent.id, 1); // Member ID 1
      showToast(`Registered successfully for ${selectedEvent.name}!`, 'success');
      setIsRegisterOpen(false);
      loadEvents();
    } catch (err: any) {
      showToast(err.message || 'Failed to register for event', 'error');
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEvent(createForm);
      showToast('Event created and published!', 'success');
      setIsCreateOpen(false);
      setCreateForm({
        name: '',
        category: 'Community',
        location: '',
        start_time: '2026-10-15 10:00',
        end_time: '2026-10-15 16:00',
        capacity: 100,
        description: '',
        image_url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500'
      });
      loadEvents();
    } catch (e) {
      showToast('Error creating event', 'error');
    }
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      await api.deleteEvent(eventToDelete.id);
      showToast(`Event '${eventToDelete.name}' deleted successfully`, 'success');
      setEventToDelete(null);
      if (selectedEvent?.id === eventToDelete.id) {
        setSelectedEvent(null);
        setIsRegisterOpen(false);
      }
      loadEvents();
    } catch (e) {
      showToast('Failed to delete event', 'error');
    }
  };

  const categories = ['All', 'Community', 'Education', 'Youth', 'Welfare', 'Healthcare', 'Cultural', 'Fundraising', 'Volunteer'];

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Parish Events & Activities</h1>
          <p className="text-xs text-slate-500 font-medium">Community gatherings, retreats, youth drives, and health camps</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-200/80 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'list' ? 'bg-white shadow text-slate-900' : 'text-slate-600'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Event</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs font-bold">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategoryFilter(c)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              categoryFilter === c
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Events View */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 animate-pulse bg-white rounded-2xl border border-slate-200">
          Loading events...
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="font-bold">No parish events found</p>
          <p className="text-slate-400">Click "Create Event" above to add an activity.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.map((ev) => (
            <div key={ev.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between overflow-hidden">
              <div className="space-y-3">
                <div className="relative">
                  <img
                    src={ev.image_url || 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500'}
                    alt={ev.name}
                    className="w-full h-40 object-cover rounded-xl"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEventToDelete(ev);
                    }}
                    className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl shadow-md transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant="info">{ev.category}</Badge>
                  <span className="text-[11px] font-bold text-slate-500">{ev.status}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{ev.name}</h3>

                <div className="space-y-1 text-xs text-slate-500 font-medium">
                  <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-teal-600" /> {ev.start_time}</p>
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-teal-600" /> {ev.location}</p>
                </div>

                {/* Capacity Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold">
                    <span className="text-slate-500">Registrations</span>
                    <span className="text-slate-800">{ev.registered_count} / {ev.capacity}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500"
                      style={{ width: `${Math.min(100, (ev.registered_count / ev.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => {
                    setSelectedEvent(ev);
                    setIsRegisterOpen(true);
                  }}
                  className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-colors"
                >
                  Register & Details
                </button>
                <button
                  onClick={() => setEventToDelete(ev)}
                  className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl border border-rose-100 transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Event Name</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5">Location</th>
                <th className="px-6 py-3.5">Capacity</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((ev) => (
                <tr key={ev.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-900">{ev.name}</td>
                  <td className="px-6 py-4"><Badge variant="info">{ev.category}</Badge></td>
                  <td className="px-6 py-4 font-medium text-slate-600">{ev.start_time}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{ev.location}</td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{ev.registered_count} / {ev.capacity}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedEvent(ev); setIsRegisterOpen(true); }}
                        className="px-3 py-1.5 text-[11px] font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg"
                      >
                        Register
                      </button>
                      <button
                        onClick={() => setEventToDelete(ev)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Register / Details Modal */}
      {selectedEvent && (
        <Modal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          title={selectedEvent.name}
          subtitle={`Location: ${selectedEvent.location}`}
        >
          <div className="space-y-4 font-sans">
            <p className="text-xs text-slate-600 leading-relaxed">{selectedEvent.description || 'No detailed description.'}</p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <p><span className="font-bold">Organizer:</span> {selectedEvent.organizer || 'Parish Events Committee'}</p>
              <p><span className="font-bold">Date:</span> {selectedEvent.start_time}</p>
              <p><span className="font-bold">Seats Available:</span> {selectedEvent.capacity - selectedEvent.registered_count} seats</p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleRegister}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition-colors"
              >
                Confirm Member Registration
              </button>
              <button
                onClick={() => setEventToDelete(selectedEvent)}
                className="px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete Event
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Event Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Parish Event"
        subtitle="Schedule a new community event"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Event Title *</label>
            <input
              type="text"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              placeholder="e.g. Parish Youth Camp 2026"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Category</label>
              <select
                value={createForm.category}
                onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              >
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Location *</label>
              <input
                type="text"
                value={createForm.location}
                onChange={(e) => setCreateForm({ ...createForm, location: e.target.value })}
                placeholder="Parish Hall / Ground"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Start Time</label>
              <input
                type="text"
                value={createForm.start_time}
                onChange={(e) => setCreateForm({ ...createForm, start_time: e.target.value })}
                placeholder="2026-10-15 10:00"
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Capacity Seats</label>
              <input
                type="number"
                value={createForm.capacity}
                onChange={(e) => setCreateForm({ ...createForm, capacity: Number(e.target.value) })}
                className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Event Description</label>
            <textarea
              value={createForm.description}
              onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
              placeholder="Event details..."
              rows={3}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            Publish Event
          </button>
        </form>
      </Modal>

      {/* Delete Event Confirmation Modal */}
      {eventToDelete && (
        <Modal
          isOpen={!!eventToDelete}
          onClose={() => setEventToDelete(null)}
          title="Confirm Delete Event"
          subtitle="Remove event from parish schedule"
        >
          <div className="space-y-4 text-xs font-sans">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Are you sure you want to delete event '{eventToDelete.name}'?</p>
                <p className="text-[11px] text-rose-700 mt-1">
                  Location: {eventToDelete.location} | Date: {eventToDelete.start_time}. All registered member participants will be unlinked.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setEventToDelete(null)}
                className="px-4 py-2 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteEvent}
                className="px-4 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm"
              >
                Yes, Delete Event
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
