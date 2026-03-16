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
    CheckCircle,
    XCircle,
    AlertCircle,
    ExternalLink,
    User,
    RefreshCw,
    MessageSquare,
    Edit3,
    FileText,
    Eye,
    Repeat
} from 'lucide-react';
import './MentorSessions.css';

const DOMAIN_NAMES = { R: 'Realistic', I: 'Investigative', A: 'Artistic', S: 'Social', E: 'Enterprising', C: 'Conventional' };

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

const MentorSessions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [notesModal, setNotesModal] = useState({ open: false, booking: null });
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reschedule state
    const [rescheduleModal, setRescheduleModal] = useState({ open: false, booking: null });
    const [rescheduleReason, setRescheduleReason] = useState('');
    const [rescheduleSlots, setRescheduleSlots] = useState(['', '', '']);

    // Student profile state
    const [studentProfile, setStudentProfile] = useState(null);
    const [studentProfileModal, setStudentProfileModal] = useState(false);
    const [studentProfileLoading, setStudentProfileLoading] = useState(false);

    // Feedback state
    const [feedbackModal, setFeedbackModal] = useState({ open: false, booking: null });
    const [feedbackText, setFeedbackText] = useState('');

    useEffect(() => {
        if (user) fetchBookings();
    }, [user]);

    const getToken = () => localStorage.getItem('token');

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `${config.API_BASE_URL}/bookings/mentor/sessions`,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setBookings(response.data.bookings || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Failed to load sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteSession = (booking) => {
        setNotesModal({ open: true, booking });
    };

    const handleSubmitComplete = async () => {
        if (!notesModal.booking) return;
        try {
            setIsSubmitting(true);
            await axios.put(
                `${config.API_BASE_URL}/bookings/mentor/${notesModal.booking._id}/complete`,
                { notes },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Session marked as completed!');
            setNotesModal({ open: false, booking: null });
            setNotes('');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to complete session');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Reschedule ───
    const openReschedule = (booking) => {
        setRescheduleModal({ open: true, booking });
        setRescheduleReason('');
        setRescheduleSlots(['', '', '']);
    };

    const handleAddSlot = () => {
        if (rescheduleSlots.length < 5) setRescheduleSlots([...rescheduleSlots, '']);
    };
    const handleRemoveSlot = (idx) => {
        if (rescheduleSlots.length > 3) {
            setRescheduleSlots(rescheduleSlots.filter((_, i) => i !== idx));
        }
    };
    const handleSlotChange = (idx, val) => {
        const updated = [...rescheduleSlots];
        updated[idx] = val;
        setRescheduleSlots(updated);
    };

    const handleSubmitReschedule = async () => {
        const filledSlots = rescheduleSlots.filter(s => s);
        if (!rescheduleReason.trim()) return toast.error('Please provide a reason');
        if (filledSlots.length < 3) return toast.error('Please provide at least 3 time slots');

        try {
            setIsSubmitting(true);
            await axios.put(
                `${config.API_BASE_URL}/bookings/mentor/${rescheduleModal.booking._id}/reschedule`,
                { reason: rescheduleReason, proposedSlots: filledSlots },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Reschedule request sent to student!');
            setRescheduleModal({ open: false, booking: null });
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to send reschedule');
        } finally {
            setIsSubmitting(false);
        }
    };

    // ─── Student Profile ───
    const viewStudentProfile = async (booking) => {
        try {
            setStudentProfileLoading(true);
            setStudentProfileModal(true);
            const res = await axios.get(
                `${config.API_BASE_URL}/bookings/mentor/${booking._id}/student-profile`,
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            setStudentProfile(res.data);
        } catch (error) {
            toast.error('Failed to load student profile');
            setStudentProfileModal(false);
        } finally {
            setStudentProfileLoading(false);
        }
    };

    // ─── Mentor Feedback ───
    const openFeedbackModal = (booking) => {
        setFeedbackModal({ open: true, booking });
        setFeedbackText('');
    };

    const handleSubmitFeedback = async () => {
        if (!feedbackText.trim()) return toast.error('Please enter your feedback');
        try {
            setIsSubmitting(true);
            await axios.post(
                `${config.API_BASE_URL}/bookings/mentor/${feedbackModal.booking._id}/feedback`,
                { feedback: feedbackText },
                { headers: { Authorization: `Bearer ${getToken()}` } }
            );
            toast.success('Feedback submitted!');
            setFeedbackModal({ open: false, booking: null });
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit feedback');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status, booking) => {
        // Check if session is expired (scheduled date passed but not completed/cancelled)
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
                <span className="session-status-badge orange" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #F59E0B' }}>
                    <Clock size={14} />
                    Expired
                </span>
            );
        }

        const cfg = statusConfig[status] || statusConfig.pending;
        const Icon = cfg.icon;
        return (
            <span className={`session-status-badge ${cfg.color}`}>
                <Icon size={14} />
                {cfg.text}
            </span>
        );
    };

    const isExpiredSession = (booking) => {
        return ['pending', 'confirmed'].includes(booking.status) && new Date(booking.scheduledAt) < new Date();
    };

    const isUpcoming = (booking) => ['pending', 'confirmed', 'in-progress'].includes(booking.status) && !isExpiredSession(booking);
    const isPast = (booking) => ['completed', 'cancelled', 'no-show'].includes(booking.status) || isExpiredSession(booking);
    const filteredBookings = bookings.filter(b => activeTab === 'upcoming' ? isUpcoming(b) : isPast(b));

    if (isLoading) {
        return (
            <div className="mentor-sessions-container">
                <div className="loading-state">
                    <div className="spinner-large"></div>
                    <p>Loading your sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="mentor-sessions-container">
            <div className="mentor-sessions-content">
                {/* Header */}
                <div className="sessions-header">
                    <div>
                        <h1>👨‍🏫 My Mentoring Sessions</h1>
                        <p>Manage your mentorship sessions and connect with students</p>
                    </div>
                    <button className="refresh-btn" onClick={fetchBookings}>
                        <RefreshCw size={18} />
                        Refresh
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="session-stats">
                    <div className="stat-card">
                        <div className="stat-value">{bookings.filter(b => isUpcoming(b)).length}</div>
                        <div className="stat-label">Upcoming</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{bookings.filter(b => b.status === 'completed').length}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{bookings.filter(b => isExpiredSession(b)).length}</div>
                        <div className="stat-label">Expired</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{bookings.length}</div>
                        <div className="stat-label">Total</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="sessions-tabs">
                    <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} onClick={() => setActiveTab('upcoming')}>
                        Upcoming Sessions <span className="count">{bookings.filter(isUpcoming).length}</span>
                    </button>
                    <button className={`tab ${activeTab === 'past' ? 'active' : ''}`} onClick={() => setActiveTab('past')}>
                        Completed / Expired / Cancelled <span className="count">{bookings.filter(isPast).length}</span>
                    </button>
                </div>

                {/* Sessions List */}
                <div className="sessions-list">
                    {filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h3>No {activeTab} sessions</h3>
                            <p>{activeTab === 'upcoming' ? 'You have no upcoming sessions at the moment.' : 'Your completed sessions will appear here.'}</p>
                        </div>
                    ) : (
                        filteredBookings.map(booking => (
                            <div key={booking._id} className="session-card">
                                <div className="session-card-header">
                                    <div className="student-info">
                                        <img src={booking.userId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.userId?.name)}&size=80&background=random`} alt="Student" />
                                        <div>
                                            <h3>{booking.userId?.name || 'Student'}</h3>
                                            <p>{booking.userId?.email}</p>
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

                                {/* Reschedule pending banner */}
                                {booking.reschedule?.status === 'pending' && (
                                    <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: '8px', padding: '10px 14px', margin: '10px 0', fontSize: '13px', color: '#92400E' }}>
                                        ⏳ <strong>Reschedule pending</strong> — Waiting for student to select a new time slot.
                                    </div>
                                )}

                                <div className="session-details">
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
                                    <div className="session-remark">
                                        <MessageSquare size={14} />
                                        <div><strong>Student's Message:</strong><p>{booking.remark}</p></div>
                                    </div>
                                )}

                                {booking.meetingLink && (
                                    <div className="meeting-link-section">
                                        <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="start-meeting-btn">
                                            <Video size={18} />
                                            {isUpcoming(booking) ? 'Start Meeting' : 'View Meeting Link'}
                                            <ExternalLink size={14} />
                                        </a>
                                        <p className="meeting-link-text">{booking.meetingLink}</p>
                                    </div>
                                )}

                                {booking.mentorNotes && (
                                    <div className="mentor-notes"><FileText size={14} /><div><strong>Your Notes:</strong><p>{booking.mentorNotes}</p></div></div>
                                )}

                                {booking.mentorFeedback?.text && (
                                    <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 14px', margin: '8px 0', fontSize: '13px' }}>
                                        <strong>✅ Your Feedback:</strong> <p style={{ margin: '4px 0 0', color: '#166534' }}>{booking.mentorFeedback.text}</p>
                                    </div>
                                )}

                                {booking.rating?.score && (
                                    <div className="student-rating">
                                        <span>Student's Rating:</span>
                                        <div className="stars">{'⭐'.repeat(booking.rating.score)}</div>
                                        {booking.rating.comment && (<p className="rating-comment">"{booking.rating.comment}"</p>)}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="session-actions">
                                    {/* View Student Profile - for all bookings */}
                                    <button style={{ background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                        onClick={() => viewStudentProfile(booking)}>
                                        <Eye size={16} /> View Profile
                                    </button>

                                    {/* Reschedule - for upcoming only */}
                                    {isUpcoming(booking) && booking.reschedule?.status !== 'pending' && (
                                        <button style={{ background: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            onClick={() => openReschedule(booking)}>
                                            <Repeat size={16} /> Reschedule
                                        </button>
                                    )}

                                    {/* Complete - for confirmed/in-progress */}
                                    {['confirmed', 'in-progress'].includes(booking.status) && (
                                        <button className="btn-complete" onClick={() => handleCompleteSession(booking)}>
                                            <CheckCircle size={16} /> Mark as Completed
                                        </button>
                                    )}

                                    {/* Feedback - for completed without feedback */}
                                    {booking.status === 'completed' && !booking.mentorFeedback?.text && (
                                        <button style={{ background: '#ECFDF5', color: '#059669', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                                            onClick={() => openFeedbackModal(booking)}>
                                            <Edit3 size={16} /> Give Feedback
                                        </button>
                                    )}
                                </div>

                                <div className="session-id">Booking ID: {booking.bookingId}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Complete Session Modal */}
            {notesModal.open && (
                <div className="notes-modal-overlay" onClick={() => setNotesModal({ open: false, booking: null })}>
                    <div className="notes-modal" onClick={e => e.stopPropagation()}>
                        <h2>✅ Complete Session</h2>
                        <p>Mark this session with {notesModal.booking?.userId?.name} as completed.</p>
                        <div className="form-group">
                            <label><Edit3 size={16} /> Session Notes (Optional)</label>
                            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add notes about what was discussed, action items, etc." rows={4} />
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setNotesModal({ open: false, booking: null })}>Cancel</button>
                            <button className="submit" onClick={handleSubmitComplete} disabled={isSubmitting}>
                                {isSubmitting ? 'Completing...' : 'Complete Session'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reschedule Modal */}
            {rescheduleModal.open && (
                <div className="notes-modal-overlay" onClick={() => setRescheduleModal({ open: false, booking: null })}>
                    <div className="notes-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
                        <h2>📅 Reschedule Session</h2>
                        <p>Provide a reason and propose 3-5 alternative time slots for {rescheduleModal.booking?.userId?.name}.</p>

                        <div className="form-group">
                            <label>Reason for Reschedule</label>
                            <textarea value={rescheduleReason} onChange={e => setRescheduleReason(e.target.value)} placeholder="e.g., I have a conflicting meeting at that time..." rows={2} />
                        </div>

                        <div className="form-group">
                            <label>Proposed Time Slots (min 3, max 5)</label>
                            {rescheduleSlots.map((slot, idx) => (
                                <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', color: '#64748B', width: '24px' }}>{idx + 1}.</span>
                                    <input
                                        type="datetime-local"
                                        value={slot}
                                        onChange={e => handleSlotChange(idx, e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                        style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #E2E8F0', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                                    />
                                    {rescheduleSlots.length > 3 && (
                                        <button onClick={() => handleRemoveSlot(idx)} style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}>×</button>
                                    )}
                                </div>
                            ))}
                            {rescheduleSlots.length < 5 && (
                                <button onClick={handleAddSlot} style={{ background: '#EEF2FF', color: '#4F46E5', border: 'none', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>+ Add Slot</button>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setRescheduleModal({ open: false, booking: null })}>Cancel</button>
                            <button className="submit" onClick={handleSubmitReschedule} disabled={isSubmitting} style={{ background: '#F59E0B' }}>
                                {isSubmitting ? 'Sending...' : 'Send Reschedule Request'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Student Profile Modal */}
            {studentProfileModal && (
                <div className="notes-modal-overlay" onClick={() => { setStudentProfileModal(false); setStudentProfile(null); }}>
                    <div className="notes-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', maxHeight: '80vh', overflow: 'auto' }}>
                        <h2>👤 Student Profile</h2>

                        {studentProfileLoading ? (
                            <div style={{ textAlign:'center', padding:'40px' }}>
                                <div className="spinner-large"></div>
                                <p>Loading profile...</p>
                            </div>
                        ) : studentProfile ? (
                            <div>
                                {/* Student Basic Info */}
                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '10px' }}>
                                    <img src={studentProfile.student.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(studentProfile.student.name)}&size=60&background=random`}
                                        alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }} />
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '15px' }}>{studentProfile.student.name}</div>
                                        <div style={{ fontSize: '12px', color: '#64748B' }}>{studentProfile.student.email}</div>
                                    </div>
                                </div>

                                {/* Holland Assessment Results */}
                                {studentProfile.assessment ? (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#4F46E5', marginBottom: '10px' }}>🧠 Holland Assessment (RIASEC)</h3>
                                        <div style={{ background: '#EEF2FF', borderRadius: '10px', padding: '14px' }}>
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                                <span style={{ background: '#4F46E5', color: '#fff', borderRadius: '20px', padding: '3px 12px', fontSize: '14px', fontWeight: 700 }}>
                                                    {studentProfile.assessment.hollandCode}
                                                </span>
                                                {studentProfile.assessment.topThreeDomains?.map(d => (
                                                    <span key={d} style={{ background: '#fff', color: '#4F46E5', borderRadius: '20px', padding: '3px 10px', fontSize: '12px', fontWeight: 600 }}>
                                                        {DOMAIN_NAMES[d] || d}
                                                    </span>
                                                ))}
                                            </div>
                                            {studentProfile.assessment.domainScores && (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                                                    {Object.entries(studentProfile.assessment.domainScores).map(([d, score]) => (
                                                        <div key={d} style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', padding: '4px 8px', background: '#fff', borderRadius: '6px' }}>
                                                            <span style={{ color: '#64748B' }}>{DOMAIN_NAMES[d]}</span>
                                                            <span style={{ fontWeight: 700, color: '#1E293B' }}>{score}%</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {studentProfile.assessment.recommendedCareers?.length > 0 && (
                                                <div style={{ marginTop: '10px' }}>
                                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#4F46E5', marginBottom: '4px' }}>Recommended Careers:</div>
                                                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                                        {studentProfile.assessment.recommendedCareers.map((c, i) => (
                                                            <span key={i} style={{ background: '#fff', borderRadius: '6px', padding: '2px 8px', fontSize: '11px', color: '#475569' }}>{c.name} ({c.matchScore}%)</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '8px' }}>
                                                Completed: {new Date(studentProfile.assessment.completedAt).toLocaleDateString('en-IN')}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '14px', marginBottom: '20px', fontSize: '13px', color: '#64748B' }}>
                                        No Holland assessment taken yet.
                                    </div>
                                )}

                                {/* Past Mentor Feedback */}
                                {studentProfile.pastFeedback?.length > 0 ? (
                                    <div>
                                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#059669', marginBottom: '10px' }}>📝 Previous Mentor Feedback</h3>
                                        {studentProfile.pastFeedback.map((fb, i) => (
                                            <div key={i} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', fontSize: '13px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                                    <strong style={{ color: '#166534' }}>{fb.mentorName}</strong>
                                                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>{new Date(fb.date).toLocaleDateString('en-IN')}</span>
                                                </div>
                                                <p style={{ margin: '4px 0 0', color: '#374151' }}>{fb.feedback}</p>
                                                {fb.studentRating && <div style={{ marginTop: '4px', fontSize: '12px' }}>Student rated: {'⭐'.repeat(fb.studentRating)}</div>}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '14px', fontSize: '13px', color: '#64748B' }}>
                                        No previous mentor feedback available.
                                    </div>
                                )}
                            </div>
                        ) : null}

                        <div className="modal-actions" style={{ marginTop: '16px' }}>
                            <button onClick={() => { setStudentProfileModal(false); setStudentProfile(null); }}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Feedback Modal */}
            {feedbackModal.open && (
                <div className="notes-modal-overlay" onClick={() => setFeedbackModal({ open: false, booking: null })}>
                    <div className="notes-modal" onClick={e => e.stopPropagation()}>
                        <h2>📝 Session Feedback</h2>
                        <p>Share your feedback about the session with <strong>{feedbackModal.booking?.userId?.name}</strong>.</p>
                        <p style={{ fontSize: '13px', color: '#64748B' }}>What were the student's issues? What outcomes were discussed? Your feedback will help generate AI suggestions for the student.</p>

                        <div className="form-group">
                            <label>Your Feedback</label>
                            <textarea
                                value={feedbackText}
                                onChange={e => setFeedbackText(e.target.value)}
                                placeholder="Describe the student's current challenges, what was discussed, key takeaways, action items, and your observations about their strengths and areas for improvement..."
                                rows={5}
                            />
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setFeedbackModal({ open: false, booking: null })}>Cancel</button>
                            <button className="submit" onClick={handleSubmitFeedback} disabled={isSubmitting} style={{ background: '#059669' }}>
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default MentorSessions;
