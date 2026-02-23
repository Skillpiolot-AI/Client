// context/NotificationContext.js — Global notification state + polling + Expo listener
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationsAPI } from '../services/notificationsAPI';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};

// Type → Ionicons name mapping (used by NotificationsScreen & ToastBanner)
export const NOTIF_META = {
    booking: { icon: 'calendar-outline', color: '#10B981' },
    assessment: { icon: 'school-outline', color: '#4F46E5' },
    mentor: { icon: 'person-add-outline', color: '#3B82F6' },
    reminder: { icon: 'alarm-outline', color: '#F59E0B' },
    system: { icon: 'sparkles-outline', color: '#F7931E' },
    default: { icon: 'notifications-outline', color: '#9CA3AF' },
};

const POLL_INTERVAL = 60_000; // 60 s polling fallback

// Demo notifications used when API returns empty / errors
const DEMO_NOTIFICATIONS = [
    { _id: '1', type: 'booking', title: 'Session Confirmed', message: 'Your session with Alex Johnson is confirmed for tomorrow at 10:00 AM.', createdAt: new Date(Date.now() - 2 * 60_000).toISOString(), read: false },
    { _id: '2', type: 'assessment', title: 'Assessment Complete', message: 'Your AI assessment results are ready. Score: 78%', createdAt: new Date(Date.now() - 60 * 60_000).toISOString(), read: false },
    { _id: '3', type: 'mentor', title: 'New Mentor Available', message: 'Sarah Chen, Senior Engineer at Google, just joined SkillPilot.', createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(), read: true },
    { _id: '4', type: 'reminder', title: 'Session Reminder', message: 'Your mentorship session starts in 30 minutes.', createdAt: new Date(Date.now() - 24 * 3600_000).toISOString(), read: true },
    { _id: '5', type: 'system', title: 'Welcome to SkillPilot!', message: 'Get started by taking your first AI skill assessment.', createdAt: new Date(Date.now() - 48 * 3600_000).toISOString(), read: true },
];

export const NotificationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const pollRef = useRef(null);
    const listenerRef = useRef(null);

    const unreadCount = notifications.filter((n) => !n.read).length;

    // ── Fetch notifications from API ─────────────────────────────────────────
    const fetchNotifications = useCallback(async (quiet = false) => {
        if (!isAuthenticated) return;
        if (!quiet) setLoading(true);
        try {
            const data = await notificationsAPI.getNotifications();
            const list = data?.notifications || data?.data || data || [];
            setNotifications(Array.isArray(list) && list.length > 0 ? list : DEMO_NOTIFICATIONS);
        } catch {
            // Graceful fallback to demo data
            setNotifications((prev) => prev.length > 0 ? prev : DEMO_NOTIFICATIONS);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    // ── Polling ───────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }
        fetchNotifications();
        pollRef.current = setInterval(() => fetchNotifications(true), POLL_INTERVAL);

        // Expo foreground notification listener — appends new notifications
        listenerRef.current = Notifications.addNotificationReceivedListener((notification) => {
            const content = notification.request.content;
            const newNotif = {
                _id: notification.request.identifier,
                type: content.data?.type || 'system',
                title: content.title || 'New Notification',
                message: content.body || '',
                createdAt: new Date().toISOString(),
                read: false,
                _isLive: true, // flag for ToastBanner
            };
            setNotifications((prev) => [newNotif, ...prev]);
        });

        return () => {
            clearInterval(pollRef.current);
            if (listenerRef.current) {
                Notifications.removeNotificationSubscription(listenerRef.current);
            }
        };
    }, [isAuthenticated, fetchNotifications]);

    // Sync OS badge count
    useEffect(() => {
        Notifications.setBadgeCountAsync(unreadCount).catch(() => { });
    }, [unreadCount]);

    // ── Mutations ─────────────────────────────────────────────────────────────
    const markRead = useCallback(async (id) => {
        // Optimistic update
        setNotifications((prev) =>
            prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        try { await notificationsAPI.markAsRead(id); } catch { /* silent */ }
    }, []);

    const markAllRead = useCallback(async () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        try { await notificationsAPI.markAllRead(); } catch { /* silent */ }
    }, []);

    const refresh = useCallback(() => fetchNotifications(), [fetchNotifications]);

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markRead,
            markAllRead,
            refresh,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
