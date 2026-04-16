/**
 * MentorDashboardNew.jsx
 * Full mentor dashboard — Services, Coupons, Profile, Schedule, Sessions, Earnings
 * Replaces /mentor-profile with a tabbed, Topmate-style management UI
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import config from '../../config';
import {
  LayoutDashboard, Star, Tag, Calendar, MessageSquare,
  TrendingUp, Plus, Edit2, Trash2, Power, Eye, ExternalLink,
  ChevronDown, ChevronUp, Copy, Check, Loader2, Settings,
  DollarSign, Users, Award, X, GripVertical, Inbox, Type,
  Search, Bell, HelpCircle, Clock, Menu
} from 'lucide-react';
import DMInbox from './DMInbox';
import CustomSectionsTab from './CustomSectionsTab';



const API = config.API_BASE_URL;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const token = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

const SERVICE_LABELS = {
  one_on_one: '🎥 1:1 Session', quick_chat: '⚡ Quick Chat',
  mock_interview: '🎯 Mock Interview', career_guidance: '🧭 Career Guidance',
  discovery_call: '🌱 Discovery Call', priority_dm: '💬 Priority DM',
  resume_review: '📄 Resume Review', portfolio_review: '🖼️ Portfolio Review',
  ama: '🙋 Ask Me Anything', referral: '🤝 Referral',
  course: '📚 Course', workshop: '👥 Workshop',
  coaching_series: '🗓️ Coaching Series', webinar: '🖥️ Webinar', custom: '✨ Custom',
};

const C = { indigo: '#4F46E5', bg: '#EEF2FF', border: '#E2E8F0', green: '#059669', red: '#DC2626', slate: '#64748B' };

const Pill = ({ children, color = C.indigo, bg = C.bg }) => (
  <span style={{ background: bg, color, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>{children}</span>
);

const StatCard = ({ icon, label, value, sub, color = C.indigo }) => (
  <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '14px', padding: '18px 20px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <p style={{ margin: '0 0 4px', fontSize: '12px', fontWeight: 600, color: C.slate, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '26px', fontWeight: 800, color: '#1E293B' }}>{value}</p>
        {sub && <p style={{ margin: '2px 0 0', fontSize: '12px', color: C.slate }}>{sub}</p>}
      </div>
      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
    </div>
  </div>
);

// ─── Services Tab ─────────────────────────────────────────────────────────────
function ServicesTab({ mentorId }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editSvc, setEditSvc] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ serviceType: 'one_on_one', title: '', description: '', emoji: '', price: '', isFree: false, duration: 60, responseTime: 'Within 48 hours', includes: [] });

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/mentor/services/my`, { headers: authHeader() });
      setServices(r.data.services || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setEditSvc(null); setForm({ serviceType: 'one_on_one', title: '', description: '', emoji: '', price: '', isFree: false, duration: 60, responseTime: 'Within 48 hours', includes: [] }); setShowForm(true); };
  const openEdit = (s) => { setEditSvc(s); setForm({ serviceType: s.serviceType, title: s.title, description: s.description || '', emoji: s.emoji || '', price: s.price || '', isFree: s.isFree, duration: s.duration || 60, responseTime: s.responseTime || 'Within 48 hours', includes: s.includes || [] }); setShowForm(true); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, price: form.isFree ? 0 : Number(form.price) };
      if (editSvc) await axios.put(`${API}/mentor/services/${editSvc._id}`, payload, { headers: authHeader() });
      else await axios.post(`${API}/mentor/services`, payload, { headers: authHeader() });
      setShowForm(false);
      load();
    } catch (e) { alert(e.response?.data?.error || 'Failed to save service'); }
    setSaving(false);
  };

  const toggle = async (id) => {
    await axios.put(`${API}/mentor/services/${id}/toggle`, {}, { headers: authHeader() });
    load();
  };

  const del = async (id) => {
    if (!confirm('Delete this service?')) return;
    await axios.delete(`${API}/mentor/services/${id}`, { headers: authHeader() });
    load();
  };

  const ASYNC_TYPES = ['priority_dm', 'resume_review', 'portfolio_review', 'ama', 'referral', 'course'];
  const isAsync = ASYNC_TYPES.includes(form.serviceType);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Offerings</h2>
          <p className="text-slate-500 text-sm mt-1">{services.length} active service{services.length !== 1 ? 's' : ''} on profile</p>
        </div>
        <button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-bold shadow-sm transition-all">
          <Plus size={18} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-slate-400"><Loader2 size={32} className="animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="text-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl max-w-lg mx-auto shadow-sm">
          <p className="text-4xl mb-3">🎯</p>
          <p className="font-bold text-slate-800 mb-1">No services created yet</p>
          <p className="text-slate-500 text-xs mb-6">Define your expertise to start hosting bookings with mentees.</p>
          <button onClick={openNew} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-sm">+ Create First Service</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(s => {
            const isAsyncSvc = ASYNC_TYPES.includes(s.serviceType);
            return (
              <div key={s._id} className={`group relative bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md border border-slate-200/40 flex flex-col h-full ${!s.isActive ? 'opacity-60 bg-slate-50/50' : 'shadow-sm'}`}>
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 bg-indigo-50/50 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-indigo-100/20">
                    {s.emoji || '🎯'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                    <span className="text-xxs font-bold uppercase tracking-wider text-slate-400">
                      {s.isActive ? 'Live' : 'Paused'}
                    </span>
                  </div>
                </div>
                
                <div className="mb-4 flex-1">
                  <span className="text-xxs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {SERVICE_LABELS[s.serviceType] || s.serviceType}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-2 line-clamp-1">{s.title}</h3>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed h-[36px] overflow-hidden">{s.description}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg text-slate-800 text-xs font-extrabold">
                      {s.isFree ? <span className="text-green-600">Free</span> : `₹${s.price?.toLocaleString('en-IN')}`}
                    </div>
                    {s.duration && !isAsyncSvc && (
                      <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg text-slate-500 text-xxs font-medium">
                        <Calendar size={11} className="text-slate-400" /> {s.duration} min
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <button onClick={() => openEdit(s)} className="text-slate-400 hover:text-indigo-600 transition-colors p-1 hover:bg-slate-50 rounded-lg">
                      <Edit2 size={15} />
                    </button>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toggle(s._id)} 
                        title={s.isActive ? 'Deactivate' : 'Activate'}
                        className={`p-1 rounded-lg transition-colors ${
                          s.isActive 
                            ? 'text-amber-500 hover:bg-amber-50' 
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                      >
                        <Power size={15} />
                      </button>
                      <button onClick={() => del(s._id)} className="text-slate-400 hover:text-red-500 transition-colors p-1 hover:bg-slate-50 rounded-lg">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Service Form Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">{editSvc ? 'Edit Service' : 'Create New Service'}</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-all">
                  <X size={18} />
                </button>
              </div>

              <form className="space-y-4" onSubmit={e => { e.preventDefault(); save(); }}>
                <div>
                  <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Service Type</label>
                  <select value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-800">
                    {Object.entries(SERVICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div className="col-span-1">
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Emoji</label>
                    <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🎯" className="w-full text-center bg-slate-50 border border-slate-200/60 rounded-xl px-2 py-2 text-xl focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Mock Interview" className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none" required />
                  </div>
                </div>

                <div>
                  <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe what the mentee will get..." className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none" />
                </div>

                <div className="flex items-center gap-2 py-1">
                  <input type="checkbox" id="isFree" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked }))} className="rounded text-indigo-600 focus:ring-0 cursor-pointer" />
                  <label htmlFor="isFree" className="text-xs font-semibold text-slate-600 cursor-pointer">Offer for Free</label>
                </div>

                {!form.isFree && (
                  <div>
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Price (₹)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="999" className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                  </div>
                )}

                {!isAsync ? (
                  <div>
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Duration</label>
                    <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none">
                      {[15, 30, 45, 60, 75, 90, 120].map(d => <option key={d} value={d}>{d} minutes</option>)}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Response Time</label>
                    <select value={form.responseTime} onChange={e => setForm(f => ({ ...f, responseTime: e.target.value }))} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none">
                      {['Within 12 hours', 'Within 24 hours', 'Within 48 hours', 'Within 72 hours', 'Within 1 week'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50">
                    {saving ? 'Saving...' : editSvc ? 'Update Service' : 'Create Service'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Coupons Tab ──────────────────────────────────────────────────────────────
function CouponsTab() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState('');
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: 10, maxDiscountCap: '', appliesTo: 'all_services', maxUses: '', perUserLimit: 1, validUntil: '' });

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/mentor/coupons`, { headers: authHeader() });
      setCoupons(r.data.coupons || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    try {
      await axios.post(`${API}/mentor/coupons`, form, { headers: authHeader() });
      setShowForm(false);
      load();
    } catch (e) { alert(e.response?.data?.error || 'Failed to create coupon'); }
    setSaving(false);
  };

  const toggleCoupon = async (id, isActive) => {
    await axios.put(`${API}/mentor/coupons/${id}`, { isActive: !isActive }, { headers: authHeader() });
    load();
  };

  const delCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await axios.delete(`${API}/mentor/coupons/${id}`, { headers: authHeader() });
    load();
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Discount Coupons</h2>
          <p className="text-slate-500 text-sm mt-1">{coupons.length} coupon{coupons.length !== 1 ? 's' : ''} offered</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 flex items-center gap-2 text-sm font-bold shadow-sm transition-all">
          <Plus size={18} /> New Coupon
        </button>
      </div>

      {/* Tip Banner */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-800 flex items-center gap-2 shadow-sm">
        <span className="text-lg">💡</span>
        <span>
          <strong>Pro Tip:</strong> Share profile links with auto-applied coupons: 
          <code className="bg-blue-100 text-blue-900 px-1.5 py-0.5 rounded ml-1 font-bold">skillpilot.app/mentor/handle?coupon_code=SAVE20</code>
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center p-12 text-slate-400"><Loader2 size={32} className="animate-spin" /></div>
      ) : coupons.length === 0 ? (
        <div className="text-center p-12 bg-white border border-dashed border-slate-200 rounded-2xl max-w-lg mx-auto shadow-sm">
          <p className="text-4xl mb-3">🎟️</p>
          <p className="font-bold text-slate-800 mb-1">No campaigns created yet</p>
          <p className="text-slate-500 text-xs mb-6">Drive conversions by offering targeted discount incentives to mentees.</p>
          <button onClick={() => setShowForm(true)} className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-sm">+ Create Coupon</button>
        </div>
      ) : (
        <div className="space-y-4">
          {coupons.map(c => {
            const used = c.redemptions?.length || 0;
            const isValid = c.isActive && (!c.validUntil || new Date(c.validUntil) > new Date()) && (!c.maxUses || used < c.maxUses);
            return (
              <div key={c._id} className={`group bg-white p-6 rounded-2xl flex items-center justify-between border border-slate-200/40 hover:shadow-md transition-all duration-300 ${!isValid ? 'opacity-60 bg-slate-50/50' : 'shadow-sm'}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center border border-slate-100 font-extrabold shadow-sm ${isValid ? 'bg-indigo-50 text-indigo-600 border-indigo-100/20' : 'bg-slate-100 text-slate-400'}`}>
                    <span className="text-base">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-0.5">OFF</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-800 tracking-wider font-mono text-sm">{c.code}</span>
                      <button 
                        onClick={() => copyCode(c.code)} 
                        className="text-slate-400 hover:text-indigo-600 p-1 hover:bg-slate-50 rounded transition-all"
                      >
                        {copied === c.code ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">{c.description || 'Early Bird Campaign offering general savings'}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-slate-100/80 rounded text-[10px] font-bold text-slate-500">
                        {c.appliesTo === 'all_services' ? 'ALL SERVICES' : 'SELECTED'}
                      </span>
                      {c.validUntil && (
                        <span className="px-2 py-0.5 bg-amber-50 rounded text-[10px] font-bold text-amber-600 flex items-center gap-1">
                          <Clock size={10} /> Exp: {new Date(c.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12">
                  <div className="text-right flex flex-col items-end">
                    <p className="text-xs font-bold text-slate-700">{used} / {c.maxUses || '∞'} Uses</p>
                    {c.maxUses && (
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${Math.min((used / c.maxUses) * 100, 100)}%` }}></div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleCoupon(c._id, c.isActive)} 
                      title={c.isActive ? 'Deactivate' : 'Activate'}
                      className={`p-1.5 rounded-lg transition-colors ${c.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-green-600 hover:bg-green-50'}`}
                    >
                      <Power size={15} />
                    </button>
                    <button 
                      onClick={() => delCoupon(c._id)} 
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coupon Form Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Create New Coupon</h3>
                <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-all">
                  <X size={18} />
                </button>
              </div>

              <form className="space-y-4" onSubmit={e => { e.preventDefault(); save(); }}>
                <div>
                  <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Coupon Code *</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase().replace(/\s/g, '') }))} placeholder="e.g. SAVE20" className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm font-bold tracking-widest focus:ring-2 focus:ring-indigo-500/10 outline-none uppercase placeholder:font-normal placeholder:tracking-normal" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Type</label>
                    <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/10 outline-none">
                      <option value="percentage">% Percentage</option>
                      <option value="flat">₹ Flat Price</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Value *</label>
                    <input type="number" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} placeholder="20" className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/10 outline-none" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Max Uses</label>
                    <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="100" className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                  </div>
                  <div>
                    <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Per User</label>
                    <input type="number" value={form.perUserLimit} onChange={e => setForm(f => ({ ...f, perUserLimit: e.target.value }))} placeholder="1" className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xxs uppercase tracking-wider font-bold text-slate-400 block mb-1">Expiry Date</label>
                  <input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} className="w-full bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-indigo-500/10 outline-none" />
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" disabled={saving || !form.code || !form.discountValue} className="flex-1 bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-bold shadow-sm hover:bg-indigo-700 transition-all disabled:opacity-50">
                    {saving ? 'Creating...' : ' Create Coupon'}
                  </button>
                  <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 text-sm font-bold border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-all">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────
function OverviewTab({ profile, handle }) {
  const navigate = useNavigate();
  const totalMentees = profile?.totalMentees || 0;
  const rating = profile?.averageRating || 0;
  const earnings = profile?.totalEarnings || 0;
  const placements = profile?.totalPlacements || 0;

  return (
    <div className="space-y-10">
      
      {/* Hero Welcome Section */}
      <section className="mt-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs uppercase tracking-widest text-indigo-500 font-semibold">Navigator Status: Active</span>
          <h2 className="font-bold text-4xl text-slate-800 tracking-tight leading-tight">
            Welcome back, <span className="text-indigo-600">Strategic Guide.</span>
          </h2>
          <p className="text-slate-500 max-w-2xl leading-relaxed text-sm">Your mentorship ecosystem is thriving. Here's a snapshot of your professional impact and growth metrics.</p>
        </div>
      </section>

      {/* Stats Bento Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md border border-slate-200/40 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 rounded-xl bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
              <Users size={20} className="text-indigo-600" />
            </div>
          </div>
          <p className="text-xxs uppercase tracking-wider text-slate-400 mb-1 font-bold">Total Mentees</p>
          <h3 className="text-3xl font-extrabold text-slate-800">{totalMentees}</h3>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md border border-slate-200/40 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 rounded-xl bg-amber-50 group-hover:bg-amber-100 transition-colors">
              <Star size={20} className="text-amber-500" />
            </div>
          </div>
          <p className="text-xxs uppercase tracking-wider text-slate-400 mb-1 font-bold">Avg Rating</p>
          <h3 className="text-3xl font-extrabold text-slate-800">{rating > 0 ? rating.toFixed(1) : '—'}</h3>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md border border-slate-200/40 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors">
              <DollarSign size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-xxs uppercase tracking-wider text-slate-400 mb-1 font-bold">Total Earnings</p>
          <h3 className="text-3xl font-extrabold text-slate-800">₹{earnings.toLocaleString('en-IN')}</h3>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md border border-slate-200/40 group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors">
              <Award size={20} className="text-purple-600" />
            </div>
          </div>
          <p className="text-xxs uppercase tracking-wider text-slate-400 mb-1 font-bold">Total Placements</p>
          <h3 className="text-3xl font-extrabold text-slate-800">{placements}</h3>
        </div>
      </section>

      {/* Public Profile Banner */}
      {handle && (
        <section className="bg-gradient-to-br from-indigo-900 via-slate-800 to-indigo-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4">
              <h4 className="text-2xl font-bold">Your Gateway to Mentees</h4>
              <p className="text-indigo-200 max-w-md text-sm leading-relaxed">Share your unique mentor link on social media to attract new bookings and build your personal brand.</p>
              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div 
                  onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/mentor/${handle}`); alert('Link copied!'); }}
                  className="bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20 text-xs flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-all shadow-sm"
                >
                  <span className="text-white/60">skillpilot.app/mentor/</span><span className="font-bold text-white">{handle}</span>
                  <Copy size={13} className="ml-1 opacity-70" />
                </div>
              </div>
            </div>
            <div>
              <button onClick={() => navigate(`/mentor/${handle}`)} className="bg-white text-slate-900 px-6 py-3.5 rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 shadow-lg">
                <Eye size={18} /> View Public Profile
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Strategic Tips & Activity grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800">Strategic Tips</h3>
          </div>
          <div className="space-y-4">
            {[
              { type: 'Services', title: 'Boost Conversion', tip: 'Mentors who add at least 3 distinct offerings see a 40% higher booking rate.', act: 'Add Offerings' },
              { type: 'Coupons', title: 'Limited Time Coupons', tip: 'Using coupons during festive seasons helps clear pending inquiries triggers alerts.', act: 'Manage Coupons' },
            ].map(item => (
              <div key={item.title} className="bg-white p-5 rounded-2xl space-y-2 border-l-4 border-indigo-600 shadow-sm border border-slate-200/30">
                <p className="font-bold text-sm text-slate-800">{item.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.tip}</p>
                <button className="inline-block text-xxs font-bold text-indigo-600 uppercase tracking-wider hover:underline mt-1">{item.act} →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'services', label: 'Services', icon: Star },
  { key: 'inbox', label: 'DM Inbox', icon: Inbox },
  { key: 'coupons', label: 'Coupons', icon: Tag },
  { key: 'custom_sections', label: 'Custom Sections', icon: Type },
  { key: 'schedule', label: 'Schedule & Profile', icon: Calendar },
];



export default function MentorDashboardNew() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    if (t && ['overview', 'services', 'inbox', 'coupons', 'schedule'].includes(t)) {
      setTab(t);
    }
  }, []);

  useEffect(() => {
    // Load profile
    axios.get(`${API}/mentors/my-profile`, { headers: authHeader() })
      .then(r => { setProfile(r.data.profile || r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load unread DMs count
    axios.get(`${API}/dm/inbox/unread-count`, { headers: authHeader() })
      .then(r => setUnreadCount(r.data.unreadCount || 0))
      .catch(() => {});
  }, []);


  const handle = profile?.handle || user?.username?.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite' }} color={C.indigo} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-slate-50/50 font-sans">
      
      {/* Sidebar Navigation */}
      <aside className={`h-full bg-slate-50 border-r border-slate-200/50 z-30 flex flex-col flex-shrink-0 transition-all duration-300 overflow-y-auto ${
        sidebarExpanded ? 'w-64 flex' : 'w-0 overflow-hidden md:w-16 flex'
      }`}>
        <div className="flex flex-col h-full py-8 px-4">
          <div className="mb-10 px-4">
            <h1 className="font-bold text-slate-900 text-2xl tracking-tighter">SkillPilot</h1>
          </div>
          
          <div className="flex items-center gap-3 mb-8 px-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
              {profile?.profileImage || user?.imageUrl ? (
                <img src={profile?.profileImage || user?.imageUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm text-slate-900 truncate">{profile?.displayName || user?.name}</p>
              {handle && <p className="text-xs text-slate-500 truncate">@{handle}</p>}
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {TABS.map(t => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm ${
                    active 
                      ? 'bg-white shadow-sm border border-slate-200/40 text-indigo-600 font-bold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={active ? 'text-indigo-600' : 'text-slate-500'} />
                    <span>{t.label}</span>
                  </div>
                  {t.key === 'inbox' && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xxs font-extrabold px-2 py-0.5 rounded-full min-w-[20px] text-center">{unreadCount}</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200/60 space-y-1">
            <button onClick={() => navigate(`/mentor/${handle}`)} className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 transition-all font-medium text-sm">
              <Eye size={18} className="text-slate-400" /> View Public Profile
            </button>
            <button onClick={() => navigate('/become-a-mentor')} className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100/50 transition-all font-medium text-sm">
              <Settings size={18} className="text-slate-400" /> Edit Profile Setup
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content & Top Bar Area */}
      <div className="flex-1 flex flex-col min-h-full overflow-hidden">
        
        {/* Top App Bar Header */}
        <header className="h-16 z-20 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 border-b border-slate-200/20 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all flex items-center justify-center border border-slate-200/50 shadow-sm bg-white cursor-pointer" title="Toggle Sidebar">
              <Menu size={18} className="text-slate-600" />
            </button>
            <h2 className="text-md font-bold text-slate-800">
              {TABS.find(t => t.key === tab)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden lg:block">
              <div className="flex items-center bg-slate-100 rounded-full px-4 py-1.5 w-64 border border-slate-200/30">
                <Search size={16} className="text-slate-400" />
                <input className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 text-slate-800 placeholder-slate-400" placeholder="Search..." type="text"/>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-400">
              <button className="hover:text-slate-600 transition-colors">
                <Bell size={20} />
              </button>
              <button className="hover:text-slate-600 transition-colors">
                <HelpCircle size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <main className="flex-1 p-8 max-w-7xl w-full overflow-y-auto">
          {tab === 'overview' && <OverviewTab profile={profile} handle={handle} />}
          {tab === 'services' && <ServicesTab mentorId={user?._id || user?.id} />}
          {tab === 'inbox' && <DMInbox />}
          {tab === 'coupons' && <CouponsTab />}
          {tab === 'custom_sections' && <CustomSectionsTab />}

          {tab === 'schedule' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm max-w-xl">
              <p className="text-slate-600 text-sm">
                Use the full profile editor to update your bio, schedule, and social links.
              </p>
              <button onClick={() => navigate('/mentor-profile')} className="mt-4 bg-indigo-600 text-white rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-indigo-700 shadow-sm hover:shadow transition-all">
                Open Full Profile Editor →
              </button>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
