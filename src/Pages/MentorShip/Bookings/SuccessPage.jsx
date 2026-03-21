import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Calendar, Lightbulb, ArrowLeft, Video } from 'lucide-react';

export default function SuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  const { mentor, date, time, service } = state;

  if (!mentor || !date) {
    return (
      <div className="pt-32 text-center">
        <h2 className="text-2xl font-bold">No booking details found</h2>
        <button onClick={() => navigate('/')} className="mt-4 bg-[#1d2b3e] text-white px-6 py-2 rounded-xl">
          Go Home
        </button>
      </div>
    );
  }

  const getFullDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-[#fff8f5] min-h-screen text-[#1f1b18] font-body">
      <main className="min-h-screen pt-8 pb-20 px-6 flex flex-col items-center justify-center">
        {/* Success Hero Section */}
        <section className="w-full max-w-3xl text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-full bg-[#9cf2e8] text-[#00312d]">
            <CheckCircle size={40} className="stroke-2" />
          </div>
          <h1 className="font-headline font-extrabold text-5xl md:text-6xl text-[#1d2b3e] tracking-tight mb-4">You're all set!</h1>
          <p className="text-[#44474c] text-lg max-w-lg mx-auto leading-relaxed">
            Your mentorship session has been confirmed. A calendar invitation and preparation guide have been sent to your email.
          </p>
        </section>

        {/* Booking Details Card */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Summary Card */}
          <div className="md:col-span-8 bg-white p-8 rounded-3xl shadow-[0px_20px_40px_rgba(31,27,24,0.06)] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-[#eae1dc]">
                    <img
                      src={mentor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.displayName || mentor.name)}&size=80&background=random`}
                      alt={mentor.displayName || mentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-xl text-[#1d2b3e]">{mentor.displayName || mentor.name}</h3>
                    <p className="text-[#44474c] text-sm font-medium">{mentor.jobTitle || 'Mentor'}</p>
                  </div>
                </div>
                <div className="bg-[#fbf2ed] px-4 py-2 rounded-full">
                  <span className="text-[#1d2b3e] font-bold font-headline text-sm tracking-wide">
                    {service?.duration || 60} MIN SESSION
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d0e1fb]/30 flex items-center justify-center text-[#505f76]">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#44474c] uppercase tracking-widest mb-1 font-label">Date & Time</p>
                    <p className="text-[#1d2b3e] font-semibold text-lg">{getFullDate(date)}</p>
                    <p className="text-[#44474c]">{time} (Available in your timezone)</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d0e1fb]/30 flex items-center justify-center text-[#505f76]">
                    <Video size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#44474c] uppercase tracking-widest mb-1 font-label">Location</p>
                    <p className="text-[#1d2b3e] font-semibold text-lg">Google Meet</p>
                    <p className="text-[#44474c]">Link will be active 5 minutes before start</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button className="premium-gradient text-white px-8 py-4 rounded-full font-headline font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-all duration-300 shadow-lg active:scale-95">
                <Calendar size={18} />
                Add to Calendar
              </button>
              <button onClick={() => navigate('/')} className="bg-[#fbf2ed] text-[#1d2b3e] px-8 py-4 rounded-full font-headline font-bold flex items-center justify-center hover:bg-[#f0e6e2] transition-all active:scale-95">
                Return to Dashboard
              </button>
            </div>
          </div>

          {/* Preparation Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-[#00312d] text-white p-8 rounded-3xl h-full flex flex-col justify-center">
              <Lightbulb size={36} className="text-[#9cf2e8] mb-4" />
              <h4 className="font-headline font-bold text-xl mb-4 text-[#9cf2e8]">Quick Tip</h4>
              <p className="text-white/80 leading-relaxed mb-6">
                "Review your current CV and have 3 specific questions ready for {mentor.displayName || mentor.name} to maximize your session time."
              </p>
              <a className="text-[#9cf2e8] font-bold text-sm underline underline-offset-4 hover:text-white transition-colors" href="#">
                Download Preparation Guide
              </a>
            </div>
          </div>
        </div>

        {/* Secondary Info Zone */}
        <div className="w-full max-w-4xl mt-20 p-10 bg-[#fbf2ed] rounded-3xl">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            <div className="text-center md:text-left">
              <h4 className="font-headline font-bold text-[#1d2b3e] mb-2">Need to reschedule?</h4>
              <p className="text-[#44474c] text-sm">You can change your booking up to 24 hours before the session start time without any fees.</p>
            </div>
            <div className="flex gap-4">
              <button className="text-[#1d2b3e] font-bold text-sm border-b-2 border-[#1d2b3e]/20 hover:border-[#1d2b3e] transition-all pb-1">Manage Booking</button>
              <button className="text-[#1d2b3e] font-bold text-sm border-b-2 border-[#1d2b3e]/20 hover:border-[#1d2b3e] transition-all pb-1">Contact Support</button>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}
