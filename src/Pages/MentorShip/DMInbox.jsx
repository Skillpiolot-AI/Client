/**
 * DMInbox.jsx
 * Mentor's Priority DM inbox — shows all threads with full message view.
 * Used as a tab inside MentorDashboardNew.
 */

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../config';
import { Send, X, CheckCheck, Clock, MessageSquare, Loader2, XCircle } from 'lucide-react';

const API = config.API_BASE_URL;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const C = { indigo: '#4F46E5', bg: '#EEF2FF', border: '#E2E8F0', slate: '#64748B', green: '#059669' };

const statusColors = { open: '#D97706', active: '#059669', closed: '#94A3B8', expired: '#EF4444' };
const statusBg    = { open: '#FEF3C7', active: '#ECFDF5', closed: '#F1F5F9', expired: '#FEF2F2' };

function Avatar({ user, size = 36 }) {
  const colors = ['#5B5FEF','#10B981','#F59E0B','#EF4444','#EC4899'];
  const c = colors[(user?.name || 'U').charCodeAt(0) % colors.length];
  if (user?.imageUrl) return <img src={user.imageUrl} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  return <div style={{ width: size, height: size, borderRadius: '50%', background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: size * 0.38 }}>{(user?.name || 'U')[0].toUpperCase()}</div>;
}

function TimeAgo({ date }) {
  const d = new Date(date);
  const diff = Date.now() - d;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return <span>just now</span>;
  if (mins < 60) return <span>{mins}m ago</span>;
  const hours = Math.round(mins / 60);
  if (hours < 24) return <span>{hours}h ago</span>;
  return <span>{d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>;
}

// ─── Full thread conversation view ────────────────────────────────────────────
function ThreadView({ threadId, currentUserId, onClose, onThreadUpdate }) {
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [sending, setSending] = useState(false);
  const [closing, setClosing] = useState(false);
  const bottomRef = useRef(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/dm/${threadId}`, { headers: authHeader() });
      setThread(r.data.thread);
      fetchHistory();
      fetchSuggestions();
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const fetchHistory = async () => {
    try {
      const r = await axios.get(`${API}/dm/${threadId}/history`, { headers: authHeader() });
      if (r.data.success && r.data.hasPreviousThread) {
        setHistory(r.data.previousThread);
      }
    } catch (e) { console.error(e); }
  };

  const fetchSuggestions = async () => {
    try {
      const r = await axios.get(`${API}/dm/suggestions?role=mentor`, { headers: authHeader() });
      if (r.data.success) {
        setSuggestions(r.data.suggestions || []);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { load(); }, [threadId]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread?.messages]);

  const send = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await axios.post(`${API}/dm/${threadId}/messages`, { content: reply.trim() }, { headers: authHeader() });
      setReply('');
      load();
      onThreadUpdate?.();
    } catch (e) { alert(e.response?.data?.error || 'Send failed'); }
    setSending(false);
  };

  const closeThread = async () => {
    if (!confirm('Close this thread? The mentee won\'t be able to reply further.')) return;
    setClosing(true);
    try {
      await axios.put(`${API}/dm/${threadId}/close`, {}, { headers: authHeader() });
      load();
      onThreadUpdate?.();
    } catch (e) { console.error(e); }
    setClosing(false);
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}><Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} color={C.indigo} /></div>;
  if (!thread) return null;

  const isClosed = thread.status === 'closed' || thread.status === 'expired';
  const menteeObj = thread.menteeId;

  return (
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="p-4 bg-white border-b border-slate-200/50 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all lg:hidden">
            <X size={18} />
          </button>
          <Avatar user={menteeObj} size={40} />
          <div className="overflow-hidden">
            <h4 className="font-bold text-slate-800 text-sm truncate">{menteeObj?.name}</h4>
            <p className="text-xs text-slate-500 truncate leading-tight mt-0.5">{thread.subject}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${
            thread.status === 'active' ? 'bg-green-100 text-green-800' :
            thread.status === 'open' ? 'bg-amber-100 text-amber-800' :
            'bg-slate-100 text-slate-600'
          }`}>
            {thread.status}
          </span>
          {!isClosed && (
            <button onClick={closeThread} disabled={closing} title="Close thread" className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              <XCircle size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Response Deadline */}
      {thread.responseDeadline && !thread.mentorRepliedAt && (
        <div className="bg-amber-50 px-5 py-2 border-b border-amber-100/50 text-xxs font-bold text-amber-800 flex items-center gap-2">
          <Clock size={12} className="text-amber-600" /> 
          <span>Action Required: Reply by {new Date(thread.responseDeadline).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* History Toggle */}
        {history && (
          <div className="text-center">
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="text-[11px] font-bold text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100/30 transition-all"
            >
              {showHistory ? 'Hide Archives' : 'View 30-Day History'}
            </button>
          </div>
        )}

        {/* History Messages */}
        {showHistory && history && (
          <div className="bg-slate-100/50 p-4 rounded-xl border border-slate-200/40 space-y-3 mb-2">
            <p className="text-[9px] font-bold text-slate-400 text-center uppercase tracking-wider">📜 Archived Conversation</p>
            {history.messages?.map((m, i) => {
              const isMyMsg = m.senderRole === 'mentor';
              return (
                <div key={`hist-${i}`} className={`flex ${isMyMsg ? 'justify-end' : 'justify-start'} gap-2 items-end opacity-60`}>
                  {!isMyMsg && <Avatar user={thread.menteeId} size={24} />}
                  <div className={`max-w-[75%] p-2.5 rounded-xl text-xs ${
                    isMyMsg ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border border-slate-100 text-slate-700 rounded-bl-none shadow-sm'
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Live Messages */}
        {thread.messages.map((m, i) => {
          const isMyMsg = m.senderRole === 'mentor';
          return (
            <div key={i} className={`flex ${isMyMsg ? 'justify-end' : 'justify-start'} gap-2 items-end`}>
              {!isMyMsg && <Avatar user={menteeObj} size={30} />}
              <div className="max-w-[75%]">
                <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  isMyMsg 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-sm shadow-indigo-100' 
                    : 'bg-white border border-slate-200/50 text-slate-800 rounded-bl-none shadow-sm'
                }`}>
                  {m.content}
                </div>
                <div className={`flex items-center gap-1.5 mt-1 text-xxs text-slate-400 ${isMyMsg ? 'justify-end' : 'justify-start'}`}>
                  <TimeAgo date={m.createdAt} />
                  {isMyMsg && m.isRead && <CheckCheck size={12} className="text-green-500" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      {!isClosed ? (
        <div className="p-4 bg-white border-t border-slate-200/50 space-y-3 sticky bottom-0 z-10">
          {suggestions.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setReply(sug)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-full text-[11px] text-slate-600 font-medium transition-all flex-shrink-0 cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-3 items-end">
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Type your reply… (Enter to send)"
              rows={1}
              className="flex-1 bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500/10 outline-none resize-none placeholder:text-slate-400 leading-normal"
            />
            <button onClick={send} disabled={sending || !reply.trim()} className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-sm transition-all disabled:opacity-50">
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-100/80 border-t border-slate-200/40 text-center text-xs font-bold text-slate-500 flex items-center justify-center gap-1.5">
          🔒 Thread is closed
        </div>
      )}
    </div>
  );
}

// ─── Main Inbox ────────────────────────────────────────────────────────────────
export default function DMInbox() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [currentUserId] = useState(() => localStorage.getItem('userId'));

  const load = async () => {
    setLoading(true);
    try {
      const r = await axios.get(`${API}/dm/inbox/mentor?status=${statusFilter}&limit=50`, { headers: authHeader() });
      setThreads(r.data.threads || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [statusFilter]);

  // Poll every 20 seconds when a thread is selected
  useEffect(() => {
    const interval = setInterval(() => { if (selected) load(); }, 20000);
    return () => clearInterval(interval);
  }, [selected]);

  const totalUnread = threads.reduce((sum, t) => sum + (t.unreadByMentor || 0), 0);

  return (
    <div className="flex bg-white rounded-3xl border border-slate-200/40 h-[calc(100vh-160px)] overflow-hidden shadow-sm w-full">
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Thread list */}
      <div className={`w-full md:w-80 border-r border-slate-200/30 flex flex-col bg-slate-50/20 ${selected ? 'hidden md:flex' : 'flex'}`}>
        {/* Header */}
        <div className="p-5 border-b border-slate-200/30 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-base font-bold text-slate-800">Priority DMs</h2>
            {totalUnread > 0 && (
              <span className="bg-red-500 text-white text-xxs font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">{totalUnread}</span>
            )}
          </div>
          {/* Filter pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {['all', 'open', 'active', 'closed'].map(s => (
              <button 
                key={s} 
                onClick={() => setStatusFilter(s)} 
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all flex-shrink-0 cursor-pointer ${
                  statusFilter === s 
                    ? 'bg-indigo-50 border-indigo-200/50 text-indigo-600 border' 
                    : 'border border-slate-200 text-slate-500 hover:bg-slate-50 bg-white'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Thread list body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60 bg-white">
          {loading ? (
            <div className="flex justify-center p-8 text-slate-400"><Loader2 size={24} className="animate-spin" /></div>
          ) : threads.length === 0 ? (
            <div className="text-center p-8 text-slate-400">
              <MessageSquare size={32} className="mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-bold text-slate-500 mb-1">No messages found</p>
              <p className="text-xxs text-slate-400">Offer priority DM service to unlock conversations.</p>
            </div>
          ) : (
            threads.map(t => {
              const isActive = selected === t._id;
              const hasUnread = t.unreadByMentor > 0;
              return (
                <button key={t._id} onClick={() => setSelected(t._id)} className={`block w-full text-left p-4 hover:bg-slate-50/60 transition-all border-l-2 ${isActive ? 'bg-indigo-50/40 border-indigo-600' : 'border-transparent bg-white'}`}>
                  <div className="flex gap-3 items-start">
                    <div className="relative flex-shrink-0">
                      <Avatar user={t.menteeId} size={42} />
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-white">{t.unreadByMentor}</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className={`text-xs ${hasUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>{t.menteeId?.name}</span>
                        <span className="text-[10px] text-slate-400"><TimeAgo date={t.lastMessageAt} /></span>
                      </div>
                      <p className={`text-xs truncate ${hasUnread ? 'font-bold text-slate-800' : 'text-slate-500'}`}>
                        {t.lastMessage?.content || t.subject}
                      </p>
                      <div className="mt-1.5 flex gap-1 items-center">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          t.status === 'active' ? 'bg-green-50 text-green-700' :
                          t.status === 'open' ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'
                        }`}>
                          {t.status}
                        </span>
                        {t.serviceId && <span className="text-[9px] text-slate-400">{t.serviceId.emoji} Priority</span>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Conversation panel */}
      <div className={`flex-1 flex flex-col bg-white ${!selected ? 'hidden md:flex' : 'flex'}`}>
        {selected ? (
          <ThreadView
            threadId={selected}
            currentUserId={currentUserId}
            onClose={() => setSelected(null)}
            onThreadUpdate={load}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/10">
            <MessageSquare size={48} className="text-slate-200 mb-3" />
            <p className="text-md font-bold text-slate-500 mb-1">Select a Thread</p>
            <p className="text-xs text-slate-400">Choose a mentee thread on the left to start replying.</p>
          </div>
        )}
      </div>
    </div>
  );
}
