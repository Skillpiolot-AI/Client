// AnnouncementList Component - Table View
import React from 'react';
import { Eye, Edit, Trash2, Send, Clock, Users } from 'lucide-react';

const AnnouncementList = ({
    announcements,
    loading,
    onEdit,
    onDelete,
    onSend,
    pagination,
    onPageChange,
}) => {
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getRecipientLabel = (recipientType, targetRoles) => {
        if (recipientType === 'all') return 'All Users';
        if (recipientType === 'specific') return 'Selected Users';
        if (targetRoles?.length > 0) return targetRoles.join(', ');
        return recipientType?.charAt(0).toUpperCase() + recipientType?.slice(1) || '-';
    };

    if (loading) {
        return (
            <div className="announcements-table-container">
                <div className="empty-state">
                    <div className="loading-spinner"></div>
                    <p>Loading announcements...</p>
                </div>
            </div>
        );
    }

    if (announcements.length === 0) {
        return (
            <div className="announcements-table-container">
                <div className="empty-state">
                    <div className="empty-icon">📢</div>
                    <h3 className="empty-title">No Announcements Yet</h3>
                    <p className="empty-text">Create your first announcement to notify users</p>
                </div>
            </div>
        );
    }

    return (
        <div className="announcements-table-container">
            <table className="announcements-table">
                <thead>
                    <tr>
                        <th>Subject</th>
                        <th>Recipients</th>
                        <th>Channels</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Stats</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((ann) => (
                        <tr key={ann._id}>
                            <td>
                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{ann.subject}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                                    {ann.shortDescription?.substring(0, 60)}...
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Users size={14} />
                                    {getRecipientLabel(ann.recipientType, ann.targetRoles)}
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                    {ann.channels?.push && <span className="type-badge push">📱 Push</span>}
                                    {ann.channels?.email && <span className="type-badge email">📧 Email</span>}
                                    {ann.channels?.inApp && <span className="type-badge inApp">📲 In-App</span>}
                                </div>
                            </td>
                            <td>
                                <span className={`status-badge ${ann.status}`}>
                                    {ann.status === 'scheduled' && <Clock size={12} />}
                                    {ann.status?.charAt(0).toUpperCase() + ann.status?.slice(1)}
                                </span>
                            </td>
                            <td style={{ fontSize: '0.875rem', color: '#64748b' }}>
                                {formatDate(ann.createdAt)}
                                {ann.sentAt && (
                                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>
                                        Sent: {formatDate(ann.sentAt)}
                                    </div>
                                )}
                            </td>
                            <td>
                                {ann.status === 'sent' && (
                                    <div style={{ fontSize: '0.75rem' }}>
                                        <div>📱 {ann.stats?.pushSent || 0} sent</div>
                                        <div>📧 {ann.stats?.emailSent || 0} emails</div>
                                        <div>👁️ {ann.stats?.read || 0} read</div>
                                    </div>
                                )}
                                {ann.status === 'draft' && <span style={{ color: '#64748b' }}>-</span>}
                            </td>
                            <td>
                                <div className="action-buttons">
                                    {ann.status === 'draft' && (
                                        <>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => onEdit(ann)}
                                                title="Edit"
                                            >
                                                <Edit size={16} />
                                            </button>
                                            <button
                                                className="action-btn send"
                                                onClick={() => onSend(ann._id)}
                                                title="Send Now"
                                            >
                                                <Send size={16} />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        className="action-btn delete"
                                        onClick={() => onDelete(ann._id)}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            {pagination.pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '1rem' }}>
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                background: page === pagination.page ? '#6366f1' : 'white',
                                color: page === pagination.page ? 'white' : '#64748b',
                                cursor: 'pointer',
                            }}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AnnouncementList;
