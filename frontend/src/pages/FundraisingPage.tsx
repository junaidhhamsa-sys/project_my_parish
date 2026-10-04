import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Campaign, Donation } from '../types';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Plus, Heart, Award, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const FundraisingPage: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'donations'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isCampaignOpen, setIsCampaignOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const [donateForm, setDonateForm] = useState({
    donor_name: 'Robert Taylor',
    donor_email: 'robert.taylor@example.com',
    amount: 250,
    is_anonymous: false,
    notes: 'In support of parish healthcare wing'
  });

  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    goal_amount: 50000,
    start_date: '2026-10-01',
    end_date: '2026-12-31'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [cRes, dRes] = await Promise.all([
        api.getCampaigns(),
        api.getDonations()
      ]);
      setCampaigns(cRes || []);
      setDonations(dRes || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRecordDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.recordDonation({
        campaign_id: selectedCampaign?.id,
        ...donateForm
      });
      showToast('Donation recorded & digital tax receipt generated!', 'success');
      setIsDonateOpen(false);
      loadData();
    } catch (e) {
      showToast('Error recording donation', 'error');
    }
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createCampaign(campaignForm);
      showToast('New fundraising campaign created!', 'success');
      setIsCampaignOpen(false);
      loadData();
    } catch (e) {
      showToast('Failed to create campaign', 'error');
    }
  };

  const totalRaisedOverall = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fundraising & Stewardship</h1>
          <p className="text-xs text-slate-500 font-medium">Parish development campaigns, donor receipts, and transparent audit tracking</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsDonateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-colors"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Record Donation</span>
          </button>
          <button
            onClick={() => setIsCampaignOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm"
          >
            <Plus className="w-4 h-4 text-slate-500" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Top Total Stats */}
      <div className="p-6 bg-gradient-to-r from-purple-900 via-slate-900 to-teal-950 text-white rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-purple-300 uppercase">Stewardship Ledger</span>
          <h2 className="text-3xl font-black tracking-tight mt-1">₹{totalRaisedOverall.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h2>
          <p className="text-xs text-slate-300 mt-1">Total contributions received across {donations.length} recorded donations</p>
        </div>
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur border border-white/20">
          <DollarSign className="w-8 h-8 text-emerald-400" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('campaigns')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'campaigns' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Campaigns ({campaigns.length})
        </button>
        <button
          onClick={() => setActiveTab('donations')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'donations' ? 'bg-slate-900 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Donations Log ({donations.length})
        </button>
      </div>

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((c) => (
            <div key={c.id} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between overflow-hidden">
              <div className="space-y-3">
                <img
                  src={c.image_url || 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=500'}
                  alt={c.title}
                  className="w-full h-36 object-cover rounded-xl"
                />

                <div className="flex items-center justify-between">
                  <Badge variant={c.status === 'Active' ? 'success' : 'neutral'}>{c.status}</Badge>
                  <span className="text-[11px] font-semibold text-slate-400">{c.donor_count} Donors</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">{c.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{c.description}</p>                {/* Progress Bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-emerald-600">₹{c.raised_amount.toLocaleString()}</span>
                    <span className="text-slate-400">Target: ₹{c.goal_amount.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${Math.min(100, c.progress_percent || 0)}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-bold text-right text-slate-400">
                    {c.progress_percent}% Achieved
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCampaign(c);
                  setIsDonateOpen(true);
                }}
                className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-colors mt-2"
              >
                Donate to Campaign
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Donations Log Tab */}
      {activeTab === 'donations' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase">
              <tr>
                <th className="px-6 py-3.5">Reference TXN</th>
                <th className="px-6 py-3.5">Donor Name</th>
                <th className="px-6 py-3.5">Campaign Fund</th>
                <th className="px-6 py-3.5">Amount (₹)</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">{d.reference_number}</td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {d.is_anonymous ? 'Anonymous Benefactor' : d.donor_name}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-600">{d.campaign_name}</td>
                  <td className="px-6 py-4 font-black text-emerald-600">+₹{d.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-slate-500">{d.date}</td>
                  <td className="px-6 py-4"><Badge variant="success">{d.payment_status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Donate Modal */}
      <Modal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        title="Record Parish Contribution"
        subtitle={selectedCampaign ? `Fund: ${selectedCampaign.title}` : "General Parish Development Fund"}
      >
        <form onSubmit={handleRecordDonation} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Donor Name *</label>
            <input
              type="text"
              value={donateForm.donor_name}
              onChange={(e) => setDonateForm({ ...donateForm, donor_name: e.target.value })}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Contribution Amount (₹) *</label>
            <input
              type="number"
              value={donateForm.amount}
              onChange={(e) => setDonateForm({ ...donateForm, amount: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="anon"
              checked={donateForm.is_anonymous}
              onChange={(e) => setDonateForm({ ...donateForm, is_anonymous: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="anon" className="text-xs font-semibold text-slate-700">Keep donor identity anonymous on public lists</label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
          >
            Record Contribution & Issue Receipt
          </button>
        </form>
      </Modal>

      {/* New Campaign Modal */}
      <Modal
        isOpen={isCampaignOpen}
        onClose={() => setIsCampaignOpen(false)}
        title="Create Development Campaign"
        subtitle="Initiate a new fundraising campaign"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Campaign Title *</label>
            <input
              type="text"
              value={campaignForm.title}
              onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
              placeholder="Solar Energy & Eco Project"
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Target Goal (₹) *</label>
            <input
              type="number"
              value={campaignForm.goal_amount}
              onChange={(e) => setCampaignForm({ ...campaignForm, goal_amount: Number(e.target.value) })}
              className="w-full px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md"
          >
            Launch Campaign
          </button>
        </form>
      </Modal>
    </div>
  );
};
