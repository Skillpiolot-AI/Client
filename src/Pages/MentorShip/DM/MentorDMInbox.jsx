// MentorDMInbox.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, Search, Filter } from 'lucide-react';
import config from '../../../config';
import './DM.css';

const MentorDMInbox = () => {
    const [threads, setThreads] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const navigate = useNavigate();

    useEffect(() => {
        fetchThreads();
    }, [statusFilter]);

    const fetchThreads = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.API_BASE_URL}/dm/inbox/mentor`, {
                headers: { Authorization: `Bearer ${token}` },
                params: { status: statusFilter }
            });
            setThreads(response.data.threads || []);
        } catch (error) {
            console.error('Error fetching mentor threads:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'open': return { bg: '#DBEAFE', color: '#1E40AF', text: 'Open (Waiting)' };
            case 'active': return { bg: '#D1FAE5', color: '#065F46', text: 'Active' };
            case 'closed': return { bg: '#F3F4F6', color: '#374151', text: 'Closed' };
            case 'expired': return { bg: '#FEE2E2', color: '#991B1B', text: 'Expired' };
            default: return { bg: '#F3F4F6', color: '#374151', text: 'Other' };
        }
    };

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'open', label: 'Open (Pending)' },
        { id: 'active', label: 'Active' },
        { id: 'closed', label: 'Closed' },
        { id: 'expired', label: 'Expired' }
    ];

    if (isLoading && threads.length === 0) {
        return <div style={{ padding: '40px', textAlign: 'center' }}>Loading inbox...</div>;
    }

    return (
        <div className="dm-inbox-container">
            <div className="dm-inbox-header">
                <div>
                    <h1>📥 Student DMs (Priority)</h1>
                    <p>Manage async conversations and priority questions</p>
                </div>
            </div>

            <div className="dm-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`dm-tab ${statusFilter === tab.id ? 'active' : ''}`}
                        onClick={() => setStatusFilter(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {threads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <MessageSquare size={48} style={{ color: '#94A3B8', marginBottom: '12px' }} />
                    <h3 style={{ color: '#1E293B', marginBottom: '8px' }}>No Messages Found</h3>
                    <p style={{ color: '#64748B' }}>No threads match this status right now.</p>
                </div>
            ) : (
                <div className="dm-thread-list">
                    {threads.map(thread => {
                        const status = getStatusStyle(thread.status);
                        const mentee = thread.menteeId || {};
                        return (
                            <div key={thread._id} className="dm-thread-card" onClick={() => navigate(`/dm/${thread._id}`)}>
                                <div className="dm-participant">
                                    <img 
                                        src={mentee.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(mentee.name || 'Student')}&size=80&background=random`} 
                                        alt="Student" 
                                        className="dm-avatar" 
                                        style={{ border: thread.unreadByMentor > 0 ? '2px solid #DC2626' : 'none' }}
                                    />
                                    <div className="dm-info">
                                        <h3>{mentee.name || 'Student'}</h3>
                                        <p className="dm-subject">{thread.subject} <span style={{ opacity: 0.6, fontSize: '12px' }}>({thread.serviceId?.title || 'DM'})</span></p>
                                        {thread.lastMessage && (
                                            <p className="dm-preview">
                                                {thread.lastMessage.senderRole === 'mentee' ? '👤 ' : '👨‍🏫 Me: '}
                                                {thread.lastMessage.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="dm-card-right">
                                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                                        {thread.unreadByMentor > 0 && <span className="badge-unread">{thread.unreadByMentor} Unread</span>}
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

export default MentorDMInbox;
