/**
 * SendDMModal.jsx
 * Public facing modal for mentees to send a Priority DM to a mentor.
 * Tied to purchasing the "Priority DM" service.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config';
import { useAuth } from '../../AuthContext';
import { X, Send, CreditCard, Loader2, AlertCircle } from 'lucide-react';

const API = config.API_BASE_URL;

export default function SendDMModal({ mentor, service, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [coupon, setCoupon] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isFree = !service.price || service.isFree;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      // Direct them to login, maybe save state in localStorage to restore later (skip for MVP)
      navigate('/login');
      return;
    }

    if (!message.trim()) {
      setError('Message cannot be empty');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        mentorId: mentor._id || mentor.userId,
        serviceId: service._id,
        subject: subject.trim() || 'Priority DM',
        message: message.trim(),
        couponCode: coupon || undefined,
      };

      // Since we don't have a real payment gateway yet, we'll just create the thread
      // For a paid DM, in a real app this would create a checkout session
      const response = await axios.post(`${API}/dm/start`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setSuccess(true);
      const threadId = response.data.threadId;
      setTimeout(() => {
        onClose();
        if (threadId) {
          navigate(`/dm/${threadId}`);
        } else {
          navigate('/my-dms');
        }
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '24px', padding: '40px', maxWidth: '440px', width: '100%', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
          <div style={{ width: '64px', height: '64px', background: '#ECFDF5', color: '#059669', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>✓</div>
          <h2 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#1E293B' }}>Message Sent!</h2>
          <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748B', lineHeight: 1.5 }}>
            {mentor.name} will reply within <strong>{service.responseTime || '48 hours'}</strong>.
            You'll get an email notification when they respond.
          </p>
          <button onClick={onClose} style={{ background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: '24px', maxWidth: '560px', width: '100%', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ padding: '24px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {service.emoji || '💬'} {service.title || 'Priority DM'}
            </h2>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
              Send a direct message to {mentor.name}
            </p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: '10px', padding: '8px', cursor: 'pointer', color: '#64748B' }}>
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto' }}>
          
          {/* Service info badge */}
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', overflow: 'hidden' }}>
              {mentor.imageUrl ? <img src={mentor.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>Guaranteed response</p>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748B' }}>Usually responds {service.responseTime?.toLowerCase() || 'within 48 hours'}</p>
            </div>
          </div>

          <form id="dm-form" onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Subject</label>
              <input 
                type="text" 
                value={subject} 
                onChange={e => setSubject(e.target.value)} 
                placeholder="What's this about? (e.g., Resume review, Career advice...)"
                style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Your Message *</label>
              <textarea 
                value={message} 
                onChange={e => setMessage(e.target.value)} 
                placeholder={`Hi ${mentor.name.split(' ')[0]},\n\nI wanted to ask you about...`}
                rows={6}
                required
                style={{ width: '100%', border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              />
            </div>

            {!isFree && (
              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '8px' }}>Discount Code</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={coupon} 
                    onChange={e => setCoupon(e.target.value.toUpperCase())} 
                    placeholder="Enter code"
                    style={{ flex: 1, border: '1.5px solid #E2E8F0', borderRadius: '12px', padding: '10px 16px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                  <button type="button" style={{ background: '#F1F5F9', border: 'none', borderRadius: '12px', padding: '0 16px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                    Apply
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626', background: '#FEF2F2', padding: '12px', borderRadius: '8px', fontSize: '13px', marginTop: '16px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', borderRadius: '0 0 24px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Amount</p>
            <p style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#1E293B' }}>
              {isFree ? 'Free' : `₹${service.price?.toLocaleString('en-IN')}`}
            </p>
          </div>
          
          <button 
            type="submit" 
            form="dm-form"
            disabled={submitting || !message.trim()} 
            style={{ 
              background: '#4F46E5', color: '#fff', border: 'none', borderRadius: '14px', 
              padding: '14px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              opacity: (submitting || !message.trim()) ? 0.7 : 1, transition: '0.2s'
            }}
          >
            {submitting ? <Loader2 size={18} style={{ animation: 'spin 0.6s linear infinite' }} /> : isFree ? <Send size={18} /> : <CreditCard size={18} />}
            {submitting ? 'Processing...' : isFree ? 'Send Message' : 'Pay & Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
