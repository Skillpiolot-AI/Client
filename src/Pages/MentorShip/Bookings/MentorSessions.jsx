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
    FileText
} from 'lucide-react';
import './MentorSessions.css';

/**
 * MentorSessions - Mentor's session management page
 * Shows upcoming and past sessions with actions to complete and add notes
 */
const MentorSessions = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [notesModal, setNotesModal] = useState({ open: false, booking: null });
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        // Wait for auth to be determined - don't redirect while loading
        // The ProtectedRoute component handles the redirect, we just need to fetch
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${config.API_BASE_URL}/bookings/mentor/sessions`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setBookings(response.data.bookings || []);
        } catch (error) {
            console.error('Error fetching sessions:', error);
            toast.error('Failed to load sessions');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteSession = async (booking) => {
        setNotesModal({ open: true, booking });
    };

    const handleSubmitComplete = async () => {
        if (!notesModal.booking) return;

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('token');
            await axios.put(
                `${config.API_BASE_URL}/bookings/mentor/${notesModal.booking._id}/complete`,
                { notes },
                { headers: { Authorization: `Bearer ${token}` } }
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

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'orange', icon: AlertCircle, text: 'Pending' },
            confirmed: { color: 'blue', icon: CheckCircle, text: 'Confirmed' },
            'in-progress': { color: 'purple', icon: Video, text: 'In Progress' },
            completed: { color: 'green', icon: CheckCircle, text: 'Completed' },
            cancelled: { color: 'red', icon: XCircle, text: 'Cancelled' },
            'no-show': { color: 'gray', icon: XCircle, text: 'No Show' }
        };
        const cfg = statusConfig[status] || statusConfig.pending;
        const Icon = cfg.icon;
        return (
            <span className={`session-status-badge ${cfg.color}`}>
                <Icon size={14} />
                {cfg.text}
            </span>
        );
    };

    const isUpcoming = (booking) => {
        return ['pending', 'confirmed', 'in-progress'].includes(booking.status);
    };

    const filteredBookings = bookings.filter(b =>
        activeTab === 'upcoming' ? isUpcoming(b) : !isUpcoming(b)
    );

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
                        <div className="stat-value">{bookings.filter(b => b.status === 'confirmed').length}</div>
                        <div className="stat-label">Upcoming</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{bookings.filter(b => b.status === 'completed').length}</div>
                        <div className="stat-label">Completed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{bookings.length}</div>
                        <div className="stat-label">Total Sessions</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="sessions-tabs">
                    <button
                        className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Sessions
                        <span className="count">{bookings.filter(isUpcoming).length}</span>
                    </button>
                    <button
                        className={`tab ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past Sessions
                        <span className="count">{bookings.filter(b => !isUpcoming(b)).length}</span>
                    </button>
                </div>

                {/* Sessions List */}
                <div className="sessions-list">
                    {filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h3>No {activeTab} sessions</h3>
                            <p>
                                {activeTab === 'upcoming'
                                    ? 'You have no upcoming sessions at the moment.'
                                    : 'Your completed sessions will appear here.'
                                }
                            </p>
                        </div>
                    ) : (
                        filteredBookings.map(booking => (
                            <div key={booking._id} className="session-card">
                                <div className="session-card-header">
                                    <div className="student-info">
                                        <img
                                            src={booking.userId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.userId?.name)}&size=80&background=random`}
                                            alt="Student"
                                        />
                                        <div>
                                            <h3>{booking.userId?.name || 'Student'}</h3>
                                            <p>{booking.userId?.email}</p>
                                        </div>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>

                                <div className="session-details">
                                    <div className="detail-item">
                                        <Calendar size={16} />
                                        <span>
                                            {new Date(booking.scheduledAt).toLocaleDateString('en-IN', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <Clock size={16} />
                                        <span>
                                            {new Date(booking.scheduledAt).toLocaleTimeString('en-IN', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                            {' '}({booking.duration} mins)
                                        </span>
                                    </div>
                                    {booking.isFree && (
                                        <div className="detail-item free">
                                            <span>🎁 FREE Session</span>
                                        </div>
                                    )}
                                </div>

                                {booking.remark && (
                                    <div className="session-remark">
                                        <MessageSquare size={14} />
                                        <div>
                                            <strong>Student's Message:</strong>
                                            <p>{booking.remark}</p>
                                        </div>
                                    </div>
                                )}

                                {booking.topics && booking.topics.length > 0 && (
                                    <div className="session-topics">
                                        <strong>Topics:</strong>
                                        <div className="topics-list">
                                            {booking.topics.map((topic, i) => (
                                                <span key={i} className="topic-tag">{topic}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Meeting Link */}
                                {booking.meetingLink && (
                                    <div className="meeting-link-section">
                                        <a
                                            href={booking.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="start-meeting-btn"
                                        >
                                            <Video size={18} />
                                            {isUpcoming(booking) ? 'Start Meeting' : 'View Meeting Link'}
                                            <ExternalLink size={14} />
                                        </a>
                                        <p className="meeting-link-text">{booking.meetingLink}</p>
                                    </div>
                                )}

                                {/* Mentor Notes */}
                                {booking.mentorNotes && (
                                    <div className="mentor-notes">
                                        <FileText size={14} />
                                        <div>
                                            <strong>Your Notes:</strong>
                                            <p>{booking.mentorNotes}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Rating Display */}
                                {booking.rating?.score && (
                                    <div className="student-rating">
                                        <span>Student's Rating:</span>
                                        <div className="stars">
                                            {'⭐'.repeat(booking.rating.score)}
                                        </div>
                                        {booking.rating.comment && (
                                            <p className="rating-comment">"{booking.rating.comment}"</p>
                                        )}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="session-actions">
                                    {['confirmed', 'in-progress'].includes(booking.status) && (
                                        <button
                                            className="btn-complete"
                                            onClick={() => handleCompleteSession(booking)}
                                        >
                                            <CheckCircle size={16} />
                                            Mark as Completed
                                        </button>
                                    )}
                                </div>

                                <div className="session-id">
                                    Booking ID: {booking.bookingId}
                                </div>
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
                            <label>
                                <Edit3 size={16} />
                                Session Notes (Optional)
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add notes about what was discussed, action items, etc."
                                rows={4}
                            />
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setNotesModal({ open: false, booking: null })}>
                                Cancel
                            </button>
                            <button className="submit" onClick={handleSubmitComplete} disabled={isSubmitting}>
                                {isSubmitting ? 'Completing...' : 'Complete Session'}
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
