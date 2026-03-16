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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '12px', background: '#fff' }}>
        <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><X size={16} /></button>
        <Avatar user={menteeObj} />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E293B' }}>{menteeObj?.name}</div>
          <div style={{ fontSize: '12px', color: C.slate }}>{thread.subject}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ background: statusBg[thread.status], color: statusColors[thread.status], borderRadius: '20px', padding: '3px 10px', fontSize: '11px', fontWeight: 700 }}>{thread.status}</span>
          {thread.serviceId && <span style={{ fontSize: '11px', color: C.slate }}>{thread.serviceId.emoji} {thread.serviceId.title}</span>}
          {!isClosed && (
            <button onClick={closeThread} disabled={closing} title="Close thread" style={{ background: '#FEF2F2', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}>
              <XCircle size={14} color="#DC2626" />
            </button>
          )}
        </div>
      </div>

      {/* Response deadline */}
      {thread.responseDeadline && !thread.mentorRepliedAt && (
        <div style={{ background: '#FEF3C7', padding: '8px 20px', fontSize: '12px', color: '#92400E', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={12} /> Respond by: <strong>{new Date(thread.responseDeadline).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</strong>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', background: '#F8FAFC' }}>
        
        {/* Previous History Toggle */}
        {history && (
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              style={{ background: '#EFF6FF', border: '1px solid #D6E4FF', padding: '4px 12px', borderRadius: '20px', fontSize: '11px', color: '#1E40AF', cursor: 'pointer', fontWeight: 600 }}
            >
              {showHistory ? 'Hide Previous History' : 'View 30-Day Previous History'}
            </button>
          </div>
        )}

        {/* Render History Messages */}
        {showHistory && history && (
          <div style={{ background: '#FAFBFF', padding: '12px', borderRadius: '12px', border: '1px dashed #E2E8F0', marginBottom: '10px' }}>
            <p style={{ fontSize: '10px', color: '#94A3B8', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>📜 Archived History</p>
            {history.messages?.map((m, i) => {
              const isMyMsg = m.senderRole === 'mentor';
              return (
                <div key={`hist-${i}`} style={{ display: 'flex', flexDirection: isMyMsg ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end', marginBottom: '8px', opacity: 0.7 }}>
                  {!isMyMsg && <Avatar user={thread.menteeId} size={24} />}
                  <div style={{ maxWidth: '70%' }}>
                    <div style={{ background: isMyMsg ? C.indigo : '#fff', color: isMyMsg ? '#fff' : '#1E293B', borderRadius: isMyMsg ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '8px 12px', fontSize: '13px', border: isMyMsg ? 'none' : `1px solid ${C.border}` }}>
                      {m.content}
                    </div>
                  </div>
                </div>
              );
            })}
            <hr style={{ border: 'none', borderTop: '1px dashed #E2E8F0', margin: '12px 0' }} />
          </div>
        )}

        {thread.messages.map((m, i) => {
          const isMyMsg = m.senderRole === 'mentor';
          return (
            <div key={i} style={{ display: 'flex', flexDirection: isMyMsg ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end' }}>
              {!isMyMsg && <Avatar user={menteeObj} size={28} />}
              <div style={{ maxWidth: '70%' }}>
                <div style={{ background: isMyMsg ? C.indigo : '#fff', color: isMyMsg ? '#fff' : '#1E293B', borderRadius: isMyMsg ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontSize: '14px', lineHeight: 1.5, border: isMyMsg ? 'none' : `1px solid ${C.border}`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  {m.content}
                </div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px', textAlign: isMyMsg ? 'right' : 'left', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: isMyMsg ? 'flex-end' : 'flex-start' }}>
                  <TimeAgo date={m.createdAt} />
                  {isMyMsg && m.isRead && <CheckCheck size={11} color={C.green} />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Reply box */}
      {!isClosed ? (
        <div style={{ padding: '12px 16px', background: '#fff', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Suggestions roll */}
          {suggestions.length > 0 && (
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
              {suggestions.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => setReply(sug)}
                  style={{ background: '#EEF2FF', border: '1px solid #E0E7FF', padding: '5px 10px', borderRadius: '14px', fontSize: '11px', color: '#4F46E5', cursor: 'pointer', flexShrink: 0, fontWeight: 500 }}
                >
                  {sug}
                </button>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
            <textarea
              value={reply}
              onChange={e => setReply(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder="Type your reply… (Enter to send, Shift+Enter for newline)"
              rows={2}
              style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: '12px', padding: '10px 14px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', lineHeight: 1.4 }}
            />
            <button onClick={send} disabled={sending || !reply.trim()} style={{ background: C.indigo, border: 'none', borderRadius: '12px', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', fontWeight: 700, fontSize: '13px', opacity: reply.trim() ? 1 : 0.5 }}>
              {sending ? <Loader2 size={14} style={{ animation: 'spin 0.6s linear infinite' }} /> : <Send size={14} />} Send
            </button>
          </div>
        </div>
      ) : (
        <div style={{ padding: '12px 20px', background: '#F1F5F9', borderTop: `1px solid ${C.border}`, textAlign: 'center', fontSize: '13px', color: C.slate }}>
          🔒 This thread is closed
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
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Thread list */}
      <div style={{ width: '320px', flexShrink: 0, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>Priority DM Inbox</h2>
            {totalUnread > 0 && (
              <span style={{ background: '#EF4444', color: '#fff', borderRadius: '20px', padding: '2px 8px', fontSize: '11px', fontWeight: 800 }}>{totalUnread}</span>
            )}
          </div>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {['all', 'open', 'active', 'closed'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '4px 12px', borderRadius: '20px', border: `1.5px solid ${statusFilter === s ? C.indigo : C.border}`, background: statusFilter === s ? C.bg : 'transparent', color: statusFilter === s ? C.indigo : C.slate, fontSize: '12px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Thread list */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}><Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} color={C.indigo} /></div>
          ) : threads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <MessageSquare size={32} color="#CBD5E1" style={{ margin: '0 auto 10px' }} />
              <p style={{ fontSize: '14px', color: C.slate, margin: 0 }}>No messages yet</p>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '4px 0 0' }}>Mentees who buy your Priority DM service will appear here</p>
            </div>
          ) : (
            threads.map(t => {
              const isActive = selected === t._id;
              const hasUnread = t.unreadByMentor > 0;
              return (
                <button key={t._id} onClick={() => setSelected(t._id)} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '14px 20px', border: 'none', borderBottom: `1px solid ${C.border}`, background: isActive ? C.bg : hasUnread ? '#FAFBFF' : '#fff', cursor: 'pointer', transition: 'background 0.1s' }}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{ position: 'relative' }}>
                      <Avatar user={t.menteeId} size={40} />
                      {hasUnread && <div style={{ position: 'absolute', top: -2, right: -2, width: '14px', height: '14px', borderRadius: '50%', background: '#EF4444', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: 800 }}>{t.unreadByMentor}</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: hasUnread ? 800 : 600, color: '#1E293B' }}>{t.menteeId?.name}</span>
                        <span style={{ fontSize: '11px', color: '#94A3B8' }}><TimeAgo date={t.lastMessageAt} /></span>
                      </div>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: C.slate, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {t.lastMessage?.content || t.subject}
                      </p>
                      <div style={{ marginTop: '4px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ background: statusBg[t.status], color: statusColors[t.status], borderRadius: '20px', padding: '1px 7px', fontSize: '10px', fontWeight: 700 }}>{t.status}</span>
                        {t.serviceId && <span style={{ fontSize: '10px', color: '#94A3B8' }}>{t.serviceId.emoji}</span>}
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
      <div style={{ flex: 1 }}>
        {selected ? (
          <ThreadView
            threadId={selected}
            currentUserId={currentUserId}
            onClose={() => setSelected(null)}
            onThreadUpdate={load}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: C.slate }}>
            <MessageSquare size={48} color="#CBD5E1" style={{ marginBottom: '12px' }} />
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#94A3B8', margin: 0 }}>Select a conversation</p>
            <p style={{ fontSize: '13px', color: '#CBD5E1', margin: '4px 0 0' }}>Click a thread on the left to start responding</p>
          </div>
        )}
      </div>
    </div>
  );
}
