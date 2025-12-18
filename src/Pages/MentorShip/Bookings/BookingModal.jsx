"use client";

import React, { useState } from 'react';
import { X, Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import './BookingModal.css';

/**
 * BookingModal - Modal for scheduling a mentorship session
 * Shows a date/time picker limited to next 7 days
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

    // Generate time slots (9 AM to 9 PM)
    const getTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 21; hour++) {
            const time24 = `${hour.toString().padStart(2, '0')}:00`;
            const time12 = hour <= 12
                ? `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`
                : `${hour - 12}:00 PM`;
            slots.push({ value: time24, label: time12 });
        }
        return slots;
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
    const timeSlots = getTimeSlots();

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
                    </label>
                    <div className="time-grid">
                        {timeSlots.map(slot => (
                            <button
                                key={slot.value}
                                className={`time-btn ${selectedTime === slot.value ? 'selected' : ''}`}
                                onClick={() => setSelectedTime(slot.value)}
                            >
                                {slot.label}
                            </button>
                        ))}
                    </div>
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
        </div>
    );
};

export default BookingModal;
