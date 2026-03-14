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
  DollarSign, Users, Award, X, GripVertical, Inbox, Type
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>My Services</h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: C.slate }}>{services.length} service{services.length !== 1 ? 's' : ''} created</p>
        </div>
        <button onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.indigo, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={15} /> Add Service
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: C.slate }}><Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite' }} /></div>
      ) : services.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: `2px dashed ${C.border}`, borderRadius: '16px' }}>
          <p style={{ fontSize: '32px', margin: '0 0 8px' }}>🎯</p>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: '0 0 4px' }}>No services yet</p>
          <p style={{ fontSize: '13px', color: C.slate, margin: '0 0 16px' }}>Add your first service to start accepting bookings.</p>
          <button onClick={openNew} style={{ background: C.indigo, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>+ Add Service</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {services.map(s => (
            <div key={s._id} style={{ background: '#fff', border: `1px solid ${s.isActive ? C.border : '#F1F5F9'}`, borderRadius: '14px', padding: '16px 18px', display: 'flex', gap: '14px', alignItems: 'center', opacity: s.isActive ? 1 : 0.6 }}>
              <div style={{ fontSize: '24px', flexShrink: 0 }}>{s.emoji || '🎯'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>{s.title}</span>
                  <Pill>{SERVICE_LABELS[s.serviceType] || s.serviceType}</Pill>
                  {!s.isActive && <Pill color="#94A3B8" bg="#F1F5F9">Inactive</Pill>}
                </div>
                <p style={{ margin: '3px 0 0', fontSize: '13px', color: C.slate }}>{s.description?.slice(0, 80)}{s.description?.length > 80 ? '…' : ''}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>{s.isFree ? <span style={{ color: C.green }}>Free</span> : `₹${s.price?.toLocaleString('en-IN')}`}</div>
                {s.duration && !ASYNC_TYPES.includes(s.serviceType) && <div style={{ fontSize: '11px', color: C.slate }}>{s.duration} min</div>}
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button onClick={() => openEdit(s)} title="Edit" style={{ background: C.bg, border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}><Edit2 size={13} color={C.indigo} /></button>
                <button onClick={() => toggle(s._id)} title={s.isActive ? 'Deactivate' : 'Activate'} style={{ background: s.isActive ? '#FEF3C7' : '#ECFDF5', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}><Power size={13} color={s.isActive ? '#D97706' : C.green} /></button>
                <button onClick={() => del(s._id)} title="Delete" style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}><Trash2 size={13} color={C.red} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Form Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#1E293B' }}>{editSvc ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Service Type</label>
            <select value={form.serviceType} onChange={e => setForm(f => ({ ...f, serviceType: e.target.value }))} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', marginBottom: '14px', outline: 'none' }}>
              {Object.entries(SERVICE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>

            <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: '0 10px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Emoji</label>
                <input value={form.emoji} onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))} placeholder="🎯" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 10px', fontSize: '18px', marginBottom: '14px', outline: 'none', boxSizing: 'border-box', textAlign: 'center' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Title *</label>
                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Mock Interview – DSA + System Design" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', marginBottom: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="What will mentees get?" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', marginBottom: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} />

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px', fontSize: '13px', fontWeight: 600, color: C.slate }}>
              <input type="checkbox" checked={form.isFree} onChange={e => setForm(f => ({ ...f, isFree: e.target.checked }))} style={{ accentColor: C.green }} />
              This service is FREE
            </label>

            {!form.isFree && (
              <>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Price (₹)</label>
                <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="999" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', marginBottom: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </>
            )}

            {!isAsync ? (
              <>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Duration</label>
                <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', marginBottom: '14px', outline: 'none' }}>
                  {[15, 30, 45, 60, 75, 90, 120].map(d => <option key={d} value={d}>{d} minutes</option>)}
                </select>
              </>
            ) : (
              <>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Response Time</label>
                <select value={form.responseTime} onChange={e => setForm(f => ({ ...f, responseTime: e.target.value }))} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', marginBottom: '14px', outline: 'none' }}>
                  {['Within 12 hours', 'Within 24 hours', 'Within 48 hours', 'Within 72 hours', 'Within 1 week'].map(r => <option key={r}>{r}</option>)}
                </select>
              </>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button onClick={save} disabled={saving} style={{ flex: 1, background: C.indigo, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}>
                {saving ? 'Saving…' : editSvc ? 'Update Service' : 'Add Service'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: '#F1F5F9', color: C.slate, border: 'none', borderRadius: '12px', padding: '12px 18px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>Discount Coupons</h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: C.slate }}>Create coupons mentees can apply at checkout</p>
        </div>
        <button onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.indigo, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
          <Plus size={15} /> New Coupon
        </button>
      </div>

      {/* URL auto-apply tip */}
      <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#1E40AF' }}>
        💡 <strong>Tip:</strong> Share profile links with auto-applied coupons: <code style={{ background: '#DBEAFE', borderRadius: '4px', padding: '1px 6px' }}>skillpilot.app/mentor/handle?coupon_code=YOURCODE</code>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} color={C.indigo} /></div>
      ) : coupons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: `2px dashed ${C.border}`, borderRadius: '16px' }}>
          <p style={{ fontSize: '32px', margin: '0 0 8px' }}>🎟️</p>
          <p style={{ fontSize: '15px', fontWeight: 700, color: '#1E293B', margin: '0 0 4px' }}>No coupons yet</p>
          <p style={{ fontSize: '13px', color: C.slate, margin: '0 0 16px' }}>Create a coupon to offer discounts to your mentees.</p>
          <button onClick={() => setShowForm(true)} style={{ background: C.indigo, color: '#fff', border: 'none', borderRadius: '10px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>+ Create Coupon</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {coupons.map(c => {
            const used = c.redemptions?.length || 0;
            const isValid = c.isActive && (!c.validUntil || new Date(c.validUntil) > new Date()) && (!c.maxUses || used < c.maxUses);
            return (
              <div key={c._id} style={{ background: '#fff', border: `1px solid ${isValid ? C.border : '#F1F5F9'}`, borderRadius: '14px', padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px', opacity: isValid ? 1 : 0.6 }}>
                <div style={{ background: isValid ? '#ECFDF5' : '#F1F5F9', borderRadius: '12px', padding: '10px 16px', fontFamily: 'monospace', fontWeight: 800, fontSize: '16px', color: isValid ? '#065F46' : '#94A3B8', letterSpacing: '1px' }}>
                  {c.code}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '15px', color: '#1E293B' }}>
                      {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                    </span>
                    <Pill color={isValid ? C.green : C.slate} bg={isValid ? '#ECFDF5' : '#F1F5F9'}>{isValid ? 'Active' : 'Inactive'}</Pill>
                    <Pill color="#7C3AED" bg="#F5F3FF">{c.appliesTo === 'all_services' ? 'All Services' : 'Selected'}</Pill>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '12px', color: C.slate }}>
                    <span>👥 {used}/{c.maxUses || '∞'} used</span>
                    <span>👤 {c.perUserLimit}/person</span>
                    {c.validUntil && <span>⏳ Expires {new Date(c.validUntil).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => copyCode(c.code)} title="Copy code" style={{ background: C.bg, border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                    {copied === c.code ? <Check size={13} color={C.green} /> : <Copy size={13} color={C.indigo} />}
                  </button>
                  <button onClick={() => toggleCoupon(c._id, c.isActive)} title={c.isActive ? 'Deactivate' : 'Activate'} style={{ background: c.isActive ? '#FEF3C7' : '#ECFDF5', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                    <Power size={13} color={c.isActive ? '#D97706' : C.green} />
                  </button>
                  <button onClick={() => delCoupon(c._id)} style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer' }}>
                    <Trash2 size={13} color={C.red} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Coupon Form Modal */}
      {showForm && (
        <div onClick={() => setShowForm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '460px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 800, color: '#1E293B' }}>Create Coupon</h3>
              <button onClick={() => setShowForm(false)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={16} /></button>
            </div>

            {[
              { label: 'Coupon Code *', key: 'code', placeholder: 'e.g. SAVE20', onChange: v => v.toUpperCase().replace(/\s/g, '') },
            ].map(({ label, key, placeholder, onChange }) => (
              <div key={key} style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>{label}</label>
                <input value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: onChange ? onChange(e.target.value) : e.target.value }))} placeholder={placeholder} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1px' }} />
              </div>
            ))}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Discount Type</label>
                <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', outline: 'none' }}>
                  <option value="percentage">% Percentage</option>
                  <option value="flat">₹ Flat Amount</option>
                </select>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Discount Value *</label>
                <input type="number" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} placeholder={form.discountType === 'percentage' ? '10' : '100'} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Max Uses (blank = unlimited)</label>
                <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))} placeholder="100" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Per User Limit</label>
                <input type="number" value={form.perUserLimit} onChange={e => setForm(f => ({ ...f, perUserLimit: e.target.value }))} placeholder="1" min="1" style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: C.slate, display: 'block', marginBottom: '6px' }}>Expires On (leave blank = no expiry)</label>
              <input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '9px 12px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={save} disabled={saving || !form.code || !form.discountValue} style={{ flex: 1, background: C.indigo, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 700, cursor: 'pointer', opacity: saving || !form.code ? 0.7 : 1 }}>
                {saving ? 'Creating…' : '🎟️ Create Coupon'}
              </button>
              <button onClick={() => setShowForm(false)} style={{ background: '#F1F5F9', color: C.slate, border: 'none', borderRadius: '12px', padding: '12px 18px', cursor: 'pointer' }}>Cancel</button>
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
  const totalServices = profile?.totalServices || 0;
  const totalMentees = profile?.totalMentees || 0;
  const rating = profile?.averageRating || 0;
  const earnings = profile?.totalEarnings || 0;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <StatCard icon={<Users size={18} color={C.indigo} />} label="Total Mentees" value={totalMentees} sub="all time" />
        <StatCard icon={<Star size={18} color="#F59E0B" />} label="Avg Rating" value={rating > 0 ? rating.toFixed(1) : '—'} sub={`${profile?.totalReviews || 0} reviews`} color="#F59E0B" />
        <StatCard icon={<DollarSign size={18} color={C.green} />} label="Total Earnings" value={`₹${earnings.toLocaleString('en-IN')}`} sub="all time" color={C.green} />
        <StatCard icon={<Award size={18} color="#7C3AED" />} label="Total Placements" value={profile?.totalPlacements || 0} sub="mentees placed" color="#7C3AED" />
      </div>

      {/* Profile link */}
      {handle && (
        <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '16px', padding: '20px 24px', marginBottom: '20px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 600, opacity: 0.8 }}>YOUR PUBLIC PROFILE</p>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>skillpilot.app/mentor/{handle}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/mentor/${handle}`); }} style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '10px', padding: '8px 14px', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
              📋 Copy
            </button>
            <button onClick={() => navigate(`/mentor/${handle}`)} style={{ background: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', color: C.indigo, cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
              <ExternalLink size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />View
            </button>
          </div>
        </div>
      )}

      {/* Quick tips */}
      <div style={{ background: '#FAFBFF', border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>💡 Quick Tips</h3>
        {[
          ['Services', 'Add diverse services (1:1, async, group) to attract more mentees'],
          ['Coupons', 'Create a giveaway coupon and share it on LinkedIn for free leads'],
          ['Profile URL', 'Add ?coupon_code=YOURCODE to auto-apply discounts from any link'],
          ['Custom Sections', 'Add a "Success Stories" section to build trust with mentees'],
        ].map(([title, tip]) => (
          <div key={title} style={{ display: 'flex', gap: '10px', marginBottom: '10px', padding: '10px 12px', background: '#fff', borderRadius: '10px', border: `1px solid ${C.border}` }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: C.indigo, background: C.bg, borderRadius: '6px', padding: '2px 8px', height: 'fit-content', whiteSpace: 'nowrap' }}>{title}</span>
            <span style={{ fontSize: '13px', color: C.slate }}>{tip}</span>
          </div>
        ))}
      </div>
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
    // Load profile
    axios.get(`${API}/mentor/profile`, { headers: authHeader() })
      .then(r => { setProfile(r.data.profile || r.data); })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load unread DMs count
    axios.get(`${API}/dm/inbox/unread-count`, { headers: authHeader() })
      .then(r => setUnreadCount(r.data.unreadCount || 0))
      .catch(() => {});
  }, []);


  const handle = profile?.handle || user?.username?.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite' }} color={C.indigo} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif' }}>

      {/* Sidebar */}
      <div style={{ width: '220px', background: '#fff', borderRight: `1px solid ${C.border}`, padding: '24px 16px', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>
        {/* Mentor avatar */}
        <div style={{ textAlign: 'center', marginBottom: '24px', padding: '16px 0', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 800, overflow: 'hidden' }}>
            {profile?.profileImage || user?.imageUrl ? <img src={profile?.profileImage || user?.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.name?.[0]?.toUpperCase()}
          </div>
          <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>{profile?.displayName || user?.name}</p>
          {handle && <p style={{ margin: 0, fontSize: '11px', color: C.slate }}>@{handle}</p>}
        </div>

        {/* Nav tabs */}
        {TABS.map(t => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', marginBottom: '4px', background: active ? C.bg : 'transparent', color: active ? C.indigo : '#475569', fontWeight: active ? 700 : 500, fontSize: '14px', transition: 'all 0.15s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={16} /> {t.label}
              </div>
              {t.key === 'inbox' && unreadCount > 0 && (
                <span style={{ background: '#EF4444', color: '#fff', borderRadius: '20px', padding: '2px 6px', fontSize: '10px', fontWeight: 800 }}>{unreadCount}</span>
              )}
            </button>
          );
        })}


        <div style={{ borderTop: `1px solid ${C.border}`, marginTop: '16px', paddingTop: '16px' }}>
          <button onClick={() => navigate(`/mentor/${handle}`)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'transparent', color: C.slate, fontSize: '13px', fontWeight: 500 }}>
            <Eye size={15} /> View Public Profile
          </button>
          <button onClick={() => navigate('/become-a-mentor')} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'transparent', color: C.slate, fontSize: '13px', fontWeight: 500 }}>
            <Settings size={15} /> Edit Profile Setup
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '32px', maxWidth: '900px' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: 800, color: '#1E293B' }}>
            {TABS.find(t => t.key === tab)?.label}
          </h1>
          <p style={{ margin: 0, fontSize: '13px', color: C.slate }}>
            {tab === 'overview' && 'Your mentor dashboard at a glance'}
            {tab === 'services' && 'Manage what you offer to mentees'}
            {tab === 'coupons' && 'Create and track discount coupons'}
            {tab === 'schedule' && 'Update your profile and availability'}
          </p>
        </div>

        {tab === 'overview' && <OverviewTab profile={profile} handle={handle} />}
        {tab === 'services' && <ServicesTab mentorId={user?._id || user?.id} />}
        {tab === 'inbox' && <DMInbox />}
        {tab === 'coupons' && <CouponsTab />}
        {tab === 'custom_sections' && <CustomSectionsTab />}

        {tab === 'schedule' && (
          <div style={{ background: '#fff', borderRadius: '16px', border: `1px solid ${C.border}`, padding: '24px' }}>
            <p style={{ color: C.slate, fontSize: '14px' }}>
              Use the full profile editor to update your bio, schedule, and social links.
            </p>
            <button onClick={() => navigate('/mentor-profile')} style={{ marginTop: '12px', background: C.indigo, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
              Open Full Profile Editor →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
