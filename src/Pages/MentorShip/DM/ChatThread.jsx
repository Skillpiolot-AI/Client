// ChatThread.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Send, ArrowLeft, Clock, Lock, MessageSquare, PlusCircle } from 'lucide-react';
import config from '../../../config';
import './DM.css';

const ChatThread = () => {
    const { threadId } = useParams();
    const navigate = useNavigate();
    const [thread, setThread] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [history, setHistory] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const currentUserId = JSON.parse(localStorage.getItem('user'))?._id || localStorage.getItem('role') === 'Admin' ? 'admin' : null;

    useEffect(() => {
        if (threadId) {
            fetchThread();
            fetchHistory();
            fetchSuggestions();
        }
    }, [threadId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchThread = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.API_BASE_URL}/dm/${threadId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setThread(response.data.thread);
                setMessages(response.data.thread.messages || []);
            }
        } catch (error) {
            console.error('Error fetching thread:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.API_BASE_URL}/dm/${threadId}/history`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success && response.data.hasPreviousThread) {
                setHistory(response.data.previousThread);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        }
    };

    const fetchSuggestions = async () => {
        try {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role') === 'Mentor' ? 'mentor' : 'mentee';
            const response = await axios.get(`${config.API_BASE_URL}/dm/suggestions?role=${role}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.data.success) {
                setSuggestions(response.data.suggestions || []);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const sendMessage = async (e) => {
        e?.preventDefault();
        const content = newMessage.trim();
        if (!content || isSending) return;

        try {
            setIsSending(true);
            const token = localStorage.getItem('token');
            const response = await axios.post(`${config.API_BASE_URL}/dm/${threadId}/messages`, {
                content
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setNewMessage('');
                // Optimistic UI update or simply re-fetch
                setMessages([...messages, response.data.message]);
                // Update thread status if backend response passes it
                if (response.data.status && thread) {
                    setThread({ ...thread, status: response.data.status, expiresAt: response.data.expiresAt });
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading conversation...</div>;
    }

    if (!thread) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Conversation not found.</div>;
    }

    const isMentor = localStorage.getItem('role') === 'Mentor';
    const otherParticipant = isMentor ? thread.menteeId : thread.mentorId;
    const isClosed = thread.status === 'closed' || thread.status === 'expired';

    const getExpiryText = () => {
        if (!thread.expiresAt) return 'Timer starts on mentor reply';
        const exp = new Date(thread.expiresAt);
        const now = new Date();
        const diff = exp - now;
        if (diff <= 0) return 'Expired';
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours > 24) return `${Math.floor(hours / 24)} days left`;
        return `${hours}h remaining`;
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F8FAFC' }}>
            {/* Header */}
            <div style={{ background: 'white', borderBottom: '1px solid #E2E8F0', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <img 
                        src={otherParticipant?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherParticipant?.name || 'User')}&size=60&background=random`} 
                        alt="Participant" 
                        style={{ width: 40, height: 40, borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div>
                        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#1E293B' }}>{otherParticipant?.name}</h3>
                        <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>{thread.subject}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={14} /> {getExpiryText()}
                    </span>
                    <span style={{ background: isClosed ? '#FEE2E2' : '#D1FAE5', color: isClosed ? '#991B1B' : '#065F46', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>
                        {thread.status.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Banner for pending timer */}
            {thread.status === 'open' && !isMentor && (
                <div style={{ background: '#EFF6FF', color: '#1E3A8A', padding: '8px 20px', fontSize: '13px', textAlign: 'center', fontWeight: 500 }}>
                    ⏳ Mentors typically reply within {thread.serviceId?.responseTime || '48 hours'}. Timer starts after their first reply.
                </div>
            )}

            {/* Messages Scroll Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Previous History Toggle */}
                {history && (
                    <div style={{ textAlign: 'center', margin: '10px 0' }}>
                        <button 
                            onClick={() => setShowHistory(!showHistory)}
                            style={{ background: '#F1F5F9', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', color: '#475569', cursor: 'pointer', fontWeight: 500 }}
                        >
                            {showHistory ? 'Hide Previous History' : 'View 30-Day Previous History'}
                        </button>
                    </div>
                )}

                {/* Render History Messages */}
                {showHistory && history && (
                    <div style={{ opacity: 0.7, background: '#F1F5F9', padding: '12px', borderRadius: '12px', marginBottom: '10px' }}>
                        <p style={{ fontSize: '11px', color: '#64748B', textAlign: 'center', textTransform: 'uppercase' }}>📜 Archived History</p>
                        {history.messages?.map((msg, i) => {
                            const isMe = msg.sender === currentUserId || (isMentor && msg.senderRole === 'mentor') || (!isMentor && msg.senderRole === 'mentee');
                            return (
                                <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', margin: '8px 0' }}>
                                    <div style={{ background: isMe ? '#E0E7FF' : 'white', color: '#1E293B', padding: '8px 12px', borderRadius: '12px', maxWidth: '70%', fontSize: '13px' }}>
                                        {msg.content}
                                    </div>
                                </div>
                            );
                        })}
                        <hr style={{ border: 'none', borderTop: '1px dashed #CBD5E1', margin: '16px 0' }} />
                    </div>
                )}

                {/* Main Messages */}
                {messages.map((msg, index) => {
                    // Safety check if currentUserId is not available
                    const isMe = msg.sender === currentUserId || 
                               (isMentor && msg.senderRole === 'mentor') || 
                               (!isMentor && msg.senderRole === 'mentee');

                    return (
                        <div key={index} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%' }}>
                                <div style={{ 
                                    background: isMe ? '#4F46E5' : 'white', 
                                    color: isMe ? 'white' : '#1E293B', 
                                    padding: '10px 14px', 
                                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                    fontSize: '14px',
                                    lineHeight: '1.4'
                                }}>
                                    {msg.content}
                                </div>
                                <span style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px' }}>
                                    {new Date(msg.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Bottom Bar: Suggestions & Input */}
            <div style={{ background: 'white', borderTop: '1px solid #E2E8F0', padding: '16px 20px' }}>
                {/* Suggestions Roll */}
                {!isClosed && suggestions.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '12px', borderBottom: newMessage ? 'none' : '1px solid #F1F5F9' }}>
                        {suggestions.map((sug, i) => (
                            <button
                                key={i}
                                onClick={() => setNewMessage(sug)}
                                style={{ background: '#EEF2FF', border: '1px solid #E0E7FF', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', color: '#4F46E5', cursor: 'pointer', flexShrink: 0, fontWeight: 500 }}
                            >
                                {sug}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                {isClosed ? (
                    <div style={{ textAlign: 'center', padding: '12px', background: '#F1F5F9', borderRadius: '8px', color: '#64748B', fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        <Lock size={16} /> This thread is closed or expired.
                    </div>
                ) : (
                    <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text"
                            placeholder="Type a message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            disabled={isSending}
                            style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '14px', background: '#F8FAFC', outline: 'none' }}
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim() || isSending}
                            style={{ background: '#4F46E5', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: newMessage.trim() && !isSending ? 1 : 0.6 }}
                        >
                            <Send size={18} />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ChatThread;
