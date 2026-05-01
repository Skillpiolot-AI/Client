import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Lightbulb, Video, Download, Loader2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import config from '../../../config';

const API_URL = config.API_BASE_URL;

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const stateData = location.state || {};
  const [booking, setBooking] = useState(null);
  const [mentor, setMentor] = useState(stateData.mentor || null);
  const [service, setService] = useState(stateData.service || null);
  const [loading, setLoading] = useState(!!sessionId);
  const [error, setError] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // 🎉 Confetti on mount
  useEffect(() => {
    import('canvas-confetti').then(mod => {
      const confetti = mod.default;
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#004944', '#1d2b3e', '#9cf2e8', '#fbf2ed'] });
      setTimeout(() => confetti({ particleCount: 60, spread: 120, origin: { y: 0.5 } }), 400);
    }).catch(() => {});
  }, []);

  // Confirm payment if session_id is present (paid flow)
  useEffect(() => {
    if (!sessionId) return;
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }

    axios.post(`${API_URL}/payments/confirm-booking`, { sessionId }, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        setBooking(data.booking);
        if (data.booking?.mentorProfileId) {
          setMentor(data.booking.mentorProfileId);
        }
        if (data.booking?.serviceId) {
          setService(data.booking.serviceId);
        }
      })
      .catch(err => setError(err.response?.data?.error || 'Could not confirm booking.'))
      .finally(() => setLoading(false));
  }, [sessionId]);

  const handleDownloadInvoice = async () => {
    if (!booking) return;
    setInvoiceLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_URL}/payments/invoice/${booking.bookingId || booking._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${booking.bookingId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Failed to download invoice'); }
    setInvoiceLoading(false);
  };

  // Resolve display values
  const displayMentor = mentor || stateData.mentor;
  const displayService = service || stateData.service;
  const scheduledAt = booking?.scheduledAt || stateData.scheduledAt;
  const date = stateData.date || (scheduledAt ? new Date(scheduledAt).toISOString().split('T')[0] : '');
  const time = stateData.time || (scheduledAt ? new Date(scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '');

  const getFullDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : '';

  if (loading) return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center flex-col gap-4">
      <Loader2 size={40} className="animate-spin text-[#004944]" />
      <p className="text-[#505f76] font-medium">Confirming your payment...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#fff8f5] flex items-center justify-center flex-col gap-4 px-6 text-center">
      <AlertCircle size={48} className="text-red-500" />
      <h2 className="text-2xl font-bold text-[#1d2b3e]">Something went wrong</h2>
      <p className="text-[#505f76] max-w-md">{error}</p>
      <button onClick={() => navigate('/my-bookings')} className="mt-4 bg-[#1d2b3e] text-white px-6 py-3 rounded-xl font-bold">View My Bookings</button>
    </div>
  );

  if (!displayMentor && !date) return (
    <div className="pt-32 text-center">
      <h2 className="text-2xl font-bold">No booking details found</h2>
      <button onClick={() => navigate('/')} className="mt-4 bg-[#1d2b3e] text-white px-6 py-2 rounded-xl">Go Home</button>
    </div>
  );

  const isPaid = booking?.paymentStatus === 'paid' || (sessionId && !stateData.isFree);

  return (
    <div className="bg-[#fff8f5] min-h-screen text-[#1f1b18] font-body">
      <main className="min-h-screen pt-8 pb-20 px-6 flex flex-col items-center justify-center">

        {/* Hero */}
        <section className="w-full max-w-3xl text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-[#9cf2e8] text-[#00312d] animate-bounce">
            <CheckCircle size={40} className="stroke-2" />
          </div>
          <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-[#1d2b3e] tracking-tight mb-4">You're all set!</h1>
          <p className="text-[#44474c] text-lg max-w-lg mx-auto leading-relaxed">
            {isPaid ? 'Payment successful! Your session is confirmed and a beautiful confirmation email is on its way.' : 'Your mentorship session has been confirmed. A confirmation email has been sent.'}
          </p>
          {isPaid && booking && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-bold">
              ✅ Payment Confirmed · Booking #{booking.bookingId}
            </div>
          )}
        </section>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Card */}
          <div className="md:col-span-8 bg-white p-8 rounded-3xl shadow-[0px_20px_40px_rgba(31,27,24,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#eae1dc]">
                    <img src={displayMentor?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayMentor?.displayName || displayMentor?.name || 'Mentor')}&size=80&background=random`}
                      alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-xl text-[#1d2b3e]">{displayMentor?.displayName || displayMentor?.name}</h3>
                    <p className="text-[#44474c] text-sm font-medium">{displayMentor?.jobTitle || 'Mentor'}</p>
                  </div>
                </div>
                <div className="bg-[#fbf2ed] px-4 py-2 rounded-full">
                  <span className="text-[#1d2b3e] font-bold font-headline text-sm">{displayService?.duration || 60} MIN</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d0e1fb]/30 flex items-center justify-center text-[#505f76]"><Calendar size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-[#44474c] uppercase tracking-widest mb-1">Date & Time</p>
                    <p className="text-[#1d2b3e] font-semibold text-lg">{getFullDate(date)}</p>
                    <p className="text-[#44474c]">{time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d0e1fb]/30 flex items-center justify-center text-[#505f76]"><Video size={20} /></div>
                  <div>
                    <p className="text-xs font-bold text-[#44474c] uppercase tracking-widest mb-1">Meeting</p>
                    <p className="text-[#1d2b3e] font-semibold text-lg">Jitsi Video Call</p>
                    <p className="text-[#44474c] text-sm">Link was sent to your email. Active 5 min before start.</p>
                  </div>
                </div>
                {isPaid && booking && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">💳</div>
                    <div>
                      <p className="text-xs font-bold text-[#44474c] uppercase tracking-widest mb-1">Amount Paid</p>
                      <p className="text-[#1d2b3e] font-semibold text-lg">₹{booking.paidAmount}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              {isPaid && booking && (
                <button onClick={handleDownloadInvoice} disabled={invoiceLoading}
                  className="bg-[#1d2b3e] text-white px-8 py-4 rounded-full font-headline font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all shadow-md disabled:opacity-60">
                  {invoiceLoading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  Download Invoice
                </button>
              )}
              <button onClick={() => navigate('/my-bookings')} className="bg-[#fbf2ed] text-[#1d2b3e] px-8 py-4 rounded-full font-headline font-bold flex items-center justify-center hover:bg-[#f0e6e2] transition-all active:scale-95">
                View My Bookings
              </button>
            </div>
          </div>

          {/* Tip Sidebar */}
          <div className="md:col-span-4">
            <div className="bg-[#00312d] text-white p-8 rounded-3xl h-full flex flex-col justify-center">
              <Lightbulb size={36} className="text-[#9cf2e8] mb-4" />
              <h4 className="font-headline font-bold text-xl mb-4 text-[#9cf2e8]">Quick Tip</h4>
              <p className="text-white/80 leading-relaxed mb-6">
                Review your current CV and have 3 specific questions ready for {displayMentor?.displayName || 'your mentor'} to maximize your session time.
              </p>
              <a className="text-[#9cf2e8] font-bold text-sm underline underline-offset-4 hover:text-white transition-colors" href="#">Download Preparation Guide</a>
            </div>
          </div>
        </div>

        {/* Reschedule Banner */}
        <div className="w-full max-w-4xl mt-20 p-10 bg-[#fbf2ed] rounded-3xl">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="text-center md:text-left">
              <h4 className="font-headline font-bold text-[#1d2b3e] mb-2">Need to reschedule?</h4>
              <p className="text-[#44474c] text-sm">You can change your booking up to 24 hours before the session start time without any fees.</p>
            </div>
            <div className="flex gap-4">
              <Link to="/my-bookings" className="text-[#1d2b3e] font-bold text-sm border-b-2 border-[#1d2b3e]/20 hover:border-[#1d2b3e] transition-all pb-1">Manage Booking</Link>
              <button className="text-[#1d2b3e] font-bold text-sm border-b-2 border-[#1d2b3e]/20 hover:border-[#1d2b3e] transition-all pb-1">Contact Support</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
