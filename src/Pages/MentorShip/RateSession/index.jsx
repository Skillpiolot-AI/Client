// Rate Session Page - User rating after mentorship session
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, Send, CheckCircle, AlertCircle, User, Calendar, Clock } from 'lucide-react';
import config from '../../../config';
import './RateSession.css';

const RateSession = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchBookingDetails();
    }, [bookingId]);

    const fetchBookingDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${config.API_BASE_URL}/bookings/${bookingId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setBooking(response.data.booking || response.data);

            // Check if already rated
            if (response.data.booking?.rating?.score || response.data.rating?.score) {
                setSubmitted(true);
                setRating(response.data.booking?.rating?.score || response.data.rating?.score);
                setComment(response.data.booking?.rating?.comment || response.data.rating?.comment || '');
            }
        } catch (err) {
            console.error('Error fetching booking:', err);
            setError(err.response?.data?.error || 'Failed to load session details');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            alert('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${config.API_BASE_URL}/bookings/${bookingId}/rate`,
                { score: rating, comment },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setSubmitted(true);
        } catch (err) {
            console.error('Error submitting rating:', err);
            alert(err.response?.data?.error || 'Failed to submit rating');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getMentorName = () => {
        return booking?.mentorProfileId?.displayName ||
            booking?.mentorId?.name ||
            'Your Mentor';
    };

    if (loading) {
        return (
            <div className="rate-session-container">
                <div className="rate-session-card loading">
                    <div className="spinner"></div>
                    <p>Loading session details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="rate-session-container">
                <div className="rate-session-card error">
                    <AlertCircle size={48} className="error-icon" />
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="rate-session-container">
                <div className="rate-session-card success">
                    <CheckCircle size={64} className="success-icon" />
                    <h2>Thank You! 🎉</h2>
                    <p>Your feedback has been submitted successfully.</p>
                    <div className="rating-display">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={32}
                                fill={star <= rating ? '#F59E0B' : 'none'}
                                stroke={star <= rating ? '#F59E0B' : '#D1D5DB'}
                            />
                        ))}
                    </div>
                    {comment && <p className="submitted-comment">"{comment}"</p>}
                    <button className="btn-primary" onClick={() => navigate('/my-bookings')}>
                        View My Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rate-session-container">
            <div className="rate-session-card">
                <h1>Rate Your Session</h1>
                <p className="subtitle">Help us improve by sharing your experience</p>

                {/* Session Info */}
                <div className="session-info">
                    <div className="mentor-info">
                        <div className="mentor-avatar">
                            {booking?.mentorProfileId?.profileImage ? (
                                <img src={booking.mentorProfileId.profileImage} alt={getMentorName()} />
                            ) : (
                                <User size={32} />
                            )}
                        </div>
                        <div className="mentor-details">
                            <h3>{getMentorName()}</h3>
                            <p className="tagline">{booking?.mentorProfileId?.tagline || 'Mentor'}</p>
                        </div>
                    </div>

                    <div className="session-meta">
                        <div className="meta-item">
                            <Calendar size={16} />
                            <span>{formatDate(booking?.scheduledAt)}</span>
                        </div>
                        <div className="meta-item">
                            <Clock size={16} />
                            <span>{formatTime(booking?.scheduledAt)} • {booking?.duration || 60} min</span>
                        </div>
                    </div>
                </div>

                {/* Rating Form */}
                <form onSubmit={handleSubmit}>
                    <div className="rating-section">
                        <label>How would you rate this session?</label>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="star-btn"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    onMouseLeave={() => setHoveredRating(0)}
                                >
                                    <Star
                                        size={40}
                                        fill={star <= (hoveredRating || rating) ? '#F59E0B' : 'none'}
                                        stroke={star <= (hoveredRating || rating) ? '#F59E0B' : '#D1D5DB'}
                                    />
                                </button>
                            ))}
                        </div>
                        <p className="rating-label">
                            {rating === 1 && 'Poor'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent'}
                        </p>
                    </div>

                    <div className="comment-section">
                        <label htmlFor="comment">Share your thoughts (optional)</label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like? What could be improved?"
                            rows={4}
                            maxLength={500}
                        />
                        <span className="char-count">{comment.length}/500</span>
                    </div>

                    <button
                        type="submit"
                        className="btn-submit"
                        disabled={submitting || rating === 0}
                    >
                        {submitting ? (
                            <>Submitting...</>
                        ) : (
                            <>
                                <Send size={18} />
                                Submit Rating
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RateSession;
