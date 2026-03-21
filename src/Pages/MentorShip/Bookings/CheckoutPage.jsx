import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Lock, Calendar, Clock, LockIcon, ShieldCheck,
  ThumbsUp, HelpCircle, ArrowRight, Verified, Loader2
} from 'lucide-react';
import axios from 'axios';
import config from '../../../config';
import '../MentorFlow.css';

const API_URL = config.API_BASE_URL;

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const {
    service,
    mentor,
    mentorProfileId,
    couponCode,
    couponResult
  } = state;

  const [selectedDate, setSelectedDate] = useState(state.date || '');
  const [selectedTime, setSelectedTime] = useState(state.time || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [dayMessage, setDayMessage] = useState('');

  // Fetch slots
  useEffect(() => {
    if (selectedDate && mentor) {
      fetchAvailableSlots(selectedDate);
    } else {
      setSlots([]);
      setDayMessage('');
    }
  }, [selectedDate, mentor]);

  const fetchAvailableSlots = async (dateStr) => {
    setSlotsLoading(true);
    setSlotsError(null);
    try {
      const profileId = mentorProfileId || mentor._id || mentor.id;
      const response = await axios.get(
        `${API_URL}/bookings/available-slots/${profileId}?date=${dateStr}`
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
      setSlotsError('Failed to load available slots');
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  };

  // Fallback or validation
  if (!mentor) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold">Invalid booking state</h2>
        <p className="text-secondary mt-2">Please select a service first.</p>
        <button onClick={() => navigate(-1)} className="mt-4 bg-[#1d2b3e] text-white px-6 py-2 rounded-xl">
          Back to Profile
        </button>
      </div>
    );
  }

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select a Date and Time first.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to book a session');
        navigate('/login', { state: { from: location.pathname, bookingState: state } });
        return;
      }

      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`);

      const bookingData = {
        mentorProfileId: mentorProfileId || mentor._id || mentor.id,
        serviceId: service ? service._id : undefined,
        couponCode: couponCode || undefined,
        scheduledAt: scheduledAt.toISOString(),
        duration: service ? (service.duration || 60) : 60,
        remark: notes.trim(),
        topics: []
      };

      await axios.post(`${API_URL}/bookings/book`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Navigate to success page
      navigate(`/mentor/${mentor.handle || 'profile'}/success`, {
        state: {
          mentor,
          date: selectedDate,
          time: selectedTime,
          service,
          scheduledAt: scheduledAt.toISOString()
        }
      });

    } catch (e) {
      alert(e.response?.data?.error || 'Failed to book session');
    }
    setIsSubmitting(false);
  };
  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const isToday = i === 0;
      days.push({
        value: date.toISOString().split('T')[0],
        label: isToday ? 'Today' : date.toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }),
        dayName: date.toLocaleDateString('en-IN', { weekday: 'long' })
      });
    }
    return days;
  };

  const nextSevenDays = getNextSevenDays();
  const availableSlots = slots.filter(s => s.isAvailable);

  const getDayName = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  // Pricing calculation
  const basePrice = service ? (service.isFree ? 0 : service.price || 0) : 0;
  const discount = couponResult?.valid ? couponResult.discountAmount || 0 : 0;
  const finalPrice = couponResult?.valid ? couponResult.finalPrice : basePrice;
  const platformFee = 0; // Or calculate if needed: finalPrice > 0 ? 12.5 : 0;
  const total = finalPrice + platformFee;

  return (
    <div className="bg-[#fff8f5] min-h-screen text-[#1f1b18] font-body selection:bg-[#9cf2e8] selection:text-[#00201d]">
      <main className="pt-8 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Form Details */}
          <div className="lg:col-span-7 space-y-10">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#1d2b3e] tracking-tight leading-tight font-headline">
                Confirm Your <span className="text-[#004944]">Strategy Session</span>
              </h1>
              <p className="text-[#505f76] text-lg max-w-xl leading-relaxed">
                You're one step away from navigating your career path with expert guidance. Review your details below.
              </p>
            </header>

            {/* Step 1: Booking Details */}
            <section className="p-8 rounded-xl bg-[#fbf2ed] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1d2b3e] flex items-center justify-center text-white font-bold">1</div>
                <h2 className="text-xl font-bold text-[#1d2b3e] font-headline">Session Schedule</h2>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-[#1d2b3e]">Select Date</label>
                <div className="flex overflow-x-auto gap-3 pb-3 scroll-smooth select-none">
                  {nextSevenDays.map((day) => (
                    <button
                      key={day.value}
                      onClick={() => setSelectedDate(day.value)}
                      className={`flex-shrink-0 p-3 rounded-xl border-2 text-center transition-all w-24 ${
                        selectedDate === day.value
                          ? 'bg-[#1d2b3e] text-white border-[#1d2b3e]'
                          : 'bg-white text-[#1d2b3e] border-[#c5c6cd]/15 hover:border-[#1d2b3e]/30'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wider">{day.label}</p>
                      <p className="text-sm font-medium mt-1 opacity-70">{day.dayName.slice(0, 3)}</p>
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-semibold text-[#1d2b3e] mt-4">Select Time</label>
                {slotsLoading ? (
                  <div className="flex items-center gap-2 text-[#505f76] text-sm"><Loader2 className="animate-spin w-4 h-4"/> Loading slots...</div>
                ) : slotsError ? (
                  <p className="text-red-500 text-sm">{slotsError}</p>
                ) : dayMessage ? (
                  <p className="text-[#505f76] text-sm italic">{dayMessage}</p>
                ) : slots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot, idx) => (
                      <button
                        key={idx}
                        disabled={!slot.isAvailable}
                        onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 rounded-lg text-sm font-semibold border transition-all ${
                          !slot.isAvailable
                            ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed'
                            : selectedTime === slot.time
                            ? 'bg-[#004944] text-white border-[#004944]'
                            : 'bg-white text-[#1d2b3e] border-[#c5c6cd]/15 hover:border-[#004944]/40'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#505f76] text-sm italic">Please select a date above to see available slots.</p>
                )}
              </div>
            </section>

            {/* Step 2: Notes for Mentor */}
            <section className="p-8 rounded-xl bg-[#fbf2ed] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1d2b3e] flex items-center justify-center text-white font-bold">2</div>
                <h2 className="text-xl font-bold text-[#1d2b3e] font-headline">Preparation</h2>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#1d2b3e]" htmlFor="notes">Notes for the Mentor</label>
                <textarea
                  className="w-full p-4 rounded-xl border-none bg-[#eae1dc] focus:bg-white focus:ring-1 focus:ring-[#1d2b3e]/20 transition-all placeholder:text-[#75777d] text-[#1f1b18]"
                  id="notes"
                  placeholder="What are the key challenges or goals you'd like to discuss during this 1-on-1?"
                  rows="4"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <p className="text-xs text-[#505f76] italic">This helps your mentor prepare tailored insights for your career journey.</p>
              </div>
            </section>

            {/* Step 3: Payment Method (Static) */}
            <section className="p-8 rounded-xl bg-[#fbf2ed] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1d2b3e] flex items-center justify-center text-white font-bold">3</div>
                <h2 className="text-xl font-bold text-[#1d2b3e] font-headline">Payment Method</h2>
              </div>
              <div className="p-4 rounded-xl bg-white flex items-center justify-between border border-[#c5c6cd]/15">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-slate-100 rounded flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-400">CARD</span>
                  </div>
                  <span className="font-medium text-[#1d2b3e]">•••• •••• •••• 4242</span>
                </div>
                <button className="text-sm font-bold text-[#004944] hover:underline">Change</button>
              </div>
            </section>
          </div>

          {/* Right Column: Summary Card */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="p-8 rounded-2xl bg-white shadow-[0px_20px_40px_rgba(31,27,24,0.06)] border border-[#c5c6cd]/10 space-y-8">
              <h3 className="text-2xl font-bold text-[#1d2b3e] font-headline">Session Summary</h3>
              
              <div className="flex items-start gap-5 pb-8 border-b border-[#c5c6cd]/15">
                <img
                  alt="Mentor Profile"
                  className="w-20 h-20 rounded-xl object-cover"
                  src={mentor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.displayName || mentor.name)}&size=80&background=random`}
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-[#1d2b3e]">{mentor.displayName || mentor.name}</h4>
                  <p className="text-sm text-[#505f76]">{mentor.jobTitle || 'Mentor'}</p>
                  <div className="flex items-center gap-1 text-[#004944] mt-2">
                    <Verified className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Elite Mentor</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[#505f76]">
                  <span>{service ? service.title : '1-on-1 Strategy Session'}</span>
                  <span className="font-medium text-[#1d2b3e]">
                    {service?.isFree ? 'Free' : `₹${basePrice}`}
                  </span>
                </div>
                {couponResult?.valid && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                {/* 
                <div className="flex justify-between items-center text-[#505f76]">
                  <span>Platform Service Fee</span>
                  <span className="font-medium text-[#1d2b3e]">$12.50</span>
                </div> 
                */}
                <div className="pt-4 border-t border-dashed border-[#c5c6cd]/30 flex justify-between items-center">
                  <span className="text-lg font-bold text-[#1d2b3e] font-headline">Total</span>
                  <span className="text-2xl font-black text-[#1d2b3e] font-headline">
                    {service?.isFree ? 'Free' : `₹${total}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button
                  onClick={handleConfirmBooking}
                  disabled={isSubmitting}
                  className="premium-gradient w-full py-5 rounded-xl text-white font-bold text-lg shadow-xl hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      Confirm & Pay
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-[#505f76] px-6 leading-relaxed">
                  By clicking "Confirm & Pay", you agree to our <a className="underline" href="#">Booking Terms</a> and <a className="underline" href="#">Cancellation Policy</a>.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 mt-6 border-t border-[#c5c6cd]/15 grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <Lock size={20} className="text-[#004944]" />
                  <span className="text-[10px] font-bold text-[#505f76] uppercase tracking-widest">SSL Secure</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <ThumbsUp size={20} className="text-[#004944]" />
                  <span className="text-[10px] font-bold text-[#505f76] uppercase tracking-widest">Satisfaction Guarantee</span>
                </div>
              </div>
            </div>

            {/* Assistance Widget */}
            <div className="mt-8 p-6 rounded-xl bg-[#004944]/5 border border-[#004944]/10 flex items-center gap-4">
              <HelpCircle size={24} className="text-[#004944]" />
              <div>
                <p className="text-sm font-bold text-[#1d2b3e]">Need help with your booking?</p>
                <a className="text-xs font-medium text-[#004944] underline underline-offset-2" href="#">Chat with our Navigator Support</a>
              </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
