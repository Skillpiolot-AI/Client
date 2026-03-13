/**
 * MenteeDMInbox.jsx
 * Mentee's view of their sent Priority DMs.
 * Simple list of threads and conversation view.
 */

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import config from '../../config';
import { Send, X, CheckCheck, Loader2, MessageSquare, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API = config.API_BASE_URL;
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` });

const C = { indigo: '#4F46E5', bg: '#EEF2FF', border: '#E2E8F0', slate: '#64748B', green: '#059669' };

function Avatar({ user, size = 36 }) {
  if (user?.imageUrl) return <img src={user.imageUrl} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover' }} />;
  return <div style={{ width: size, height: size, borderRadius: '50%', background: C.indigo, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: size * 0.38 }}>{(user?.name || 'U')[0].toUpperCase()}</div>;
}

export default function MenteeDMInbox() {
  const navigate = useNavigate();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [threadData, setThreadData] = useState(null);
  const [reply, setReply] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadThreads = async () => {
    try {
      const r = await axios.get(`${API}/dm/inbox/mentee`, { headers: authHeader() });
      setThreads(r.data.threads || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { loadThreads(); }, []);

  const loadThread = async (id) => {
    setSelected(id);
    setThreadData(null);
    try {
      const r = await axios.get(`${API}/dm/${id}`, { headers: authHeader() });
      setThreadData(r.data.thread);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [threadData?.messages]);

  // Poll open thread
  useEffect(() => {
    if (!selected) return;
    const int = setInterval(() => loadThread(selected), 20000);
    return () => clearInterval(int);
  }, [selected]);

  const send = async () => {
    if (!reply.trim()) return;
    setSending(true);
    try {
      await axios.post(`${API}/dm/${selected}/messages`, { content: reply.trim() }, { headers: authHeader() });
      setReply('');
      loadThread(selected);
      loadThreads();
    } catch (e) { alert(e.response?.data?.error || 'Send failed'); }
    setSending(false);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: 'Inter, sans-serif' }}>
      <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: '#64748B', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <h1 style={{ margin: '0 0 24px', fontSize: '24px', fontWeight: 800, color: '#1E293B' }}>My Priority DMs</h1>

      <div style={{ display: 'flex', height: '600px', border: `1px solid ${C.border}`, borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        {/* Sidebar */}
        <div style={{ width: '300px', borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}><Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} color={C.indigo} /></div>
          ) : threads.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: C.slate }}>
              <MessageSquare size={32} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
              <p style={{ fontSize: '14px', margin: 0 }}>No DMs sent yet</p>
            </div>
          ) : (
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {threads.map(t => (
                <button key={t._id} onClick={() => loadThread(t._id)} style={{ width: '100%', textAlign: 'left', padding: '16px', border: 'none', borderBottom: `1px solid ${C.border}`, background: selected === t._id ? C.bg : '#fff', cursor: 'pointer', display: 'flex', gap: '12px' }}>
                  <Avatar user={t.mentorId} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#1E293B' }}>{t.mentorId?.name}</div>
                    <div style={{ fontSize: '12px', color: C.slate, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>{t.subject}</div>
                    <div style={{ marginTop: '6px', display: 'flex', gap: '6px' }}>
                      <span style={{ fontSize: '10px', background: '#F1F5F9', padding: '2px 6px', borderRadius: '10px', fontWeight: 700, textTransform: 'uppercase', color: t.status === 'open' ? '#D97706' : t.status === 'active' ? C.green : C.slate }}>{t.status}</span>
                      {t.unreadByMentee > 0 && <span style={{ fontSize: '10px', background: '#EF4444', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontWeight: 800 }}>{t.unreadByMentee} New</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat view */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
          {!selected ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.slate }}>
              <p style={{ fontSize: '14px' }}>Select a conversation</p>
            </div>
          ) : !threadData ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={24} style={{ animation: 'spin 0.8s linear infinite' }} color={C.indigo} />
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: '16px 24px', background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Avatar user={threadData.mentorId} size={40} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px', color: '#1E293B' }}>{threadData.mentorId?.name}</div>
                  <div style={{ fontSize: '12px', color: C.slate }}>{threadData.subject}</div>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {threadData.messages.map((m, i) => {
                  const isMe = m.senderRole === 'mentee';
                  return (
                    <div key={i} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', gap: '8px', alignItems: 'flex-end' }}>
                      {!isMe && <Avatar user={threadData.mentorId} size={28} />}
                      <div style={{ maxWidth: '75%' }}>
                        <div style={{ background: isMe ? C.indigo : '#fff', color: isMe ? '#fff' : '#1E293B', padding: '12px 16px', borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: '14px', lineHeight: 1.5, border: isMe ? 'none' : `1px solid ${C.border}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                          {m.content}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>
                          {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && m.isRead && <CheckCheck size={11} color={C.green} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              {threadData.status !== 'closed' && threadData.status !== 'expired' ? (
                <div style={{ padding: '16px 24px', background: '#fff', borderTop: `1px solid ${C.border}`, display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                  <textarea
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                    placeholder="Reply to mentor..."
                    rows={1}
                    style={{ flex: 1, border: `1.5px solid ${C.border}`, borderRadius: '24px', padding: '12px 20px', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                  />
                  <button onClick={send} disabled={sending || !reply.trim()} style={{ background: C.indigo, color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: reply.trim() ? 1 : 0.5, flexShrink: 0 }}>
                    {sending ? <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Send size={18} style={{ marginLeft: '2px' }} />}
                  </button>
                </div>
              ) : (
                <div style={{ padding: '16px', textAlign: 'center', background: '#F1F5F9', color: C.slate, fontSize: '13px', borderTop: `1px solid ${C.border}` }}>
                  This conversation has been closed.
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
