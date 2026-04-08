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
    Sparkles,
    History as HistoryIcon,
    Loader2
} from 'lucide-react';

// Removed direct Gemini API constants for security. Now using backend proxy.

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

// Simple countdown helper
const useCountdown = (targetDate) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        if (!targetDate) return;
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                setTimeLeft('Started');
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h`);
            } else if (hours > 0) {
                setTimeLeft(`${hours}h ${minutes}m`);
            } else {
                setTimeLeft(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return timeLeft;
};

const CountdownDisplay = ({ scheduledAt }) => {
    const time = useCountdown(scheduledAt);
    return <div className="font-headline text-3xl font-bold text-tertiary-container">{time || '--:--'}</div>;
};

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ratingModal, setRatingModal] = useState({ open: false, booking: null });
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            
            // Sort bookings by date: upcoming nearest first, past latest first
            const fetched = response.data.bookings || [];
            
            setBookings(fetched);
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

    const fetchGeminiSuggestion = async (bookingId, feedbackText) => {
        if (geminiSuggestions[bookingId]) return;

        setGeminiLoading(prev => ({ ...prev, [bookingId]: true }));
        try {
            const prompt = `You are an expert career guidance counsellor. A mentor has provided the following feedback about their mentoring session with a student:

"${feedbackText}"

Based on this feedback, provide a concise, actionable improvement plan for the student. Structure your response as:

1. KEY TAKEAWAYS (2-3 bullet points): What the mentor observed
2. ACTION ITEMS (3-4 bullet points): Specific steps the student should take
3. RESOURCES TO EXPLORE (2-3 suggestions): Courses, books, or activities

Keep the entire response under 200 words. Be encouraging and specific.`;

            const res = await fetch(`${config.API_BASE_URL}/ai/generate`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    model: 'gemini-2.5-flash'
                }),
            });

            if (!res.ok) throw new Error('API error');
            const data = await res.json();
            const text = data?.text || '';
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
                return <h4 key={i} className="font-bold text-primary mt-3 mb-1 text-[13px] uppercase tracking-wider">{clean.replace(/^\d+\.\s*/, '')}</h4>;
            }
            if (clean.startsWith('•') || clean.startsWith('-') || clean.startsWith('*')) {
                return (
                    <div key={i} className="flex gap-2 mt-1 items-start text-[13px] text-slate-700">
                        <span className="text-primary shrink-0">•</span>
                        <span>{clean.replace(/^[•\-\*]\s*/, '')}</span>
                    </div>
                );
            }
            return <p key={i} className="text-[13px] text-slate-700 my-1 leading-relaxed">{clean}</p>;
        });
    };

    const isExpiredSession = (booking) => ['pending', 'confirmed'].includes(booking.status) && new Date(booking.scheduledAt) < new Date();
    const isUpcomingStatus = (booking) => ['pending', 'confirmed', 'in-progress'].includes(booking.status) && !isExpiredSession(booking);
    
    // Derived collections
    // Sort upcoming by soonest first
    const upcomingBookings = bookings
        .filter(isUpcomingStatus)
        .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
        
    // Sort past by most recent first
    const pastBookings = bookings
        .filter(b => !isUpcomingStatus(b))
        .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

    const nearestSession = upcomingBookings[0];
    const otherUpcoming = upcomingBookings.slice(1);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-surface">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-secondary font-medium">Loading your booking journey...</p>
            </div>
        );
    }

    // Helper to render reschedule slot picker
    const renderReschedulePrompt = (booking) => {
        if (booking.reschedule?.status !== 'pending') return null;
        return (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-4">
                <div className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                    <AlertCircle size={16} /> Reschedule Request from Mentor
                </div>
                <p className="text-sm text-amber-900 mb-3 leading-relaxed">
                    <span className="font-semibold">Reason:</span> {booking.reschedule.reason}
                </p>
                <div className="space-y-2">
                    {booking.reschedule.proposedSlots?.map((slot, idx) => {
                        const d = new Date(slot.dateTime);
                        return (
                            <button
                                key={idx}
                                onClick={() => handleAcceptSlot(booking._id, slot.dateTime)}
                                disabled={isSubmitting}
                                className="w-full flex justify-between items-center bg-white border border-slate-200 rounded-lg p-3 hover:border-primary hover:bg-slate-50 transition-all group text-left"
                            >
                                <div className="text-sm text-slate-700 flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                                    <span>{d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="text-slate-300">|</span>
                                    <Clock size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                                    <span>{d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">Select</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 p-6 md:p-10 bg-surface min-h-screen font-body text-on-surface">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight text-on-surface mb-2">Booking Journey</h1>
                        <p className="text-secondary text-sm md:text-base">Track your upcoming sessions and review past mentorship growth.</p>
                    </div>
                    <button 
                        onClick={fetchBookings}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-outline-variant/30 text-secondary font-bold text-sm rounded-lg hover:bg-slate-50 transition-colors w-fit shadow-sm"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                </header>

                {/* Upcoming Sessions Section */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-headline text-lg md:text-xl font-bold text-primary flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-tertiary-container/30"></span>
                            Upcoming Sessions
                        </h2>
                        <span className="text-[10px] md:text-xs font-label uppercase tracking-widest text-secondary bg-surface-container-high px-3 py-1 rounded-full">
                            {upcomingBookings.length} Active
                        </span>
                    </div>

                    {upcomingBookings.length === 0 ? (
                        <div className="bg-surface-container-low rounded-2xl p-10 flex flex-col items-center justify-center text-center border border-dashed border-outline-variant/30">
                            <Calendar size={48} className="text-slate-300 mb-4" />
                            <h3 className="font-headline text-xl font-bold text-slate-700 mb-2">No upcoming sessions</h3>
                            <p className="text-secondary text-sm mb-6 max-w-sm">You haven't booked any upcoming sessions yet. Find a mentor and accelerate your career!</p>
                            <button onClick={() => navigate('/mentorship')} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
                                Browse Mentors
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                            {/* Primary Highlight Card (Nearest Session) */}
                            {nearestSession && (
                                <div className="col-span-1 lg:col-span-7 group">
                                    <div className="bg-surface-container-lowest rounded-2xl p-6 lg:p-8 transition-all duration-300 ease-out border border-outline-variant/10 shadow-sm hover:shadow-[0_20px_40px_rgba(31,27,24,0.06)] relative overflow-hidden h-full flex flex-col justify-between">
                                        {/* Countdown Badge */}
                                        <div className="absolute top-0 right-0 p-6 flex flex-col items-end hidden sm:flex">
                                            <span className="text-[10px] font-label uppercase tracking-widest text-secondary mb-1">Starts In</span>
                                            <CountdownDisplay scheduledAt={nearestSession.scheduledAt} />
                                        </div>

                                        <div>
                                            {/* Tag */}
                                            {nearestSession.serviceId && (
                                                <div className="inline-block bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
                                                    {SERVICE_TYPE_LABELS[nearestSession.serviceId.serviceType] || nearestSession.serviceId.serviceType}
                                                </div>
                                            )}

                                            {/* Mentor Details */}
                                            <div className="flex items-center gap-5 mb-8">
                                                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full ring-4 ring-surface-container-low overflow-hidden shrink-0">
                                                    <img 
                                                        className="w-full h-full object-cover" 
                                                        src={nearestSession.mentorProfileId?.profileImage || nearestSession.mentorId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(nearestSession.mentorProfileId?.displayName || nearestSession.mentorId?.name)}&background=random`}
                                                        alt="Mentor" 
                                                    />
                                                </div>
                                                <div>
                                                    <h3 className="font-headline text-2xl font-bold text-on-surface">
                                                        {nearestSession.mentorProfileId?.displayName || nearestSession.mentorId?.name}
                                                    </h3>
                                                    <p className="text-sm text-secondary bg-surface px-3 py-1 mt-1 rounded-lg inline-block font-medium">
                                                        {nearestSession.serviceId?.title || nearestSession.serviceName || 'Mentoring Session'}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Time Details */}
                                            <div className="space-y-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                    <Calendar className="text-tertiary-container shrink-0" size={18} />
                                                    <span>{new Date(nearestSession.scheduledAt).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    <span className="text-slate-300">|</span>
                                                    <Clock className="text-tertiary-container shrink-0" size={18} />
                                                    <span>{new Date(nearestSession.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({nearestSession.duration}m)</span>
                                                </div>
                                                {nearestSession.meetingLink && nearestSession.status !== 'pending' && (
                                                    <div className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                        <Video className="text-tertiary-container shrink-0" size={18} />
                                                        <span className="text-emerald-700">Meeting Link Ready</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Rechedule Box */}
                                            {renderReschedulePrompt(nearestSession)}
                                            
                                            {/* Reschedule Success Alert */}
                                            {nearestSession.reschedule?.status === 'accepted' && (
                                                <div className="mt-4 bg-emerald-50 text-emerald-700 text-xs font-bold px-4 py-2 rounded-lg border border-emerald-200">
                                                    ✅ Rescheduled session confirmed! 
                                                </div>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="pt-8 flex flex-wrap gap-4 mt-auto">
                                            {nearestSession.meetingLink && nearestSession.status !== 'pending' ? (
                                                <a 
                                                    href={nearestSession.meetingLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:-translate-y-0.5 hover:bg-slate-800 transition-all w-full sm:w-auto"
                                                >
                                                    <Video size={16} /> Join Meeting
                                                </a>
                                            ) : (
                                                <button disabled className="bg-slate-100 text-slate-400 px-6 py-3 rounded-xl font-headline font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed w-full sm:w-auto">
                                                    <Clock size={16} /> Awaiting Link
                                                </button>
                                            )}
                                            
                                            {nearestSession.status !== 'in-progress' && nearestSession.reschedule?.status !== 'pending' && (
                                                <button 
                                                    onClick={() => handleCancelBooking(nearestSession._id)}
                                                    className="px-6 py-3 text-rose-600 font-headline font-bold text-sm bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors w-full sm:w-auto"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Secondary Upcoming Cards (Floating style) */}
                            {otherUpcoming.length > 0 && (
                                <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 justify-start">
                                    {otherUpcoming.map(booking => (
                                        <div key={booking._id} className="bg-surface-container-low p-5 md:p-6 rounded-2xl relative border border-outline-variant/5 shadow-sm">
                                            {/* Corner Status */}
                                            <div className="absolute top-4 right-4">
                                                {booking.status === 'pending' && <span className="w-2 h-2 rounded-full bg-amber-400 block" title="Pending Confirmation" />}
                                                {booking.status === 'confirmed' && <span className="w-2 h-2 rounded-full bg-emerald-400 block" title="Confirmed" />}
                                            </div>

                                            <div className="flex items-start gap-4 mb-4">
                                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm">
                                                    <img 
                                                        className="w-full h-full object-cover" 
                                                        src={booking.mentorProfileId?.profileImage || booking.mentorId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.mentorProfileId?.displayName || booking.mentorId?.name)}&background=random`}
                                                        alt="Mentor" 
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-headline font-bold text-on-surface truncate">
                                                        {booking.mentorProfileId?.displayName || booking.mentorId?.name}
                                                    </h4>
                                                    <p className="text-xs text-secondary mb-2 truncate">
                                                        {SERVICE_TYPE_LABELS[booking.serviceId?.serviceType] || booking.serviceId?.title || 'Session'}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-medium font-body bg-white/50 inline-flex px-2 py-1 rounded-md">
                                                        <Clock size={12} className="text-slate-400" />
                                                        {new Date(booking.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}, {new Date(booking.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {renderReschedulePrompt(booking)}

                                            <div className="pt-2 flex gap-2">
                                                {booking.meetingLink ? (
                                                    <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="flex-1 py-2 text-center bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                                                        Join Meeting
                                                    </a>
                                                ) : (
                                                    <div className="flex-1 py-2 text-center bg-white text-slate-400 text-xs font-bold rounded-lg border border-outline-variant/20">
                                                        Pending Link
                                                    </div>
                                                )}
                                                <button onClick={() => handleCancelBooking(booking._id)} className="w-10 flex items-center justify-center bg-white text-rose-500 text-xs font-bold rounded-lg border border-outline-variant/20 hover:bg-rose-50 transition-colors">
                                                    <XCircle size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Booking History (Bento-inspired List) */}
                <section>
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-outline-variant/10">
                        <h2 className="font-headline text-lg md:text-xl font-bold text-primary flex items-center gap-2">
                            <span className="w-8 h-[2px] bg-tertiary-container/30"></span>
                            Booking History
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {pastBookings.length === 0 ? (
                            <div className="text-center py-10 text-secondary text-sm">No past sessions found.</div>
                        ) : (
                            pastBookings.map(booking => (
                                <div key={booking._id} className="group bg-surface-container-low/50 hover:bg-surface-container-lowest transition-all duration-300 rounded-2xl p-1 border border-transparent hover:border-outline-variant/20 hover:shadow-sm">
                                    <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 md:p-5">
                                        
                                        {/* Avatar (Grayscale until hover) */}
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shrink-0 grayscale group-hover:grayscale-0 transition-all duration-500 border border-slate-200">
                                            <img 
                                                className="w-full h-full object-cover" 
                                                src={booking.mentorProfileId?.profileImage || booking.mentorId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(booking.mentorProfileId?.displayName || booking.mentorId?.name)}&background=random`}
                                                alt="Mentor" 
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h4 className="font-headline font-bold text-on-surface">
                                                    {booking.mentorProfileId?.displayName || booking.mentorId?.name}
                                                </h4>
                                                
                                                {/* Status Badge */}
                                                {booking.status === 'completed' && <span className="text-[10px] font-label font-bold tracking-wide text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">Completed</span>}
                                                {booking.status === 'cancelled' && <span className="text-[10px] font-label font-bold tracking-wide text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">Cancelled</span>}
                                                {booking.status === 'no-show' && <span className="text-[10px] font-label font-bold tracking-wide text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">No Show</span>}
                                                {isExpiredSession(booking) && <span className="text-[10px] font-label font-bold tracking-wide text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">Expired</span>}
                                            </div>
                                            
                                            <p className="text-xs text-secondary mb-2 font-medium">
                                                {booking.serviceId?.title || booking.serviceName || 'Session'} • {new Date(booking.scheduledAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            
                                            {/* Preview Notes or Feedback text if exists natively */}
                                            {booking.remark && (
                                                <p className="text-sm text-on-surface/70 italic leading-relaxed line-clamp-2">"{booking.remark}"</p>
                                            )}
                                        </div>

                                        {/* Actions Panel */}
                                        <div className="flex flex-wrap md:flex-col lg:flex-row gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-outline-variant/10 md:pl-4">
                                            
                                            {booking.status === 'completed' && !booking.rating?.submittedAt && (
                                                <button 
                                                    onClick={() => setRatingModal({ open: true, booking })}
                                                    className="px-4 py-2 bg-tertiary-container text-xs font-bold text-white rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-1 flex-1 md:flex-none"
                                                >
                                                    <Star size={14} /> Review
                                                </button>
                                            )}

                                            {booking.rating?.submittedAt && (
                                                <div className="flex items-center justify-center gap-1 px-4 py-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg text-xs font-bold flex-1 md:flex-none">
                                                    <Star size={14} fill="#059669" className="text-emerald-700" />
                                                    Rated {booking.rating.score}.0
                                                </div>
                                            )}

                                        </div>
                                    </div>

                                    {/* Expandable Mentor Feedback Box embedded directly in the row */}
                                    {booking.mentorFeedback?.text && (
                                        <div className="mx-4 mb-4 mt-2 p-4 bg-indigo-50/50 border border-indigo-100/50 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <MessageSquare size={14} className="text-indigo-600" />
                                                <span className="font-bold text-xs text-indigo-900 tracking-wide uppercase">Mentor Feedback</span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-relaxed mb-4">
                                                {booking.mentorFeedback.text}
                                            </p>

                                            {/* AI Suggestion Flow */}
                                            {!geminiSuggestions[booking._id] && !geminiLoading[booking._id] && (
                                                <button
                                                    onClick={() => fetchGeminiSuggestion(booking._id, booking.mentorFeedback.text)}
                                                    className="flex items-center gap-2 bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-50 transition-colors shadow-sm"
                                                >
                                                    <Sparkles size={14} /> Generate AI Dev Plan
                                                </button>
                                            )}

                                            {geminiLoading[booking._id] && (
                                                <div className="flex items-center gap-3 py-2">
                                                    <Loader2 size={16} className="text-indigo-500 animate-spin" />
                                                    <span className="text-xs font-medium text-slate-500">Studying feedback and generating actions...</span>
                                                </div>
                                            )}

                                            {geminiSuggestions[booking._id] && (
                                                <div className="mt-4 bg-white border border-indigo-100 rounded-xl p-4 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-3 border-b border-indigo-50 pb-2">
                                                        <Sparkles size={14} className="text-indigo-600" />
                                                        <span className="font-bold text-sm text-indigo-900">AI Improvement Plan</span>
                                                    </div>
                                                    <div className="pl-1">
                                                        {renderGeminiText(geminiSuggestions[booking._id])}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>

            {/* Rating Modal Component */}
            {ratingModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setRatingModal({ open: false, booking: null })}>
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h2 className="text-xl font-headline font-bold text-slate-900">Rate Session</h2>
                                <p className="text-sm text-slate-500 mt-1">
                                    How was your session with {ratingModal.booking?.mentorProfileId?.displayName || ratingModal.booking?.mentorId?.name}?
                                </p>
                            </div>
                            <button onClick={() => setRatingModal({ open: false, booking: null })} className="text-slate-400 hover:text-slate-700 transition-colors">
                                <XCircle size={20} />
                            </button>
                        </div>

                        <div className="flex justify-center gap-2 my-8">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} onClick={() => setRating(s)} className="focus:outline-none transform transition-transform hover:scale-110">
                                    <Star size={36} fill={s <= rating ? '#fbbf24' : 'none'} color={s <= rating ? '#fbbf24' : '#cbd5e1'} />
                                </button>
                            ))}
                        </div>

                        <div className="text-center font-bold text-sm text-primary mb-6 uppercase tracking-widest">
                            {rating === 1 && 'Needs Improvement'}
                            {rating === 2 && 'Fair'}
                            {rating === 3 && 'Good'}
                            {rating === 4 && 'Very Good'}
                            {rating === 5 && 'Excellent!'}
                        </div>

                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience or note what they helped you with... (optional)"
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none mb-6"
                        />

                        <button 
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" 
                            onClick={handleSubmitRating} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} fill="#ffffff" />}
                            {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </div>
                </div>
            )}

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default MyBookings;
