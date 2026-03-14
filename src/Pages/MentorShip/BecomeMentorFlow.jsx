/**
 * BecomeMentorFlow.jsx
 * A 5-step onboarding wizard for users who want to become a mentor.
 * Steps: Profile → Expertise → Services → Availability → Review & Submit
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';
import axios from 'axios';
import config from '../../config';
import {
  CheckCircle, ChevronRight, ChevronLeft, Plus, X, 
  User, Briefcase, Star, Calendar, Eye, Upload, Loader2
} from 'lucide-react';

const API = config.API_BASE_URL;

// ─── Style constants ────────────────────────────────────────────────────────────
const C = {
  indigo: '#4F46E5',
  indigoBg: '#EEF2FF',
  violet: '#7C3AED',
  green: '#059669',
  slate: '#64748B',
  border: '#E2E8F0',
  radius: '14px',
};

const Inp = ({ label, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>{label}</label>}
    <input {...props} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1E293B', outline: 'none', boxSizing: 'border-box', ...props.style }} />
  </div>
);

const Txt = ({ label, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>{label}</label>}
    <textarea {...props} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1E293B', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', ...props.style }} />
  </div>
);

const Sel = ({ label, children, ...props }) => (
  <div style={{ marginBottom: '16px' }}>
    {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>{label}</label>}
    <select {...props} style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '10px 14px', fontSize: '14px', color: '#1E293B', outline: 'none', background: '#fff', boxSizing: 'border-box' }}>
      {children}
    </select>
  </div>
);

const TagInput = ({ label, tags, onChange, placeholder }) => {
  const [val, setVal] = useState('');
  const add = () => { const t = val.trim(); if (t && !tags.includes(t)) onChange([...tags, t]); setVal(''); };
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} placeholder={placeholder} style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '8px 12px', fontSize: '13px', outline: 'none' }} />
        <button type="button" onClick={add} style={{ background: C.indigo, color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontWeight: 600 }}><Plus size={15} /></button>
      </div>
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {tags.map(t => (
          <span key={t} style={{ background: C.indigoBg, color: C.indigo, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            {t} <button type="button" onClick={() => onChange(tags.filter(x => x !== t))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.indigo, padding: 0, lineHeight: 1 }}>×</button>
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Steps config ───────────────────────────────────────────────────────────────
const STEPS = [
  { icon: User, title: 'Basic Profile', desc: 'Who are you?' },
  { icon: Briefcase, title: 'Expertise', desc: 'What you know' },
  { icon: Star, title: 'First Service', desc: 'What you offer' },
  { icon: Calendar, title: 'Availability', desc: 'When you\'re free' },
  { icon: Eye, title: 'Review & Submit', desc: 'Preview & go live' },
];

const SERVICE_TYPES = [
  { value: 'one_on_one', label: '🎥 1:1 Session' },
  { value: 'quick_chat', label: '⚡ Quick Chat' },
  { value: 'mock_interview', label: '🎯 Mock Interview' },
  { value: 'career_guidance', label: '🧭 Career Guidance' },
  { value: 'discovery_call', label: '🌱 Discovery Call' },
  { value: 'priority_dm', label: '💬 Priority DM' },
  { value: 'resume_review', label: '📄 Resume Review' },
  { value: 'portfolio_review', label: '🖼️ Portfolio Review' },
  { value: 'referral', label: '🤝 Referral' },
  { value: 'course', label: '📚 Course' },
  { value: 'workshop', label: '👥 Workshop' },
  { value: 'coaching_series', label: '🗓️ Coaching Series' },
  { value: 'ama', label: '🙋 Ask Me Anything' },
];

const ASYNC_TYPES = ['priority_dm', 'resume_review', 'portfolio_review', 'ama', 'referral', 'course'];
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ─── Initial form state ─────────────────────────────────────────────────────────
const initForm = () => ({
  // Step 1 — Basic
  displayName: '',
  handle: '',
  tagline: '',
  bio: '',
  city: '',
  country: 'India',
  profileImage: '',
  languages: ['English'],
  jobTitle: '',
  company: '',
  yearsExp: '',
  linkedIn: '',
  github: '',
  twitter: '',
  portfolio: '',

  // Step 2 — Expertise
  expertise: [],
  targetingDomains: [],
  searchTags: [],
  menteeType: ['Student', 'Fresher'],
  referralsAvailable: false,
  topCompanies: [],

  // Step 3 — First Service
  service: {
    serviceType: 'one_on_one',
    title: '',
    description: '',
    emoji: '',
    price: '',
    isFree: false,
    duration: 60,
    responseTime: '48 hours',
    includes: [],
  },

  // Step 4 — Availability
  slots: [
    { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: true },
    { day: 'Sunday', startTime: '10:00', endTime: '14:00', isAvailable: true },
  ],
});

// ─── Step Components ────────────────────────────────────────────────────────────

function Step1({ form, set }) {
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
        <Inp label="Full Name *" value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="Rahul Verma" />
        <Inp label="Handle / Username *" value={form.handle} onChange={e => set('handle', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} placeholder="rahul_verma" />
        <Inp label="Job Title *" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="SDE-3 at Google" />
        <Inp label="Current Company" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Google" />
        <Inp label="City *" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Bangalore" />
        <Inp label="Years of Experience *" type="number" value={form.yearsExp} onChange={e => set('yearsExp', e.target.value)} placeholder="5" />
      </div>
      <Inp label="🔗 Profile Tagline *" value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="🚀 Crack your FAANG interview | Ex-Amazon | 5 Years SDE" />
      <Txt label="About Me / Bio *" value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Tell mentees who you are, what you've built, and how you can help them..." rows={5} />
      <div style={{ background: '#FAFBFF', borderRadius: C.radius, padding: '16px', marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: '#475569', margin: '0 0 12px' }}>Social Links</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Inp label="LinkedIn URL" value={form.linkedIn} onChange={e => set('linkedIn', e.target.value)} placeholder="https://linkedin.com/in/yourprofile" />
          <Inp label="GitHub URL" value={form.github} onChange={e => set('github', e.target.value)} placeholder="https://github.com/yourusername" />
          <Inp label="Twitter URL" value={form.twitter} onChange={e => set('twitter', e.target.value)} placeholder="https://twitter.com/handle" />
          <Inp label="Portfolio / Website" value={form.portfolio} onChange={e => set('portfolio', e.target.value)} placeholder="https://yoursite.com" />
        </div>
      </div>
      <TagInput label="Languages you speak" tags={form.languages} onChange={v => set('languages', v)} placeholder="Hindi, Telugu…" />
    </div>
  );
}

function Step2({ form, set }) {
  const DOMAIN_OPTIONS = ['Computer Science', 'Software Engineering', 'Data Science', 'AI/ML', 'Design', 'Product Management', 'DevOps', 'Cybersecurity', 'Finance', 'Marketing', 'Mechanical', 'Electrical', 'Civil', 'Biotech', 'Management'];
  return (
    <div>
      <TagInput label="Skills & Expertise * (press Enter to add)" tags={form.expertise} onChange={v => set('expertise', v)} placeholder="React, Python, System Design…" />
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Target Domains *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {DOMAIN_OPTIONS.map(d => (
            <button type="button" key={d} onClick={() => {
              const cur = form.targetingDomains;
              set('targetingDomains', cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d]);
            }} style={{ padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', border: '2px solid', borderColor: form.targetingDomains.includes(d) ? C.indigo : C.border, background: form.targetingDomains.includes(d) ? C.indigoBg : '#fff', color: form.targetingDomains.includes(d) ? C.indigo : '#64748B', transition: 'all 0.15s' }}>
              {d}
            </button>
          ))}
        </div>
      </div>
      <TagInput label="Search Tags (optional, help mentees find you)" tags={form.searchTags} onChange={v => set('searchTags', v)} placeholder="algorithms, react, career switch…" />
      <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: C.radius, padding: '16px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '12px' }}>
          <input type="checkbox" checked={form.referralsAvailable} onChange={e => set('referralsAvailable', e.target.checked)} style={{ width: '16px', height: '16px', accentColor: C.indigo }} />
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#92400E' }}>🤝 I can refer to top companies</span>
        </label>
        {form.referralsAvailable && (
          <TagInput label="Companies you can refer to" tags={form.topCompanies} onChange={v => set('topCompanies', v)} placeholder="Google, Amazon, Microsoft…" />
        )}
      </div>
    </div>
  );
}

function Step3({ form, set }) {
  const svc = form.service;
  const isSvc = k => set('service', { ...svc, [k]: arguments[1] });
  const setSvc = (k, v) => set('service', { ...svc, [k]: v });
  const isAsync = ASYNC_TYPES.includes(svc.serviceType);

  return (
    <div>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>Add your first service. You can add more from your dashboard later.</p>
      <Sel label="Service Type *" value={svc.serviceType} onChange={e => setSvc('serviceType', e.target.value)}>
        {SERVICE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
      </Sel>
      <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: '0 12px' }}>
        <Inp label="Emoji" value={svc.emoji} onChange={e => setSvc('emoji', e.target.value)} placeholder="🎯" />
        <Inp label="Service Title *" value={svc.title} onChange={e => setSvc('title', e.target.value)} placeholder="Full Mock Interview (DSA + System Design)" />
      </div>
      <Txt label="Description *" value={svc.description} onChange={e => setSvc('description', e.target.value)} placeholder="What will the mentee get from this session? Be specific about deliverables." rows={3} />
      <div style={{ display: 'grid', gridTemplateColumns: isAsync ? '1fr' : '1fr 1fr', gap: '0 12px' }}>
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px', cursor: 'pointer' }}>
            <input type="checkbox" checked={svc.isFree} onChange={e => setSvc('isFree', e.target.checked)} style={{ accentColor: C.green }} />
            This service is FREE
          </label>
          {!svc.isFree && <Inp label="Price (₹) *" type="number" value={svc.price} onChange={e => setSvc('price', e.target.value)} placeholder="999" />}
        </div>
        {!isAsync && (
          <Sel label="Duration (minutes)" value={svc.duration} onChange={e => setSvc('duration', Number(e.target.value))}>
            {[15, 30, 45, 60, 75, 90, 120].map(d => <option key={d} value={d}>{d} min</option>)}
          </Sel>
        )}
        {isAsync && (
          <Sel label="Response Time" value={svc.responseTime} onChange={e => setSvc('responseTime', e.target.value)}>
            {['Within 12 hours', 'Within 24 hours', 'Within 48 hours', 'Within 72 hours', 'Within 1 week'].map(r => <option key={r} value={r}>{r}</option>)}
          </Sel>
        )}
      </div>
      <TagInput label="What's Included (e.g. Recorded session, PDF notes)" tags={svc.includes} onChange={v => setSvc('includes', v)} placeholder="Add a feature…" />
    </div>
  );
}

function Step4({ form, set }) {
  const toggleSlot = (day) => {
    const exists = form.slots.find(s => s.day === day);
    if (exists) set('slots', form.slots.filter(s => s.day !== day));
    else set('slots', [...form.slots, { day, startTime: '18:00', endTime: '21:00', isAvailable: true }]);
  };
  const updateSlot = (day, key, val) => {
    set('slots', form.slots.map(s => s.day === day ? { ...s, [key]: val } : s));
  };

  return (
    <div>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>Select the days and times you're available for live sessions.</p>
      {DAYS.map(day => {
        const slot = form.slots.find(s => s.day === day);
        const active = !!slot;
        return (
          <div key={day} style={{ border: `2px solid ${active ? C.indigo : C.border}`, borderRadius: '12px', padding: '12px 16px', marginBottom: '10px', background: active ? C.indigoBg : '#fff', transition: 'all 0.15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input type="checkbox" checked={active} onChange={() => toggleSlot(day)} style={{ width: '16px', height: '16px', accentColor: C.indigo, cursor: 'pointer' }} />
              <span style={{ fontSize: '14px', fontWeight: active ? 700 : 500, color: active ? C.indigo : '#64748B', flex: 1 }}>{day}</span>
              {active && (
                <>
                  <input type="time" value={slot.startTime} onChange={e => updateSlot(day, 'startTime', e.target.value)} style={{ border: `1px solid ${C.border}`, borderRadius: '8px', padding: '4px 8px', fontSize: '13px', outline: 'none' }} />
                  <span style={{ color: '#94A3B8', fontSize: '13px' }}>to</span>
                  <input type="time" value={slot.endTime} onChange={e => updateSlot(day, 'endTime', e.target.value)} style={{ border: `1px solid ${C.border}`, borderRadius: '8px', padding: '4px 8px', fontSize: '13px', outline: 'none' }} />
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Step5({ form }) {
  const svc = form.service;
  return (
    <div>
      {/* Profile preview card */}
      <div style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', borderRadius: '16px', padding: '24px', color: '#fff', marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: 800 }}>{form.displayName || 'Your Name'}</h2>
        {form.handle && <div style={{ fontSize: '13px', opacity: 0.75 }}>@{form.handle}</div>}
        {form.tagline && <p style={{ margin: '8px 0 0', fontSize: '14px', opacity: 0.9 }}>{form.tagline}</p>}
        {form.jobTitle && <p style={{ margin: '4px 0 0', fontSize: '13px', opacity: 0.8 }}>{form.jobTitle}{form.company ? ` @ ${form.company}` : ''}</p>}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px' }}>
          {form.expertise.slice(0, 4).map(t => <span key={t} style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>{t}</span>)}
        </div>
      </div>

      {/* Service preview */}
      {svc.title && (
        <div style={{ border: '1px solid #E8ECF4', borderRadius: '14px', padding: '16px', marginBottom: '16px' }}>
          <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Your First Service</p>
          <h3 style={{ margin: '0 0 4px', fontSize: '15px', fontWeight: 700, color: '#1E293B' }}>{svc.emoji} {svc.title}</h3>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 8px' }}>{svc.description}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>{svc.isFree ? <span style={{ color: '#059669' }}>Free</span> : `₹${svc.price}`}</span>
            {!ASYNC_TYPES.includes(svc.serviceType) && <span style={{ fontSize: '13px', color: '#94A3B8' }}>⏱ {svc.duration} min</span>}
          </div>
        </div>
      )}

      {/* Availability */}
      {form.slots.length > 0 && (
        <div style={{ background: '#FAFBFF', borderRadius: '14px', padding: '16px' }}>
          <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 700, color: '#475569' }}>📅 Available Days</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {form.slots.map(s => <span key={s.day} style={{ background: '#EEF2FF', color: '#4F46E5', borderRadius: '8px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>{s.day} {s.startTime}–{s.endTime}</span>)}
          </div>
        </div>
      )}

      <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '12px', padding: '14px', marginTop: '16px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#065F46' }}>
          ✅ Your profile will be <strong>visible immediately</strong> after submission. You can add more services, coupons, and custom content from your mentor dashboard.
        </p>
      </div>
    </div>
  );
}

// ─── Main Wizard ────────────────────────────────────────────────────────────────

// ─── Test autocomplete data ────────────────────────────────────────────────────
const TEST_DATA = {
  displayName: 'Alex Johnson',
  handle: 'alex_johnson',
  tagline: '🚀 Full Stack Engineer | Ex-Flipkart | Helping you land your dream job',
  bio: 'Hi! I am Alex, a Full Stack Engineer with 6 years of experience in React, Node.js and system design.\n\nI have helped 100+ engineers crack top product companies. I specialise in:\n• DSA & Problem Solving\n• System Design (LLD + HLD)\n• Resume & Interview Prep\n• Referrals at top startups',
  city: 'Bangalore',
  country: 'India',
  jobTitle: 'Senior Software Engineer',
  company: 'Flipkart',
  yearsExp: '6',
  linkedIn: 'https://linkedin.com/in/alexjohnson',
  github: 'https://github.com/alexjohnson',
  twitter: 'https://twitter.com/alexjohnson',
  portfolio: 'https://alexjohnson.dev',
  languages: ['English', 'Hindi'],
  expertise: ['React', 'Node.js', 'System Design', 'DSA', 'TypeScript'],
  targetingDomains: ['Computer Science', 'Software Engineering', 'Data Science'],
  searchTags: ['react', 'node', 'system design', 'dsa', 'javascript'],
  menteeType: ['Student', 'Fresher'],
  referralsAvailable: true,
  topCompanies: ['Flipkart', 'Amazon', 'Swiggy'],
  service: {
    serviceType: 'mock_interview',
    title: 'Full Mock Interview (DSA + System Design)',
    description: 'A complete 75-min mock interview simulating the real FAANG/startup process with detailed written feedback on your performance.',
    emoji: '🎯',
    price: '1299',
    isFree: false,
    duration: 75,
    responseTime: 'Within 48 hours',
    includes: ['DSA coding round', 'System Design discussion', 'Detailed feedback PDF', 'Improvement roadmap'],
  },
  slots: [
    { day: 'Monday', startTime: '19:00', endTime: '22:00', isAvailable: true },
    { day: 'Wednesday', startTime: '19:00', endTime: '22:00', isAvailable: true },
    { day: 'Saturday', startTime: '10:00', endTime: '14:00', isAvailable: true },
    { day: 'Sunday', startTime: '10:00', endTime: '14:00', isAvailable: true },
  ],
};

export default function BecomeMentorFlow() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Auto-fill from logged-in user on mount
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        displayName: user.name || f.displayName,
        handle: (user.username || user.name || '')
          .toLowerCase().replace(/[^a-z0-9_]/g, '_').replace(/__+/g, '_').slice(0, 40),
        jobTitle: user.jobTitle || f.jobTitle,
        company: user.company || f.company,
        city: user.city || f.city,
        linkedIn: user.socialLinks?.linkedIn || f.linkedIn,
        github: user.socialLinks?.github || f.github,
        twitter: user.socialLinks?.twitter || f.twitter,
        portfolio: user.socialLinks?.portfolio || f.portfolio,
      }));
    }
  }, [user]);

  const fillTestData = () => {
    setForm(f => ({ ...initForm(), ...TEST_DATA }));
    setError('');
  };

  const validate = () => {
    if (step === 0) {
      if (!form.displayName.trim()) return 'Please enter your full name.';
      if (!form.handle.trim()) return 'Please enter a profile handle (e.g. john_doe).';
      if (!/^[a-z0-9_]+$/.test(form.handle)) return 'Handle can only contain lowercase letters, numbers and underscores.';
      if (!form.tagline.trim()) return 'A tagline helps mentees know what you do!';
      if (!form.bio.trim()) return 'Please write a short bio.';
      if (!form.city.trim()) return 'Please enter your city.';
      if (!form.jobTitle.trim()) return 'Please enter your job title.';
    }
    if (step === 1) {
      if (form.expertise.length === 0) return 'Add at least one skill/expertise.';
      if (form.targetingDomains.length === 0) return 'Select at least one target domain.';
    }
    if (step === 2) {
      if (!form.service.title.trim()) return 'Please add a service title.';
      if (!form.service.description.trim()) return 'Please describe the service.';
      if (!form.service.isFree && !form.service.price) return 'Please set a price (or mark as free).';
    }
    if (step === 3) {
      if (form.slots.length === 0) return 'Please select at least one availability slot.';
    }
    return null;
  };

  const next = () => {
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep(s => s + 1);
  };

  const prev = () => { setError(''); setStep(s => s - 1); };

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Create/update mentor profile
      await axios.post(`${API}/mentor/register`, {
        displayName: form.displayName,
        handle: form.handle,
        tagline: form.tagline,
        bio: form.bio,
        location: { city: form.city, country: form.country },
        expertise: form.expertise,
        targetingDomains: form.targetingDomains,
        searchTags: form.searchTags,
        preferredMenteeType: form.menteeType,
        languages: form.languages,
        jobTitle: form.jobTitle,
        company: form.company,
        yearsExperience: form.yearsExp,
        socialLinks: { linkedIn: form.linkedIn, github: form.github, twitter: form.twitter, portfolio: form.portfolio },
        referralsInTopCompanies: form.referralsAvailable,
        topCompanies: form.topCompanies,
        availabilitySlots: form.slots,
        isVisible: true,
      }, { headers });

      // 2. Create first service
      if (form.service.title) {
        await axios.post(`${API}/mentor/services`, {
          ...form.service,
          price: form.service.isFree ? 0 : Number(form.service.price),
        }, { headers });
      }

      setDone(true);
    } catch (e) {
      setError(e.response?.data?.error || 'Submission failed. Please try again.');
    }
    setSubmitting(false);
  };

  // ── Success screen (application submitted — pending approval) ──
  if (done) return (
    <div style={{ maxWidth: '560px', margin: '80px auto', padding: '24px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '80px', height: '80px', background: '#FEF3C7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
        <span style={{ fontSize: '36px' }}>⏳</span>
      </div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1E293B', margin: '0 0 8px' }}>Application Submitted! 🎉</h1>
      <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>
        Your mentor application is <strong>under review</strong>. Our admin team will approve or reject it shortly.
      </p>
      <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '28px' }}>
        You'll be notified once it's reviewed. In the meantime, you can preview how your profile will look.
      </p>

      {/* Status indicator */}
      <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '12px 16px', marginBottom: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706', animation: 'pulse 1.5s infinite' }} />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#92400E' }}>Pending Admin Approval</span>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => navigate(`/mentor/${form.handle}`)} style={{ background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
          👁️ Preview My Profile
        </button>
        <button onClick={() => navigate('/')} style={{ background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
          Go to Home
        </button>
      </div>
    </div>
  );


  const StepIcon = STEPS[step].icon;

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '32px 16px', fontFamily: 'Inter, sans-serif' }}>

      {/* 🧪 DEV: Test autocomplete banner */}
      <div style={{ background: 'linear-gradient(90deg, #FEF3C7, #FDE68A)', border: '1px solid #F59E0B', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>🧪</span>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#92400E' }}>Dev Mode — Test Autocomplete</p>
            <p style={{ margin: 0, fontSize: '12px', color: '#78350F' }}>Click to fill ALL fields across every step instantly</p>
          </div>
        </div>
        <button onClick={fillTestData} style={{ background: '#F59E0B', color: '#fff', border: 'none', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          ⚡ Fill All Fields
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '0', marginBottom: '12px' }}>
          {STEPS.map((s, i) => {
            const done = i < step;
            const active = i === step;
            const Icon = s.icon;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                {i > 0 && <div style={{ position: 'absolute', top: '18px', left: '-50%', right: '50%', height: '2px', background: done ? C.indigo : C.border, zIndex: 0 }} />}
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: done ? C.indigo : active ? '#fff' : '#F1F5F9', border: `2px solid ${active ? C.indigo : done ? C.indigo : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, transition: 'all 0.2s' }}>
                  {done ? <CheckCircle size={16} color="#fff" /> : <Icon size={15} color={active ? C.indigo : '#94A3B8'} />}
                </div>
                <span style={{ fontSize: '11px', fontWeight: active ? 700 : 500, color: active ? C.indigo : '#94A3B8', marginTop: '4px', textAlign: 'center', maxWidth: '70px' }}>{s.title}</span>
              </div>
            );
          })}
        </div>
        <div style={{ background: '#F1F5F9', borderRadius: '4px', height: '4px', overflow: 'hidden' }}>
          <div style={{ background: `linear-gradient(90deg, ${C.indigo}, ${C.violet})`, height: '100%', width: `${(step / (STEPS.length - 1)) * 100}%`, transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Card */}
      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '20px', padding: '28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <div style={{ width: '40px', height: '40px', background: C.indigoBg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StepIcon size={20} color={C.indigo} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1E293B' }}>{STEPS[step].title}</h2>
            <p style={{ margin: 0, fontSize: '13px', color: '#94A3B8' }}>{STEPS[step].desc}</p>
          </div>
        </div>

        {/* Step content */}
        {step === 0 && <Step1 form={form} set={set} />}
        {step === 1 && <Step2 form={form} set={set} />}
        {step === 2 && <Step3 form={form} set={set} />}
        {step === 3 && <Step4 form={form} set={set} />}
        {step === 4 && <Step5 form={form} />}

        {/* Error */}
        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px', color: '#DC2626' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <button onClick={prev} disabled={step === 0} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F1F5F9', border: 'none', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, color: '#64748B', cursor: step === 0 ? 'not-allowed' : 'pointer', opacity: step === 0 ? 0.4 : 1 }}>
            <ChevronLeft size={15} /> Back
          </button>
          {step < STEPS.length - 1 ? (
            <button onClick={next} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: C.indigo, border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, color: '#fff', cursor: 'pointer' }}>
              Continue <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={submit} disabled={submitting} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#059669', border: 'none', borderRadius: '12px', padding: '12px 28px', fontSize: '15px', fontWeight: 700, color: '#fff', cursor: submitting ? 'wait' : 'pointer', opacity: submitting ? 0.8 : 1 }}>
              {submitting ? <><Loader2 size={15} style={{ animation: 'spin 0.8s linear infinite' }} /> Publishing…</> : <><CheckCircle size={15} /> Go Live as Mentor!</>}
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </button>
          )}
        </div>
      </div>

      <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#94A3B8' }}>
        Step {step + 1} of {STEPS.length} • You can edit everything from your dashboard later
      </p>
    </div>
  );
}
