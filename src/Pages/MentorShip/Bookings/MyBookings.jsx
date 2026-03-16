"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Calendar,
    Clock,
    Video,
    Star,
    CheckCircle,
    XCircle,
    AlertCircle,
    ExternalLink,
    MessageSquare,
    User,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import './MyBookings.css';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const SERVICE_TYPE_LABELS = {
    one_on_one: '1:1 Session',
    quick_chat: 'Quick Chat',
    mock_interview: 'Mock Interview',
    career_guidance: 'Career Guidance',
    discovery_call: 'Discovery Call',
    coaching_series: 'Coaching Series',
    priority_dm: 'Priority DM',
    resume_review: 'Resume Review',
    portfolio_review: 'Portfolio Review',
    ama: 'AMA',
    workshop: 'Workshop',
    webinar: 'Webinar',
    course: 'Course',
    referral: 'Referral',
    custom: 'Custom',
};

/**
 * MyBookings - User's booking/sessions page
 * Shows upcoming and past sessions with reschedule response,
 * mentor feedback view, and AI-powered suggestions
 */
const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [ratingModal, setRatingModal] = useState({ open: false, booking: null });
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Gemini suggestion state
    const [geminiSuggestions, setGeminiSuggestions] = useState({});
    const [geminiLoading, setGeminiLoading] = useState({});

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/my-bookings' } });
            return;
        }
        fetchBookings();
    }, [user]);

    const getToken = () => localStorage.getItem('token');

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${config.API_BASE_URL}/bookings/my-bookings`,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setBookings(response.data.bookings || []);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) return;
        try {
            await axios.put(
                `${config.API_BASE_URL}/bookings/${bookingId}/cancel`,
                { reason: 'User cancelled' },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Booking cancelled');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to cancel');
        }
    };

    const handleSubmitRating = async () => {
        if (!ratingModal.booking) return;
        try {
            setIsSubmitting(true);
            await axios.post(
                `${config.API_BASE_URL}/bookings/${ratingModal.booking._id}/rate`,
                { score: rating, comment },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Rating submitted! Thank you for your feedback.');
            setRatingModal({ open: false, booking: null });
            setRating(5);
            setComment('');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit rating');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Reschedule Response ───
    const handleAcceptSlot = async (bookingId, slot) => {
        try {
            setIsSubmitting(true);
            await axios.put(
                `${config.API_BASE_URL}/bookings/${bookingId}/reschedule-respond`,
                { selectedSlot: slot },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Reschedule accepted! Session updated.');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to accept reschedule');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Gemini AI Suggestion based on mentor feedback ───
    const fetchGeminiSuggestion = async (bookingId, feedbackText) => {
        if (!GEMINI_API_KEY || geminiSuggestions[bookingId]) return;

        setGeminiLoading(prev => ({ ...prev, [bookingId]: true }));
        try {
            const prompt = `You are an expert career guidance counsellor. A mentor has provided the following feedback about their mentoring session with a student:

"${feedbackText}"

Based on this feedback, provide a concise, actionable improvement plan for the student. Structure your response as:

1. KEY TAKEAWAYS (2-3 bullet points): What the mentor observed
2. ACTION ITEMS (3-4 bullet points): Specific steps the student should take
3. RESOURCES TO EXPLORE (2-3 suggestions): Courses, books, or activities

Keep the entire response under 200 words. Be encouraging and specific.`;

            const res = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.7, maxOutputTokens: 1000 },
                }),
            });

            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
            setGeminiSuggestions(prev => ({ ...prev, [bookingId]: text.trim() }));
        } catch (err) {
            console.error('Gemini error:', err);
            setGeminiSuggestions(prev => ({ ...prev, [bookingId]: 'Unable to generate suggestions. Please try again later.' }));
        } finally {
            setGeminiLoading(prev => ({ ...prev, [bookingId]: false }));
        }
    };

    const renderGeminiText = (text) => {
        return text.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return <div key={i} style={{ height: '6px' }} />;
            const clean = trimmed.replace(/\*\*/g, '');
            if (/^\d+\./.test(clean)) {
                return <h4 key={i} style={{ fontWeight: 700, color: '#4f46e5', marginTop: '12px', marginBottom: '4px', fontSize: '13px', textTransform: 'uppercase' }}>{clean.replace(/^\d+\.\s*/, '')}</h4>;
            }
            if (clean.startsWith('•') || clean.startsWith('-') || clean.startsWith('*')) {
                return <div key={i} style={{ display: 'flex', gap: '8px', marginTop: '4px', alignItems: 'flex-start', fontSize: '13px', color: '#374151' }}>
                    <span style={{ color: '#4f46e5', flexShrink: 0 }}>•</span>
                    <span>{clean.replace(/^[•\-\*]\s*/, '')}</span>
                </div>;
            }
            return <p key={i} style={{ fontSize: '13px', color: '#374151', margin: '4px 0', lineHeight: 1.5 }}>{clean}</p>;
        });
    };

    const getStatusBadge = (status, booking) => {
        const isExpired = ['pending', 'confirmed'].includes(status) && new Date(booking.scheduledAt) < new Date();
        const statusConfig = {
            pending: { color: 'orange', icon: AlertCircle, text: 'Pending' },
            confirmed: { color: 'blue', icon: CheckCircle, text: 'Confirmed' },
            'in-progress': { color: 'purple', icon: Video, text: 'In Progress' },
            completed: { color: 'green', icon: CheckCircle, text: 'Completed' },
            cancelled: { color: 'red', icon: XCircle, text: 'Cancelled' },
            'no-show': { color: 'gray', icon: XCircle, text: 'No Show' }
        };
        if (isExpired) {
            return (
                <span className="status-badge orange" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B' }}>
                    <Clock size={14} /> Expired
                </span>
            );
        }
        const cfg = statusConfig[status] || statusConfig.pending;
        const Icon = cfg.icon;
        return (
            <span className={`status-badge ${cfg.color}`}>
                <Icon size={14} />
                {cfg.text}
            </span>
        );
    };

    const isExpiredSession = (booking) => ['pending', 'confirmed'].includes(booking.status) && new Date(booking.scheduledAt) < new Date();
    const isUpcoming = (booking) => ['pending', 'confirmed', 'in-progress'].includes(booking.status) && !isExpiredSession(booking);
    const isPast = (booking) => ['completed', 'cancelled', 'no-show'].includes(booking.status) || isExpiredSession(booking);
    const filteredBookings = bookings.filter(b => activeTab === 'upcoming' ? isUpcoming(b) : isPast(b));

    if (isLoading) {
        return (
            <div className="my-bookings-container">
                <div className="loading-state">
                    <div className="spinner-large"></div>
                    <p>Loading your bookings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-bookings-container">
            <div className="my-bookings-content">
                {/* Header */}
                <div className="bookings-header">
                    <div>
                        <h1>📅 My Sessions</h1>
                        <p>View and manage your mentorship sessions</p>
                    </div>
                    <button className="refresh-btn" onClick={fetchBookings}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                {/* Tabs */}
                <div className="bookings-tabs">
                    <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
                        Upcoming Sessions <span className="count">{bookings.filter(isUpcoming).length}</span>
                    </button>
                    <button className={`tab ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>
                        Completed / Expired / Cancelled <span className="count">{bookings.filter(isPast).length}</span>
                    </button>
                </div>

                {/* Bookings List */}
                <div className="bookings-list">
                    {filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h3>No {activeTab} sessions</h3>
                            <p>{activeTab === 'upcoming' ? 'Book a session with a mentor to get started!' : 'Your past sessions will appear here.'}</p>
                            {activeTab === 'upcoming' && (
                                <button onClick={() => navigate('/mentorship')} className="btn-primary">Browse Mentors</button>
                            )}
                        </div>
                    ) : (
                        filteredBookings.map(booking => (
                            <div key={booking._id} className="booking-card">
                                <div className="booking-card-header">
                                    <div className="mentor-info">
                                        <img
                                            src={booking.mentorProfileId?.profileImage || booking.mentorId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.mentorProfileId?.displayName || booking.mentorId?.name)}&size=80&background=random`}
                                            alt="Mentor"
                                        />
                                        <div>
                                            <h3>{booking.mentorProfileId?.displayName || booking.mentorId?.name}</h3>
                                            <p>{booking.mentorProfileId?.tagline || 'Mentor'}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(booking.status, booking)}
                                </div>

                                {/* Service Info */}
                                {(booking.serviceId || booking.serviceName) && (
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', margin: '8px 0', flexWrap: 'wrap' }}>
                                        <span style={{ background: '#EEF2FF', color: '#4F46E5', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>
                                            🎯 {booking.serviceId?.title || booking.serviceName || 'Session'}
                                        </span>
                                        {booking.serviceId?.serviceType && (
                                            <span style={{ background: '#F1F5F9', color: '#64748B', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                                                {SERVICE_TYPE_LABELS[booking.serviceId.serviceType] || booking.serviceId.serviceType}
                                            </span>
                                        )}
                                        {booking.serviceId?.price > 0 && (
                                            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>₹{booking.serviceId.price}</span>
                                        )}
                                    </div>
                                )}

                                {/* Reschedule Banner */}
                                {booking.reschedule?.status === 'pending' && (
                                    <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '10px', padding: '14px', margin: '12px 0' }}>
                                        <div style={{ fontWeight: 700, color: '#92400E', fontSize: '14px', marginBottom: '6px' }}>
                                            📅 Reschedule Request from Mentor
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#78350F', margin: '0 0 8px' }}>
                                            <strong>Reason:</strong> {booking.reschedule.reason}
                                        </p>
                                        <p style={{ fontSize: '13px', color: '#92400E', fontWeight: 600, marginBottom: '8px' }}>
                                            Please select one of the proposed time slots:
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {booking.reschedule.proposedSlots?.map((slot, idx) => {
                                                const d = new Date(slot.dateTime);
                                                return (
                                                    <button
                                                        key={idx}
                                                        onClick={() => handleAcceptSlot(booking._id, slot.dateTime)}
                                                        disabled={isSubmitting}
                                                        style={{
                                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                            background: '#fff', border: '1.5px solid #E2E8F0', borderRadius: '8px',
                                                            padding: '10px 14px', cursor: 'pointer', fontSize: '13px', color: '#1E293B',
                                                            transition: 'all 0.2s'
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#4F46E5'; e.currentTarget.style.background = '#EEF2FF'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#fff'; }}
                                                    >
                                                        <span>
                                                            <Calendar size={13} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                                                            {d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                                            {' · '}
                                                            <Clock size={13} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                                                            {d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span style={{ background: '#4F46E5', color: '#fff', borderRadius: '6px', padding: '4px 12px', fontSize: '12px', fontWeight: 600 }}>
                                                            Select
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {booking.reschedule?.status === 'accepted' && (
                                    <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 14px', margin: '8px 0', fontSize: '13px', color: '#166534' }}>
                                        ✅ Session was rescheduled. New time is shown above.
                                    </div>
                                )}

                                <div className="booking-details">
                                    <div className="detail-item">
                                        <Calendar size={16} />
                                        <span>{new Date(booking.scheduledAt).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                    </div>
                                    <div className="detail-item">
                                        <Clock size={16} />
                                        <span>{new Date(booking.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({booking.duration} mins)</span>
                                    </div>
                                    {booking.isFree && (<div className="detail-item free"><span>🎁 FREE Session</span></div>)}
                                </div>

                                {booking.remark && (
                                    <div className="booking-remark">
                                        <MessageSquare size={14} />
                                        <p>{booking.remark}</p>
                                    </div>
                                )}

                                {/* Meeting Link */}
                                {booking.meetingLink && ['confirmed', 'in-progress'].includes(booking.status) && (
                                    <div className="meeting-link-section">
                                        <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="join-meeting-btn">
                                            <Video size={18} /> Join Meeting <ExternalLink size={14} />
                                        </a>
                                        <p className="meeting-link-text">{booking.meetingLink}</p>
                                    </div>
                                )}

                                {/* Mentor Feedback Section */}
                                {booking.mentorFeedback?.text && (
                                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px', margin: '10px 0' }}>
                                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#166534', marginBottom: '6px' }}>
                                            📝 Mentor Feedback
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#374151', margin: '0 0 10px', lineHeight: 1.6 }}>
                                            {booking.mentorFeedback.text}
                                        </p>
                                        <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '10px' }}>
                                            Submitted on {new Date(booking.mentorFeedback.submittedAt).toLocaleDateString('en-IN')}
                                        </div>

                                        {/* AI Suggestion Button */}
                                        {GEMINI_API_KEY && !geminiSuggestions[booking._id] && !geminiLoading[booking._id] && (
                                            <button
                                                onClick={() => fetchGeminiSuggestion(booking._id, booking.mentorFeedback.text)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '6px',
                                                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)', color: '#fff',
                                                    border: 'none', borderRadius: '8px', padding: '8px 16px',
                                                    fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                                                }}
                                            >
                                                <Sparkles size={14} /> Get AI Suggestions
                                            </button>
                                        )}

                                        {/* Loading Spinner */}
                                        {geminiLoading[booking._id] && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0' }}>
                                                <div style={{ width: '20px', height: '20px', border: '2px solid #e0e7ff', borderTop: '2px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                                <span style={{ fontSize: '13px', color: '#6b7280' }}>Generating AI suggestions...</span>
                                                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                                            </div>
                                        )}

                                        {/* Gemini Suggestion Content */}
                                        {geminiSuggestions[booking._id] && (
                                            <div style={{ marginTop: '10px', background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '8px', padding: '14px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                                                    <Sparkles size={14} color="#4F46E5" />
                                                    <span style={{ fontWeight: 700, fontSize: '13px', color: '#4F46E5' }}>AI Improvement Plan</span>
                                                </div>
                                                {renderGeminiText(geminiSuggestions[booking._id])}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="booking-actions">
                                    {isUpcoming(booking) && booking.status !== 'in-progress' && booking.reschedule?.status !== 'pending' && (
                                        <button className="btn-cancel-booking" onClick={() => handleCancelBooking(booking._id)}>
                                            <XCircle size={16} /> Cancel Booking
                                        </button>
                                    )}

                                    {booking.status === 'completed' && !booking.rating?.submittedAt && (
                                        <button className="btn-rate" onClick={() => setRatingModal({ open: true, booking })}>
                                            <Star size={16} /> Rate Session
                                        </button>
                                    )}

                                    {booking.rating?.submittedAt && (
                                        <div className="rating-display">
                                            <span>Your Rating:</span>
                                            <div className="stars">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star key={s} size={16} fill={s <= booking.rating.score ? '#fbbf24' : 'none'} color={s <= booking.rating.score ? '#fbbf24' : '#d1d5db'} />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="booking-id">Booking ID: {booking.bookingId}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Rating Modal */}
            {ratingModal.open && (
                <div className="rating-modal-overlay" onClick={() => setRatingModal({ open: false, booking: null })}>
                    <div className="rating-modal" onClick={e => e.stopPropagation()}>
                        <h2>⭐ Rate Your Session</h2>
                        <p>How was your session with {ratingModal.booking?.mentorProfileId?.displayName || ratingModal.booking?.mentorId?.name}?</p>

                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} className={`star-btn ${s <= rating ? 'active' : ''}`} onClick={() => setRating(s)}>
                                    <Star size={32} fill={s <= rating ? '#fbbf24' : 'none'} />
                                </button>
                            ))}
                        </div>
                        <p className="rating-label">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent!'}
                        </p>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience (optional)"
                            rows={3}
                        />

                        <div className="rating-actions">
                            <button onClick={() => setRatingModal({ open: false, booking: null })}>Cancel</button>
                            <button className="submit" onClick={handleSubmitRating} disabled={isSubmitting}>
                                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default MyBookings;
