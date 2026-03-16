// MenteeDMInbox.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, AlertCircle } from 'lucide-react';
import config from '../../../config';
import './DM.css';

const MenteeDMInbox = () => {
    const [threads, setThreads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchThreads();
    }, []);

    const fetchThreads = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.API_BASE_URL}/dm/inbox/mentee`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setThreads(response.data.threads || []);
        } catch (error) {
            console.error('Error fetching threads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'open': return { bg: '#DBEAFE', color: '#1E40AF', text: 'Open' };
            case 'active': return { bg: '#D1FAE5', color: '#065F46', text: 'Active' };
            case 'closed': return { bg: '#F3F4F6', color: '#374151', text: 'Closed' };
            case 'expired': return { bg: '#FEE2E2', color: '#991B1B', text: 'Expired' };
            default: return { bg: '#F3F4F6', color: '#374151', text: 'Other' };
        }
    };

    if (isLoading) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading chats...</div>;
    }

    return (
        <div className="dm-inbox-container">
            <div className="dm-inbox-header">
                <div>
                    <h1>💬 My Chats (Priority DM)</h1>
                    <p>Conversations with your mentors</p>
                </div>
            </div>

            {threads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <MessageSquare size={48} style={{ color: '#94A3B8', marginBottom: '12px' }} />
                    <h3 style={{ color: '#1E293B', marginBottom: '8px' }}>No Chat History</h3>
                    <p style={{ color: '#64748B', maxWidth: '400px', margin: '0 auto' }}>You haven't purchased any Priority DM services yet. Buy a Priority DM from a mentor's profile to start chatting.</p>
                </div>
            ) : (
                <div className="dm-thread-list">
                    {threads.map(thread => {
                        const status = getStatusStyle(thread.status);
                        const mentor = thread.mentorProfileId || {};
                        return (
                            <div key={thread._id} className="dm-thread-card" onClick={() => navigate(`/dm/${thread._id}`)}>
                                <div className="dm-participant">
                                    <img 
                                        src={mentor.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.displayName || thread.mentorId?.name)}&size=80&background=random`} 
                                        alt="Mentor" 
                                        className="dm-avatar" 
                                        style={{ border: thread.unreadByMentee > 0 ? '2px solid #EF4444' : 'none' }}
                                    />
                                    <div className="dm-info">
                                        <h3>{mentor.displayName || thread.mentorId?.name || 'Mentor'}</h3>
                                        <p className="dm-subject">{thread.subject}</p>
                                        {thread.lastMessage && (
                                            <p className="dm-preview">
                                                {thread.lastMessage.senderRole === 'mentor' ? '👨‍🏫 ' : '👤 Me: '}
                                                {thread.lastMessage.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="dm-card-right">
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        {thread.unreadByMentee > 0 && <span className="badge-unread">{thread.unreadByMentee} New</span>}
                                        <span style={{ background: status.bg, color: status.color, padding: '3px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600 }}>
                                            {status.text}
                                        </span>
                                    </div>
                                    <span className="dm-time">
                                        {new Date(thread.lastMessageAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MenteeDMInbox;
