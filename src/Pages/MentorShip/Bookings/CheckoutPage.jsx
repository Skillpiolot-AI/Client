import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Lock, Calendar, ShieldCheck,
  ThumbsUp, HelpCircle, ArrowRight, Verified, Loader2, Gift, CreditCard
} from 'lucide-react';
import axios from 'axios';
import config from '../../../config';
import '../MentorFlow.css';

const API_URL = config.API_BASE_URL;

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const { service, mentor, mentorProfileId, couponCode, couponResult } = state;

  const [selectedDate, setSelectedDate] = useState(state.date || '');
  const [selectedTime, setSelectedTime] = useState(state.time || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [dayMessage, setDayMessage] = useState('');

  const isFree = !service || service.isFree || service.price === 0;

  useEffect(() => {
    if (selectedDate && mentor) fetchAvailableSlots(selectedDate);
    else { setSlots([]); setDayMessage(''); }
  }, [selectedDate, mentor]);

  const fetchAvailableSlots = async (dateStr) => {
    setSlotsLoading(true); setSlotsError(null); setDayMessage('');
    try {
      const profileId = mentorProfileId || mentor._id || mentor.id;
      const { data } = await axios.get(`${API_URL}/bookings/available-slots/${profileId}?date=${dateStr}`);
      if (data.isBusyDate || data.isWeeklyUnavailable) { setSlots([]); setDayMessage(data.message || 'Mentor unavailable'); }
      else setSlots(data.slots || []);
    } catch { setSlotsError('Failed to load slots'); setSlots([]); }
    finally { setSlotsLoading(false); }
  };

  if (!mentor) return (
    <div className="pt-32 text-center">
      <h2 className="text-2xl font-bold">Invalid booking state</h2>
      <button onClick={() => navigate(-1)} className="mt-4 bg-[#1d2b3e] text-white px-6 py-2 rounded-xl">Back</button>
    </div>
  );

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) { alert('Please select a Date and Time first.'); return; }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login', { state: { from: location.pathname, bookingState: state } }); return; }

      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

      if (isFree) {
        // Free booking — create directly
        const bookingData = {
          mentorProfileId: mentorProfileId || mentor._id || mentor.id,
          serviceId: service?._id,
          couponCode: couponCode || undefined,
          scheduledAt,
          duration: service?.duration || 60,
          remark: notes.trim(),
          topics: [],
        };
        await axios.post(`${API_URL}/bookings/book`, bookingData, { headers: { Authorization: `Bearer ${token}` } });
        navigate(`/mentor/${mentor.handle || 'profile'}/success`, {
          state: { mentor, date: selectedDate, time: selectedTime, service, scheduledAt, isFree: true },
        });
      } else {
        // Paid — create Stripe Checkout Session
        const { data } = await axios.post(`${API_URL}/payments/create-checkout-session`, {
          mentorProfileId: mentorProfileId || mentor._id || mentor.id,
          serviceId: service._id,
          couponCode: couponCode || undefined,
          scheduledAt,
          notes: notes.trim(),
          topics: [],
        }, { headers: { Authorization: `Bearer ${token}` } });

        // Redirect to Stripe-hosted checkout
        window.location.href = data.url;
      }
    } catch (e) {
      alert(e.response?.data?.error || 'Failed to process booking');
      setIsSubmitting(false);
    }
  };

  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({
        value: date.toISOString().split('T')[0],
        label: i === 0 ? 'Today' : date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
        dayName: date.toLocaleDateString('en-IN', { weekday: 'long' }),
      });
    }
    return days;
  };

  const nextSevenDays = getNextSevenDays();
  const basePrice = service ? (isFree ? 0 : service.price || 0) : 0;
  const discount = couponResult?.valid ? couponResult.discountAmount || 0 : 0;
  const finalPrice = couponResult?.valid ? couponResult.finalPrice : basePrice;
  const total = finalPrice;

  return (
    <div className="bg-[#fff8f5] min-h-screen text-[#1f1b18] font-body">
      <main className="pt-8 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Left Column */}
          <div className="lg:col-span-7 space-y-10">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#1d2b3e] tracking-tight leading-tight font-headline">
                Confirm Your <span className="text-[#004944]">Session</span>
              </h1>
              <p className="text-[#505f76] text-lg max-w-xl leading-relaxed">
                {isFree ? "This session is free — no payment required." : "You're one step away from expert guidance."}
              </p>
            </header>

            {/* Step 1: Schedule */}
            <section className="p-8 rounded-xl bg-[#fbf2ed] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1d2b3e] flex items-center justify-center text-white font-bold">1</div>
                <h2 className="text-xl font-bold text-[#1d2b3e] font-headline">Session Schedule</h2>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-[#1d2b3e]">Select Date</label>
                <div className="flex overflow-x-auto gap-3 pb-3 scroll-smooth select-none">
                  {nextSevenDays.map((day) => (
                    <button key={day.value} onClick={() => setSelectedDate(day.value)}
                      className={`flex-shrink-0 p-3 rounded-xl border-2 text-center transition-all w-24 ${selectedDate === day.value ? 'bg-[#1d2b3e] text-white border-[#1d2b3e]' : 'bg-white text-[#1d2b3e] border-[#c5c6cd]/15 hover:border-[#1d2b3e]/30'}`}>
                      <p className="text-xs font-bold uppercase tracking-wider">{day.label}</p>
                      <p className="text-sm font-medium mt-1 opacity-70">{day.dayName.slice(0, 3)}</p>
                    </button>
                  ))}
                </div>
                <label className="block text-sm font-semibold text-[#1d2b3e] mt-4">Select Time</label>
                {slotsLoading ? (
                  <div className="flex items-center gap-2 text-[#505f76] text-sm"><Loader2 className="animate-spin w-4 h-4" /> Loading slots...</div>
                ) : slotsError ? <p className="text-red-500 text-sm">{slotsError}</p>
                : dayMessage ? <p className="text-[#505f76] text-sm italic">{dayMessage}</p>
                : slots.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {slots.map((slot, idx) => (
                      <button key={idx} disabled={!slot.isAvailable} onClick={() => setSelectedTime(slot.time)}
                        className={`p-2 rounded-lg text-sm font-semibold border transition-all ${!slot.isAvailable ? 'bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed' : selectedTime === slot.time ? 'bg-[#004944] text-white border-[#004944]' : 'bg-white text-[#1d2b3e] border-[#c5c6cd]/15 hover:border-[#004944]/40'}`}>
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : <p className="text-[#505f76] text-sm italic">Please select a date above to see available slots.</p>}
              </div>
            </section>

            {/* Step 2: Notes */}
            <section className="p-8 rounded-xl bg-[#fbf2ed] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1d2b3e] flex items-center justify-center text-white font-bold">2</div>
                <h2 className="text-xl font-bold text-[#1d2b3e] font-headline">Preparation</h2>
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#1d2b3e]" htmlFor="notes">Notes for the Mentor</label>
                <textarea id="notes" rows="4" value={notes} onChange={e => setNotes(e.target.value)} placeholder="What challenges or goals would you like to discuss?"
                  className="w-full p-4 rounded-xl border-none bg-[#eae1dc] focus:bg-white focus:ring-1 focus:ring-[#1d2b3e]/20 transition-all placeholder:text-[#75777d] text-[#1f1b18]" />
              </div>
            </section>

            {/* Step 3: Payment */}
            <section className="p-8 rounded-xl bg-[#fbf2ed] space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1d2b3e] flex items-center justify-center text-white font-bold">3</div>
                <h2 className="text-xl font-bold text-[#1d2b3e] font-headline">Payment</h2>
              </div>
              {isFree ? (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-4">
                  <Gift size={28} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-green-800">🎉 This session is completely free!</p>
                    <p className="text-sm text-green-700 mt-1">No payment required — just confirm your slot and you're all set.</p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white border border-[#c5c6cd]/15 flex items-center gap-4">
                  <CreditCard size={28} className="text-[#004944] flex-shrink-0" />
                  <div>
                    <p className="font-bold text-[#1d2b3e]">Secure Payment via Stripe</p>
                    <p className="text-sm text-[#505f76] mt-1">You'll be redirected to Stripe's secure checkout page to complete payment.</p>
                  </div>
                  <div className="ml-auto">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" className="h-6 opacity-60" />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right: Summary Card */}
          <div className="lg:col-span-5 sticky top-32">
            <div className="p-8 rounded-2xl bg-white shadow-[0px_20px_40px_rgba(31,27,24,0.06)] border border-[#c5c6cd]/10 space-y-8">
              <h3 className="text-2xl font-bold text-[#1d2b3e] font-headline">Session Summary</h3>
              <div className="flex items-start gap-5 pb-8 border-b border-[#c5c6cd]/15">
                <img alt="Mentor" className="w-20 h-20 rounded-xl object-cover"
                  src={mentor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.displayName || mentor.name)}&size=80&background=random`} />
                <div className="space-y-1">
                  <h4 className="font-bold text-[#1d2b3e]">{mentor.displayName || mentor.name}</h4>
                  <p className="text-sm text-[#505f76]">{mentor.jobTitle || 'Mentor'}</p>
                  <div className="flex items-center gap-1 text-[#004944] mt-2">
                    <Verified className="w-4 h-4 fill-current" />
                    <span className="text-xs font-bold uppercase tracking-tighter">Verified Mentor</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[#505f76]">
                  <span>{service ? service.title : '1-on-1 Session'}</span>
                  <span className="font-medium text-[#1d2b3e]">{isFree ? 'Free' : `₹${basePrice}`}</span>
                </div>
                {couponResult?.valid && (
                  <div className="flex justify-between items-center text-green-600">
                    <span>Discount ({couponCode})</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                <div className="pt-4 border-t border-dashed border-[#c5c6cd]/30 flex justify-between items-center">
                  <span className="text-lg font-bold text-[#1d2b3e] font-headline">Total</span>
                  <span className="text-2xl font-black text-[#1d2b3e] font-headline">
                    {isFree ? '🎉 Free' : `₹${total}`}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <button onClick={handleConfirmBooking} disabled={isSubmitting}
                  className="premium-gradient w-full py-5 rounded-xl text-white font-bold text-lg shadow-xl hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-70">
                  {isSubmitting ? <><Loader2 className="animate-spin" /> Processing...</>
                    : isFree ? <><ShieldCheck size={20} /> Confirm Free Booking</>
                    : <><Lock size={18} /> Pay Securely with Stripe <ArrowRight size={20} /></>}
                </button>
                <p className="text-center text-xs text-[#505f76] px-6 leading-relaxed">
                  {isFree ? 'No charges. Cancel anytime up to 24h before.' : 'Powered by Stripe. Your payment info is never stored on our servers.'}
                </p>
              </div>

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

            <div className="mt-8 p-6 rounded-xl bg-[#004944]/5 border border-[#004944]/10 flex items-center gap-4">
              <HelpCircle size={24} className="text-[#004944]" />
              <div>
                <p className="text-sm font-bold text-[#1d2b3e]">Need help?</p>
                <a className="text-xs font-medium text-[#004944] underline underline-offset-2" href="#">Chat with Navigator Support</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
