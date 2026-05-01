import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../AuthContext';
import axios from 'axios';
import config from '../../../config';
import {
  Search, Download, Filter, ChevronLeft, ChevronRight,
  Loader2, Receipt, TrendingUp, ArrowUpRight, ArrowDownLeft,
  RotateCcw, AlertCircle, CheckCircle2, XCircle, Calendar,
  CreditCard, Tag, User, RefreshCw, ExternalLink
} from 'lucide-react';

const API = config.API_BASE_URL;
const getToken = () => localStorage.getItem('token');
const authH = () => ({ Authorization: `Bearer ${getToken()}` });

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS = {
  paid:     { label: 'Paid',     icon: CheckCircle2, color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200' },
  refunded: { label: 'Refunded', icon: RotateCcw,    color: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-200'    },
  failed:   { label: 'Failed',   icon: XCircle,       color: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-200'     },
  pending:  { label: 'Pending',  icon: AlertCircle,   color: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-200'   },
};

const SERVICE_EMOJI = {
  one_on_one: '🎥', quick_chat: '⚡', mock_interview: '🎯',
  career_guidance: '🧭', discovery_call: '🌱', priority_dm: '💬',
  resume_review: '📄', portfolio_review: '🖼️', ama: '🙋',
  referral: '🤝', course: '📚', workshop: '👥',
  coaching_series: '🗓️', webinar: '🖥️', custom: '✨',
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS[status] || STATUS.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon size={11} /> {cfg.label}
    </span>
  );
};

// ─── Summary Card ─────────────────────────────────────────────────────────────
const SummaryCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={18} />
      </div>
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-2xl font-extrabold text-slate-800">{value}</p>
    {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
  </div>
);

export default function PaymentHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [invoiceLoading, setInvoiceLoading] = useState({});

  const isAdmin = user?.role === 'Admin';
  const isMentor = user?.role === 'Mentor';

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, limit: 15 });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);

      const { data } = await axios.get(`${API}/payments/history?${params}`, { headers: authH() });
      setTransactions(data.transactions || []);
      setSummary(data.summary);
      setPagination(data.pagination);
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to load payment history');
    } finally {
      setLoading(false);
    }
  }, [user, page, statusFilter, search, dateFrom, dateTo]);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    fetchHistory();
  }, [fetchHistory]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const handleDownloadInvoice = async (tx) => {
    setInvoiceLoading(p => ({ ...p, [tx._id]: true }));
    try {
      const res = await axios.get(`${API}/payments/invoice/${tx.bookingId || tx._id}`, {
        headers: authH(), responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url; a.download = `invoice-${tx.bookingId}.pdf`; a.click();
      URL.revokeObjectURL(url);
    } catch { alert('Failed to download invoice'); }
    setInvoiceLoading(p => ({ ...p, [tx._id]: false }));
  };

  const fmt = (n) => `₹${(n || 0).toLocaleString('en-IN')}`;
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const fmtTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {isAdmin ? '🏦 All Payment Transactions' : isMentor ? '💰 Earnings History' : '🧾 Payment History'}
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {isAdmin ? 'Complete platform-wide payment ledger' : isMentor ? 'All payments received for your mentorship sessions' : 'Your booking payment records'}
            </p>
          </div>
          <button onClick={fetchHistory} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className={`grid grid-cols-2 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'} gap-4 mb-8`}>
            <SummaryCard icon={Receipt} label="Total Transactions" value={summary.totalTransactions} color="bg-indigo-50 text-indigo-600" />
            <SummaryCard icon={TrendingUp} label={isAdmin ? 'Total Revenue' : isMentor ? 'Earnings' : 'Total Paid'} value={fmt(isAdmin ? summary.totalRevenue : isMentor ? summary.mentorRevenue : summary.totalRevenue)} color="bg-emerald-50 text-emerald-600" />
            {isAdmin && <SummaryCard icon={ArrowUpRight} label="Platform Revenue (15%)" value={fmt(summary.platformRevenue)} color="bg-purple-50 text-purple-600" sub="After mentor payouts" />}
            <SummaryCard icon={RotateCcw} label="Total Refunded" value={fmt(summary.totalRefunded)} color="bg-red-50 text-red-500" />
          </div>
        )}

        {/* Filters Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 mb-6 flex flex-wrap gap-3 items-center shadow-sm">
          {/* Search */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex-1 min-w-[200px]">
            <Search size={15} className="text-slate-400" />
            <input
              value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder={isAdmin ? 'Search by student, mentor, service, booking ID…' : 'Search by service, booking ID…'}
              className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
            <Filter size={14} className="text-slate-400" />
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-transparent text-sm text-slate-700 outline-none cursor-pointer">
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none" />
            <span className="text-slate-400 text-sm">to</span>
            <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 outline-none" />
          </div>

          {(search || statusFilter !== 'all' || dateFrom || dateTo) && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setDateFrom(''); setDateTo(''); setPage(1); }}
              className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors px-2 underline underline-offset-2">
              Clear filters
            </button>
          )}
        </div>

        {/* Transactions Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 size={36} className="animate-spin text-indigo-500" />
            <p className="text-slate-400 font-medium">Loading transactions…</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <XCircle size={36} className="text-red-400 mx-auto mb-3" />
            <p className="text-red-700 font-bold">{error}</p>
            <button onClick={fetchHistory} className="mt-4 text-sm text-red-600 underline">Retry</button>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-16 text-center">
            <CreditCard size={48} className="text-slate-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No transactions found</h3>
            <p className="text-slate-400 text-sm">
              {search || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Payment records will appear here once bookings are made.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Transaction</th>
                    {isAdmin && <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Student</th>}
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {isMentor ? 'Student' : 'Mentor'}
                    </th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Service</th>
                    <th className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                    {isAdmin && <th className="text-right px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Platform</th>}
                    <th className="text-center px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-center px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx, i) => (
                    <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Booking ID */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                            <Receipt size={14} />
                          </div>
                          <div>
                            <p className="font-mono text-xs font-bold text-slate-600">{tx.bookingId}</p>
                            {tx.couponId && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded font-bold mt-0.5">
                                <Tag size={9} /> {tx.couponId.code}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Student (admin view) */}
                      {isAdmin && (
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <img src={tx.userId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(tx.userId?.name || 'U')}&size=32&background=random`}
                              className="w-7 h-7 rounded-full object-cover" alt="" />
                            <div>
                              <p className="text-sm font-semibold text-slate-700 leading-tight">{tx.userId?.name}</p>
                              <p className="text-xs text-slate-400">{tx.userId?.email}</p>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Mentor / Student */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={isMentor
                              ? (tx.userId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(tx.userId?.name || 'U')}&size=32&background=random`)
                              : (tx.mentorProfileId?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(tx.mentorProfileId?.displayName || 'M')}&size=32&background=random`)}
                            className="w-7 h-7 rounded-full object-cover" alt="" />
                          <div>
                            <p className="text-sm font-semibold text-slate-700 leading-tight">
                              {isMentor ? tx.userId?.name : tx.mentorProfileId?.displayName}
                            </p>
                            <p className="text-xs text-slate-400">
                              {isMentor ? tx.userId?.email : (tx.mentorProfileId?.handle ? `@${tx.mentorProfileId.handle}` : '')}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span>{SERVICE_EMOJI[tx.serviceId?.serviceType] || '📋'}</span>
                          <div>
                            <p className="text-sm font-semibold text-slate-700 leading-tight">{tx.serviceId?.title || 'Session'}</p>
                            {tx.serviceId?.duration && <p className="text-xs text-slate-400">{tx.serviceId.duration} min</p>}
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-600 font-medium">{fmtDate(tx.createdAt || tx.scheduledAt)}</p>
                        <p className="text-xs text-slate-400">{fmtTime(tx.createdAt || tx.scheduledAt)}</p>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-4 text-right">
                        <p className="text-base font-extrabold text-slate-800">{fmt(tx.paidAmount)}</p>
                        {tx.originalPrice > tx.paidAmount && (
                          <p className="text-xs text-slate-400 line-through">{fmt(tx.originalPrice)}</p>
                        )}
                      </td>

                      {/* Platform fee (admin) */}
                      {isAdmin && (
                        <td className="px-5 py-4 text-right">
                          <p className="text-sm font-bold text-purple-700">{fmt(tx.platformFee)}</p>
                          <p className="text-xs text-slate-400">Mentor: {fmt(tx.mentorEarning)}</p>
                        </td>
                      )}

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={tx.paymentStatus} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {tx.paymentStatus === 'paid' && (
                            <button onClick={() => handleDownloadInvoice(tx)} disabled={invoiceLoading[tx._id]}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-all"
                              title="Download Invoice">
                              {invoiceLoading[tx._id] ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                              Invoice
                            </button>
                          )}
                          {tx.mentorProfileId?.handle && (
                            <button onClick={() => navigate(`/mentor/${tx.mentorProfileId.handle}`)}
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-indigo-600 transition-all" title="View mentor">
                              <ExternalLink size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {transactions.map((tx) => (
                <div key={tx._id} className="bg-white rounded-2xl border border-slate-200/60 p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-xs font-bold text-slate-500">{tx.bookingId}</p>
                      <p className="font-bold text-slate-800 mt-1">{tx.serviceId?.title || 'Session'}</p>
                    </div>
                    <StatusBadge status={tx.paymentStatus} />
                  </div>
                  <div className="space-y-1 text-sm text-slate-600 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">
                        {isMentor ? 'Student' : 'Mentor'}
                      </span>
                      <span className="font-semibold">
                        {isMentor ? tx.userId?.name : tx.mentorProfileId?.displayName}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Student</span>
                        <span className="font-semibold">{tx.userId?.name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-400">Date</span>
                      <span>{fmtDate(tx.createdAt || tx.scheduledAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amount</span>
                      <span className="font-extrabold text-slate-800">{fmt(tx.paidAmount)}</span>
                    </div>
                    {isAdmin && tx.platformFee > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Platform Fee</span>
                        <span className="text-purple-700 font-bold">{fmt(tx.platformFee)}</span>
                      </div>
                    )}
                    {tx.couponId && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Coupon</span>
                        <span className="text-green-700 font-bold">{tx.couponId.code}</span>
                      </div>
                    )}
                  </div>
                  {tx.paymentStatus === 'paid' && (
                    <button onClick={() => handleDownloadInvoice(tx)} disabled={invoiceLoading[tx._id]}
                      className="w-full flex items-center justify-center gap-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-sm font-bold transition-all">
                      {invoiceLoading[tx._id] ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                      Download Invoice
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6 bg-white rounded-2xl border border-slate-200/60 px-5 py-3 shadow-sm">
                <p className="text-sm text-slate-500">
                  Showing <strong>{transactions.length}</strong> of <strong>{pagination.total}</strong> transactions
                </p>
                <div className="flex items-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-slate-700 px-2">{page} / {pagination.pages}</span>
                  <button disabled={page >= pagination.pages} onClick={() => setPage(p => p + 1)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
