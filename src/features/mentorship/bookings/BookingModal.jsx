"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, Clock, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import config from '../../../config';
import './BookingModal.css';

/**
 * BookingModal - Modal for scheduling a mentorship session
 * Shows a date/time picker with smart slot availability
 */
const BookingModal = ({
    isOpen,
    onClose,
    mentor,
    onConfirmBooking,
    isBooking
}) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [remark, setRemark] = useState('');
    const [topics, setTopics] = useState('');
    const [slots, setSlots] = useState([]);
    const [slotsLoading, setSlotsLoading] = useState(false);
    const [slotsError, setSlotsError] = useState(null);
    const [dayMessage, setDayMessage] = useState('');

    useEffect(() => {
        if (selectedDate && mentor) {
            fetchAvailableSlots(selectedDate);
        } else {
            setSlots([]);
            setDayMessage('');
        }
        setSelectedTime('');
    }, [selectedDate, mentor]);

    const fetchAvailableSlots = async (date) => {
        setSlotsLoading(true);
        setSlotsError(null);
        setDayMessage('');

        try {
            const mentorProfileId = mentor.mentorProfileId || mentor.id || mentor._id;
            const response = await axios.get(
                `${config.API_BASE_URL}/bookings/available-slots/${mentorProfileId}?date=${date}`
            );

            const data = response.data;

            if (data.isBusyDate || data.isWeeklyUnavailable) {
                setSlots([]);
                setDayMessage(data.message || 'Mentor is unavailable on this date');
            } else {
                setSlots(data.slots || []);
                if (data.availableCount === 0) {
                    setDayMessage('All slots are booked for this date');
                }
            }
        } catch (error) {
            console.error('Error fetching slots:', error);
            setSlotsError('Failed to load available slots');
            setSlots([]);
        } finally {
            setSlotsLoading(false);
        }
    };

    if (!isOpen || !mentor) return null;

    // Generate next 7 days
    const getNextSevenDays = () => {
        const days = [];
        const today = new Date();

        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push({
                value: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('en-IN', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                }),
                dayName: date.toLocaleDateString('en-IN', { weekday: 'long' })
            });
        }
        return days;
    };

    const handleSubmit = () => {
        if (!selectedDate || !selectedTime) return;

        const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);

        onConfirmBooking({
            mentorProfileId: mentor.mentorProfileId || mentor.id || mentor._id,
            scheduledAt: scheduledAt.toISOString(),
            duration: mentor.sessionDuration || 60,
            remark: remark.trim(),
            topics: topics.split(',').map(t => t.trim()).filter(Boolean)
        });
    };

    const nextSevenDays = getNextSevenDays();
    const availableSlots = slots.filter(s => s.isAvailable);
    const bookedSlots = slots.filter(s => s.isBooked);

    return (
        <div className="booking-modal-overlay" onClick={onClose}>
            <div className="booking-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="booking-modal-header">
                    <div className="booking-modal-title">
                        <Calendar size={24} />
                        <h2>Book a Session</h2>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Mentor Info */}
                <div className="booking-mentor-info">
                    <img
                        src={mentor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.displayName || mentor.name)}&size=80&background=random`}
                        alt={mentor.displayName || mentor.name}
                    />
                    <div>
                        <h3>{mentor.displayName || mentor.name}</h3>
                        <p>{mentor.jobTitle || 'Mentor'}</p>
                        {mentor.isFree ? (
                            <span className="free-badge">🎁 FREE Session</span>
                        ) : (
                            <span className="price-badge">₹{mentor.trialSession?.price || 199}</span>
                        )}
                    </div>
                </div>

                {/* Date Selection */}
                <div className="booking-section">
                    <label>
                        <Calendar size={16} />
                        Select Date (Next 7 Days)
                    </label>
                    <div className="date-grid">
                        {nextSevenDays.map(day => (
                            <button
                                key={day.value}
                                className={`date-btn ${selectedDate === day.value ? 'selected' : ''}`}
                                onClick={() => setSelectedDate(day.value)}
                            >
                                <span className="day-name">{day.label.split(',')[0]}</span>
                                <span className="day-date">{day.label.split(',')[1] || day.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="booking-section">
                    <label>
                        <Clock size={16} />
                        Select Time
                        {selectedDate && !slotsLoading && availableSlots.length > 0 && (
                            <span className="slot-count">
                                ({availableSlots.length} available)
                            </span>
                        )}
                    </label>

                    {!selectedDate ? (
                        <div className="slots-placeholder">
                            <Calendar size={24} />
                            <p>Please select a date to see available slots</p>
                        </div>
                    ) : slotsLoading ? (
                        <div className="slots-loading">
                            <Loader2 size={24} className="spin" />
                            <p>Loading available slots...</p>
                        </div>
                    ) : slotsError ? (
                        <div className="slots-error">
                            <AlertCircle size={24} />
                            <p>{slotsError}</p>
                        </div>
                    ) : dayMessage ? (
                        <div className="slots-unavailable">
                            <AlertCircle size={24} />
                            <p>{dayMessage}</p>
                        </div>
                    ) : (
                        <div className="time-grid">
                            {slots.map(slot => (
                                <button
                                    key={slot.time}
                                    className={`time-btn ${selectedTime === slot.time ? 'selected' : ''} ${slot.isBooked ? 'booked' : ''}`}
                                    onClick={() => !slot.isBooked && setSelectedTime(slot.time)}
                                    disabled={slot.isBooked}
                                >
                                    {slot.label}
                                    {slot.isBooked && <span className="booked-label">Booked</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Remark/Message */}
                <div className="booking-section">
                    <label>
                        <MessageSquare size={16} />
                        Message to Mentor (Optional)
                    </label>
                    <textarea
                        value={remark}
                        onChange={(e) => setRemark(e.target.value)}
                        placeholder="Tell the mentor what you'd like to discuss..."
                        maxLength={500}
                        rows={3}
                    />
                </div>

                {/* Topics */}
                <div className="booking-section">
                    <label>Topics to Discuss (comma separated)</label>
                    <input
                        type="text"
                        value={topics}
                        onChange={(e) => setTopics(e.target.value)}
                        placeholder="e.g., Career guidance, Resume review, Interview prep"
                    />
                </div>

                {/* Info Note */}
                <div className="booking-info-note">
                    <AlertCircle size={16} />
                    <p>
                        You'll receive a confirmation email with the Jitsi meeting link.
                        Both you and your mentor will get reminders before the session.
                    </p>
                </div>

                {/* Actions */}
                <div className="booking-modal-actions">
                    <button className="btn-cancel" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-confirm"
                        onClick={handleSubmit}
                        disabled={!selectedDate || !selectedTime || isBooking}
                    >
                        {isBooking ? (
                            <>
                                <span className="spinner"></span>
                                Booking...
                            </>
                        ) : (
                            <>Confirm Booking</>
                        )}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .slots-placeholder,
                .slots-loading,
                .slots-error,
                .slots-unavailable {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    background: #f8fafc;
                    border-radius: 12px;
                    color: #64748b;
                    text-align: center;
                    gap: 8px;
                }

                .slots-error {
                    background: #fef2f2;
                    color: #dc2626;
                }

                .slots-unavailable {
                    background: #fef3c7;
                    color: #d97706;
                }

                .slot-count {
                    font-weight: normal;
                    color: #059669;
                    margin-left: 8px;
                }

                .time-btn.booked {
                    background: #fee2e2 !important;
                    color: #dc2626 !important;
                    border-color: #fecaca !important;
                    cursor: not-allowed;
                    position: relative;
                    opacity: 0.8;
                }

                .time-btn .booked-label {
                    display: block;
                    font-size: 9px;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-top: 2px;
                }

                .spin {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default BookingModal;
