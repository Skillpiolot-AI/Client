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
    RefreshCw
} from 'lucide-react';
import './MyBookings.css';

/**
 * MyBookings - User's booking/sessions page
 * Shows upcoming and past sessions with actions
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

    useEffect(() => {
        if (!user) {
            navigate('/login', { state: { from: '/my-bookings' } });
            return;
        }
        fetchBookings();
    }, [user]);

    const fetchBookings = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${config.API_BASE_URL}/bookings/my-bookings`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
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
            const token = localStorage.getItem('token');
            await axios.put(
                `${config.API_BASE_URL}/bookings/${bookingId}/cancel`,
                { reason: 'User cancelled' },
                { headers: { Authorization: `Bearer ${token}` } }
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
            const token = localStorage.getItem('token');
            await axios.post(
                `${config.API_BASE_URL}/bookings/${ratingModal.booking._id}/rate`,
                { score: rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
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

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: { color: 'orange', icon: AlertCircle, text: 'Pending' },
            confirmed: { color: 'blue', icon: CheckCircle, text: 'Confirmed' },
            'in-progress': { color: 'purple', icon: Video, text: 'In Progress' },
            completed: { color: 'green', icon: CheckCircle, text: 'Completed' },
            cancelled: { color: 'red', icon: XCircle, text: 'Cancelled' },
            'no-show': { color: 'gray', icon: XCircle, text: 'No Show' }
        };
        const config = statusConfig[status] || statusConfig.pending;
        const Icon = config.icon;
        return (
            <span className={`status-badge ${config.color}`}>
                <Icon size={14} />
                {config.text}
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

                {/* Bookings List */}
                <div className="bookings-list">
                    {filteredBookings.length === 0 ? (
                        <div className="empty-state">
                            <Calendar size={48} />
                            <h3>No {activeTab} sessions</h3>
                            <p>
                                {activeTab === 'upcoming'
                                    ? 'Book a session with a mentor to get started!'
                                    : 'Your past sessions will appear here.'
                                }
                            </p>
                            {activeTab === 'upcoming' && (
                                <button onClick={() => navigate('/mentorship')} className="btn-primary">
                                    Browse Mentors
                                </button>
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
                                    {getStatusBadge(booking.status)}
                                </div>

                                <div className="booking-details">
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
                                    <div className="booking-remark">
                                        <MessageSquare size={14} />
                                        <p>{booking.remark}</p>
                                    </div>
                                )}

                                {/* Meeting Link */}
                                {booking.meetingLink && ['confirmed', 'in-progress'].includes(booking.status) && (
                                    <div className="meeting-link-section">
                                        <a
                                            href={booking.meetingLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="join-meeting-btn"
                                        >
                                            <Video size={18} />
                                            Join Meeting
                                            <ExternalLink size={14} />
                                        </a>
                                        <p className="meeting-link-text">{booking.meetingLink}</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="booking-actions">
                                    {isUpcoming(booking) && booking.status !== 'in-progress' && (
                                        <button
                                            className="btn-cancel-booking"
                                            onClick={() => handleCancelBooking(booking._id)}
                                        >
                                            <XCircle size={16} />
                                            Cancel Booking
                                        </button>
                                    )}

                                    {booking.status === 'completed' && !booking.rating?.submittedAt && (
                                        <button
                                            className="btn-rate"
                                            onClick={() => setRatingModal({ open: true, booking })}
                                        >
                                            <Star size={16} />
                                            Rate Session
                                        </button>
                                    )}

                                    {booking.rating?.submittedAt && (
                                        <div className="rating-display">
                                            <span>Your Rating:</span>
                                            <div className="stars">
                                                {[1, 2, 3, 4, 5].map(s => (
                                                    <Star
                                                        key={s}
                                                        size={16}
                                                        fill={s <= booking.rating.score ? '#fbbf24' : 'none'}
                                                        color={s <= booking.rating.score ? '#fbbf24' : '#d1d5db'}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="booking-id">
                                    Booking ID: {booking.bookingId}
                                </div>
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
                                <button
                                    key={s}
                                    className={`star-btn ${s <= rating ? 'active' : ''}`}
                                    onClick={() => setRating(s)}
                                >
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
                            <button onClick={() => setRatingModal({ open: false, booking: null })}>
                                Cancel
                            </button>
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
