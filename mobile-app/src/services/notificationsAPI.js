// services/notificationsAPI.js — REST wrapper for announcements/notifications backend
import api from './api';

export const notificationsAPI = {
    // GET /announcements — fetch all notifications for the logged-in user
    getNotifications: async (params = {}) => {
        const response = await api.get('/announcements/my', { params });
        console.log('Fetched notifications from backend:', response.data);
        return response.data;
    },

    // GET /announcements/unread-count
    getUnreadCount: async () => {
        const response = await api.get('/announcements/unread-count');
        return response.data;
    },

    // POST /announcements/:id/read — mark one notification as read
    markAsRead: async (notificationId) => {
        const response = await api.post(`/announcements/${notificationId}/read`);
        return response.data;
    },

    // POST /announcements/read-all — mark all as read
    markAllRead: async () => {
        const response = await api.post('/announcements/read-all');
        return response.data;
    },
};

export default notificationsAPI;
