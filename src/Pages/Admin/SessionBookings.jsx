import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config from '../../config';

export default function SessionBookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [activeTab, setActiveTab] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [activeTab, pagination.page, searchQuery]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (activeTab !== 'all') params.status = activeTab;
      if (searchQuery) params.search = searchQuery; // Backend might need search support, or we filter locally if backend doesn't support. 
      // Note: backend getAllBookings has mentorId, userId filters but no search string explicitly. 
      // We will fetch and filter if searching, or just pass if backend handles it.

      const response = await axios.get(`${config.API_BASE_URL}/bookings/admin/all-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      setBookings(response.data.bookings);
      setStats(response.data.stats || {});
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total,
        pages: response.data.pagination.pages
      }));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load sessions data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
    toast.success('Sessions list synchronized');
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-tertiary-fixed text-on-tertiary-fixed border border-on-tertiary-fixed-variant/20';
      case 'pending':
        return 'bg-secondary-fixed text-on-secondary-fixed border border-on-secondary-fixed-variant/20';
      case 'completed':
        return 'bg-surface-container-highest text-on-surface-variant border border-outline-variant/10';
      case 'cancelled':
      case 'rejected':
        return 'bg-error-container text-on-error-container border border-error/10';
      default:
        return 'bg-surface-container-high text-on-surface';
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
  };

  if (loading && !refreshing) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary mb-2">sync</span>
          <p className="text-secondary font-body">Loading session data streams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <main className="pt-24 pb-12 px-6 lg:px-12 max-w-[1600px] mx-auto">
        {/* Dashboard Header Section */}
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs font-bold text-primary tracking-[0.05em] uppercase block mb-2 font-label">Management Console</span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-primary tracking-tight font-headline">Session Bookings</h1>
            <p className="text-on-surface-variant mt-4 max-w-2xl leading-relaxed">
              Oversee and orchestrate all mentorship engagements within the ecosystem. Monitor status, manage scheduling conflicts, and ensure professional delivery standards.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="bg-surface-container-lowest text-primary font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-2 border border-outline-variant/15">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Export Report
            </button>
            <button onClick={handleRefresh} className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors">
              <span className={`material-symbols-outlined text-primary ${refreshing ? 'animate-spin' : ''}`}>sync</span>
            </button>
          </div>
        </section>

        {/* Filters & Analytics Highlights */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase font-label">Active Sessions</span>
            <span className="text-3xl font-extrabold text-primary">{stats.confirmed || 0}</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase font-label">Pending Approval</span>
            <span className="text-3xl font-extrabold text-primary">{stats.pending || 0}</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase font-label">Completed</span>
            <span className="text-3xl font-extrabold text-primary">{stats.completed || 0}</span>
          </div>
          <div className="bg-surface-container-low p-6 rounded-2xl flex flex-col justify-between min-h-[120px]">
            <span className="text-xs font-bold text-on-surface-variant tracking-wider uppercase font-label">Canceled</span>
            <span className="text-3xl font-extrabold text-error">{stats.cancelled || stats.rejected || 0}</span>
          </div>
        </section>

        {/* Master Table Section */}
        <section className="bg-surface-container-lowest rounded-3xl shadow-[0px_20px_40px_rgba(31,27,24,0.04)] overflow-hidden border border-outline-variant/10">
          {/* Table Header / Search & Filters */}
          <div className="p-6 border-b border-outline-variant/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-full w-fit">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setPagination(p => ({ ...p, page: 1 })); }}
                  className={`px-5 py-2 text-sm font-semibold rounded-full capitalize transition-all ${
                    activeTab === tab
                      ? 'bg-surface-container-lowest text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex-grow md:flex-grow-0">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
                <input
                  type="text"
                  placeholder="Filter sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-container-high border-none rounded-xl pl-10 pr-4 py-2.5 text-sm w-full md:w-72 focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* The Master Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/40">
                  <th className="px-6 py-4 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant font-label">Mentee</th>
                  <th className="px-6 py-4 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant font-label">Mentor</th>
                  <th className="px-6 py-4 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant font-label">Session</th>
                  <th className="px-6 py-4 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant font-label">Date & Time</th>
                  <th className="px-6 py-4 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant font-label">Duration</th>
                  <th className="px-6 py-4 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant font-label">Status</th>
                  <th className="px-6 py-4 text-[0.7rem] font-bold uppercase tracking-widest text-on-surface-variant font-label text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {bookings.length > 0 ? (
                  bookings.map((booking) => {
                    const dt = formatDateTime(booking.scheduledAt);
                    return (
                      <tr key={booking._id} className="hover:bg-surface-container-low/30 transition-colors group">
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-primary text-sm">{booking.userId?.name || 'Unknown User'}</p>
                            <p className="text-xs text-on-surface-variant">{booking.userId?.email || ''}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div>
                            <p className="font-semibold text-primary text-sm">{booking.mentorProfileId?.displayName || booking.mentorId?.name || 'Unknown Mentor'}</p>
                            <p className="text-xs text-on-surface-variant">{booking.mentorId?.email || ''}</p>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-primary font-medium">{booking.serviceId?.title || 'Mentorship Session'}</span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-primary">{dt.date}</p>
                          <p className="text-xs text-on-surface-variant">{dt.time}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm text-on-surface-variant">{booking.duration} Mins</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(booking.status)}`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button className="text-primary font-bold text-xs hover:underline uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100">View</button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-secondary">
                      No matching sessions index found in environment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          {pagination.pages > 1 && (
            <div className="px-6 py-5 border-t border-outline-variant/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-medium text-on-surface-variant">Showing page {pagination.page} of {pagination.pages}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setPagination(p => ({ ...p, page }))}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                      pagination.page === page ? 'bg-primary text-white' : 'hover:bg-surface-container-low'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => setPagination(p => ({ ...p, page: Math.min(pagination.pages, p.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 rounded-lg border border-outline-variant/20 hover:bg-surface-container-low transition-colors disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
