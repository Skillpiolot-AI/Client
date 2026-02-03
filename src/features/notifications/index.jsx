// User Notifications/Announcements Page
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, AlertCircle, RefreshCw, Calendar, Clock, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';
import './styles.css';

const NotificationsPage = () => {
    const navigate = useNavigate();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAnnouncements();
        fetchUnreadCount();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.API_BASE_URL}/announcements/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAnnouncements(response.data?.announcements || []);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${config.API_BASE_URL}/announcements/unread-count`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUnreadCount(response.data?.unreadCount || 0);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await fetchAnnouncements();
        await fetchUnreadCount();
        setRefreshing(false);
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${config.API_BASE_URL}/announcements/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAnnouncements((prev) =>
                prev.map((ann) => (ann._id === id ? { ...ann, isRead: true } : ann))
            );
            if (unreadCount > 0) setUnreadCount((prev) => prev - 1);
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins} minutes ago`;
        if (diffHours < 24) return `${diffHours} hours ago`;
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'urgent':
                return { emoji: '🚨', color: '#ef4444' };
            case 'important':
                return { emoji: '⚠️', color: '#f59e0b' };
            case 'update':
                return { emoji: '🔄', color: '#10b981' };
            case 'event':
                return { emoji: '📅', color: '#8b5cf6' };
            default:
                return { emoji: '📢', color: '#6366f1' };
        }
    };

    if (loading) {
        return (
            <div className="notifications-page">
                <div className="notifications-loading">
                    <div className="spinner"></div>
                    <p>Loading notifications...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="notifications-page">
            {/* Header */}
            <div className="notifications-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ChevronLeft size={20} />
                    Back
                </button>
                <div className="header-title">
                    <Bell size={24} />
                    <h1>Notifications</h1>
                    {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
                </div>
                <button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw size={18} className={refreshing ? 'spinning' : ''} />
                    Refresh
                </button>
            </div>

            {/* Content */}
            <div className="notifications-content">
                {announcements.length === 0 ? (
                    <div className="empty-state">
                        <Bell size={64} strokeWidth={1} />
                        <h3>No Notifications</h3>
                        <p>You're all caught up! Check back later for updates.</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {announcements.map((ann) => {
                            const typeInfo = getTypeIcon(ann.type);
                            return (
                                <div
                                    key={ann._id}
                                    className={`notification-card ${ann.isRead ? '' : 'unread'}`}
                                    onClick={() => !ann.isRead && markAsRead(ann._id)}
                                >
                                    <div className="notification-icon" style={{ background: `${typeInfo.color}15` }}>
                                        <span>{typeInfo.emoji}</span>
                                    </div>
                                    <div className="notification-body">
                                        <div className="notification-header">
                                            <h3 className="notification-title">{ann.subject}</h3>
                                            {!ann.isRead && <span className="unread-dot"></span>}
                                        </div>
                                        <p className="notification-description">
                                            {ann.shortDescription || ann.description}
                                        </p>
                                        <div className="notification-meta">
                                            <span className="notification-time">
                                                <Clock size={14} />
                                                {formatDate(ann.sentAt)}
                                            </span>
                                            <span
                                                className="notification-type"
                                                style={{ background: `${typeInfo.color}15`, color: typeInfo.color }}
                                            >
                                                {ann.type?.charAt(0).toUpperCase() + ann.type?.slice(1)}
                                            </span>
                                            {ann.isRead && (
                                                <span className="read-status">
                                                    <CheckCircle size={14} />
                                                    Read
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
