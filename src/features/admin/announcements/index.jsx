// Announcements Admin Dashboard - Main Entry Point
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Send, Plus, TestTube, Mail, RefreshCw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import config from '../../../config/config';
import AnnouncementList from './AnnouncementList';
import CreateAnnouncement from './CreateAnnouncement';
import EmailAnnouncement from './EmailAnnouncement';
import 'react-toastify/dist/ReactToastify.css';
import './styles.css';

const AnnouncementsDashboard = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, sent: 0, draft: 0, scheduled: 0 });
    const [filters, setFilters] = useState({ status: '', type: '', search: '' });
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    // Modals
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);

    useEffect(() => {
        fetchAnnouncements();
    }, [filters.status, filters.type, pagination.page]);

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const params = new URLSearchParams({
                page: pagination.page,
                limit: 15,
                ...(filters.status && { status: filters.status }),
                ...(filters.type && { type: filters.type }),
                ...(filters.search && { search: filters.search }),
            });

            const response = await axios.get(
                `${config.API_BASE_URL}/announcements?${params}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setAnnouncements(response.data.announcements || []);
            setPagination(response.data.pagination || { page: 1, pages: 1, total: 0 });

            // Calculate stats
            const all = response.data.announcements || [];
            setStats({
                total: response.data.pagination?.total || all.length,
                sent: all.filter(a => a.status === 'sent').length,
                draft: all.filter(a => a.status === 'draft').length,
                scheduled: all.filter(a => a.status === 'scheduled').length,
            });
        } catch (error) {
            console.error('Error fetching announcements:', error);
            toast.error('Failed to fetch announcements');
        } finally {
            setLoading(false);
        }
    };

    const handleTestNotification = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${config.API_BASE_URL}/announcements/test`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('🔔 Test notification sent to your device!');
        } catch (error) {
            console.error('Test notification error:', error);
            toast.error(error.response?.data?.error || 'Failed to send test notification');
        }
    };

    const handleCreate = async (data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${config.API_BASE_URL}/announcements`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(data.sendNow ? '🚀 Announcement sent!' : '📝 Draft saved!');
            setShowCreateModal(false);
            setEditingAnnouncement(null);
            fetchAnnouncements();
        } catch (error) {
            console.error('Create error:', error);
            toast.error(error.response?.data?.error || 'Failed to create announcement');
        }
    };

    const handleUpdate = async (id, data) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `${config.API_BASE_URL}/announcements/${id}`,
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('✅ Announcement updated!');
            setShowCreateModal(false);
            setEditingAnnouncement(null);
            fetchAnnouncements();
        } catch (error) {
            console.error('Update error:', error);
            toast.error(error.response?.data?.error || 'Failed to update announcement');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this announcement?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `${config.API_BASE_URL}/announcements/${id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success('🗑️ Announcement deleted');
            fetchAnnouncements();
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.error || 'Failed to delete announcement');
        }
    };

    const handleSend = async (id) => {
        if (!window.confirm('Send this announcement to all recipients?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${config.API_BASE_URL}/announcements/${id}/send`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(`🚀 Sent to ${response.data.stats?.totalRecipients || 0} recipients!`);
            fetchAnnouncements();
        } catch (error) {
            console.error('Send error:', error);
            toast.error(error.response?.data?.error || 'Failed to send announcement');
        }
    };

    const handleEdit = (announcement) => {
        setEditingAnnouncement(announcement);
        setShowCreateModal(true);
    };

    return (
        <div className="announcements-container">
            {/* Header */}
            <div className="announcements-header">
                <h1 className="announcements-title">
                    <Bell size={28} />
                    Announcements
                </h1>
                <div className="announcements-actions">
                    <button className="btn-secondary" onClick={handleTestNotification}>
                        <TestTube size={18} />
                        Test Notification
                    </button>
                    <button className="btn-secondary" onClick={() => setShowEmailModal(true)}>
                        <Mail size={18} />
                        Email Announcement
                    </button>
                    <button className="btn-primary" onClick={() => { setEditingAnnouncement(null); setShowCreateModal(true); }}>
                        <Plus size={18} />
                        Create Announcement
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon purple">📢</div>
                    <div className="stat-info">
                        <h3>{stats.total}</h3>
                        <p>Total Announcements</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon green">✅</div>
                    <div className="stat-info">
                        <h3>{stats.sent}</h3>
                        <p>Sent</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue">📝</div>
                    <div className="stat-info">
                        <h3>{stats.draft}</h3>
                        <p>Drafts</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon orange">⏰</div>
                    <div className="stat-info">
                        <h3>{stats.scheduled}</h3>
                        <p>Scheduled</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters-row">
                    <div className="filter-group">
                        <label className="filter-label">Status</label>
                        <select
                            className="filter-select"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <option value="">All Status</option>
                            <option value="draft">Draft</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="sending">Sending</option>
                            <option value="sent">Sent</option>
                            <option value="failed">Failed</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Type</label>
                        <select
                            className="filter-select"
                            value={filters.type}
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        >
                            <option value="">All Types</option>
                            <option value="general">General</option>
                            <option value="important">Important</option>
                            <option value="urgent">Urgent</option>
                            <option value="update">Update</option>
                            <option value="event">Event</option>
                        </select>
                    </div>
                    <div className="filter-group">
                        <label className="filter-label">Search</label>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Search announcements..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && fetchAnnouncements()}
                        />
                    </div>
                    <button className="btn-secondary btn-sm" onClick={fetchAnnouncements}>
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Announcements Table */}
            <AnnouncementList
                announcements={announcements}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSend={handleSend}
                pagination={pagination}
                onPageChange={(page) => setPagination({ ...pagination, page })}
            />

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <CreateAnnouncement
                    announcement={editingAnnouncement}
                    onClose={() => { setShowCreateModal(false); setEditingAnnouncement(null); }}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                />
            )}

            {/* Email Announcement Modal */}
            {showEmailModal && (
                <EmailAnnouncement
                    onClose={() => setShowEmailModal(false)}
                    onSend={handleCreate}
                />
            )}

            <ToastContainer position="bottom-right" />
        </div>
    );
};

export default AnnouncementsDashboard;
