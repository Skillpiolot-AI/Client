/**
 * AdminMentorApprovals.jsx
 * Admin panel to review, approve, and reject pending mentor applications.
 * Route: /admin/mentor-applications (Admin only via RoleGuard)
 */

import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../../config';
import { CheckCircle, XCircle, Clock, ExternalLink, Loader2, RefreshCw } from 'lucide-react';

const API = config.API_BASE_URL;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const C = { indigo: '#4F46E5', green: '#059669', red: '#DC2626', border: '#E2E8F0', slate: '#64748B' };

const STATUS_TABS = [
  { key: 'pending', label: '⏳ Pending Review', color: '#D97706' },
  { key: 'approved', label: '✅ Approved', color: C.green },
  { key: 'rejected', label: '❌ Rejected', color: C.red },
  { key: 'all', label: '📋 All', color: C.slate },
];

export default function AdminMentorApprovals() {
  const [status, setStatus] = useState('pending');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [rejectModal, setRejectModal] = useState(null); // { userId, name }
  const [rejectReason, setRejectReason] = useState('');
  const [toast, setToast] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/admin/mentor-applications?status=${status}&limit=50`, { headers: authHeader() });
      setApplications(r.data.applications || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [status]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const approve = async (userId, name) => {
    setActionLoading(userId);
    try {
      await axios.post(`${API}/admin/mentor-applications/${userId}/approve`, {}, { headers: authHeader() });
      showToast(`✅ ${name} approved! Their profile is now live.`);
      load();
    } catch (e) {
      showToast(`❌ Error: ${e.response?.data?.error || 'Failed to approve'}`);
    }
    setActionLoading('');
  };

  const reject = async () => {
    const { userId, name } = rejectModal;
    setActionLoading(userId);
    try {
      await axios.post(`${API}/admin/mentor-applications/${userId}/reject`, { reason: rejectReason || undefined }, { headers: authHeader() });
      showToast(`Application for ${name} rejected.`);
      setRejectModal(null);
      setRejectReason('');
      load();
    } catch (e) {
      showToast(`❌ Error: ${e.response?.data?.error || 'Failed to reject'}`);
    }
    setActionLoading('');
  };

  const statusColor = { pending: '#D97706', approved: C.green, rejected: C.red };
  const statusBg = { pending: '#FEF3C7', approved: '#ECFDF5', rejected: '#FEF2F2' };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px', fontFamily: 'Inter, sans-serif' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', background: '#1E293B', color: '#fff', borderRadius: '12px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, zIndex: 9999, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>Mentor Applications</h1>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: C.slate }}>Review and approve/reject mentor applications</p>
        </div>
        <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '9px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: C.slate }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {STATUS_TABS.map(t => (
          <button key={t.key} onClick={() => setStatus(t.key)} style={{ padding: '8px 18px', borderRadius: '24px', border: `2px solid ${status === t.key ? t.color : C.border}`, background: status === t.key ? `${t.color}15` : '#fff', color: status === t.key ? t.color : C.slate, fontWeight: 700, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <Loader2 size={28} style={{ animation: 'spin 0.8s linear infinite', color: C.indigo }} />
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      ) : applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', border: `2px dashed ${C.border}`, borderRadius: '16px' }}>
          <p style={{ fontSize: '32px', margin: '0 0 8px' }}>🎉</p>
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#1E293B', margin: 0 }}>
            No {status === 'all' ? '' : status} applications
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {applications.map(app => {
            const profile = app.mentorProfile;
            const isLoading = actionLoading === app._id;

            return (
              <div key={app._id} style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: '16px', padding: '20px 22px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  {/* Avatar */}
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', fontWeight: 800, flexShrink: 0, overflow: 'hidden' }}>
                    {app.imageUrl ? <img src={app.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : app.name?.[0]?.toUpperCase()}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>{app.name}</span>
                      {/* Status pill */}
                      <span style={{ background: statusBg[app.mentorStatus] || '#F1F5F9', color: statusColor[app.mentorStatus] || C.slate, borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                        {app.mentorStatus}
                      </span>
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '13px', color: C.slate }}>{app.email}</p>
                    {profile && (
                      <div style={{ marginTop: '8px' }}>
                        {profile.tagline && <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#475569' }}>{profile.tagline}</p>}
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {(profile.expertise || []).slice(0, 5).map(e => (
                            <span key={e} style={{ background: '#EEF2FF', color: C.indigo, borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 600 }}>{e}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {app.mentorStatus === 'rejected' && app.mentorRejectionReason && (
                      <p style={{ margin: '8px 0 0', fontSize: '12px', color: C.red, background: '#FEF2F2', borderRadius: '8px', padding: '6px 10px' }}>
                        Rejection reason: {app.mentorRejectionReason}
                      </p>
                    )}
                    <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#94A3B8' }}>
                      Applied: {new Date(app.mentorAppliedAt || app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                    {profile?.handle && (
                      <a href={`/mentor/${profile.handle}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#F8FAFC', border: `1px solid ${C.border}`, borderRadius: '8px', padding: '7px 12px', color: C.slate, fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                        <ExternalLink size={12} /> Preview
                      </a>
                    )}
                    {app.mentorStatus !== 'approved' && (
                      <button onClick={() => approve(app._id, app.name)} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#ECFDF5', border: `1px solid #A7F3D0`, borderRadius: '8px', padding: '7px 14px', color: C.green, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        {isLoading ? <Loader2 size={12} style={{ animation: 'spin 0.6s linear infinite' }} /> : <CheckCircle size={12} />} Approve
                      </button>
                    )}
                    {app.mentorStatus !== 'rejected' && (
                      <button onClick={() => setRejectModal({ userId: app._id, name: app.name })} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#FEF2F2', border: `1px solid #FECACA`, borderRadius: '8px', padding: '7px 14px', color: C.red, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                        <XCircle size={12} /> Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject reason modal */}
      {rejectModal && (
        <div onClick={() => setRejectModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '20px', padding: '28px', maxWidth: '440px', width: '100%' }}>
            <h3 style={{ margin: '0 0 8px', fontWeight: 800, color: '#1E293B' }}>Reject Application</h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: C.slate }}>Rejecting <strong>{rejectModal.name}</strong>. Add an optional reason (visible to admin only):</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3} placeholder="e.g. Profile incomplete, not enough experience, duplicate application..." style={{ width: '100%', border: `1.5px solid ${C.border}`, borderRadius: '10px', padding: '10px 12px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: '16px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={reject} style={{ flex: 1, background: C.red, color: '#fff', border: 'none', borderRadius: '12px', padding: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Confirm Reject
              </button>
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} style={{ background: '#F1F5F9', border: 'none', borderRadius: '12px', padding: '12px 18px', cursor: 'pointer', color: C.slate, fontWeight: 600 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
