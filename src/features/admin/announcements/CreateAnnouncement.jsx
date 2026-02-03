// CreateAnnouncement Component - Create/Edit Form
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Send, Save, Users, Eye } from 'lucide-react';
import config from '../../../config/config';
import RecipientSelector from './RecipientSelector';

const CreateAnnouncement = ({ announcement, onClose, onCreate, onUpdate }) => {
    const isEditing = !!announcement;

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        shortDescription: '',
        type: 'general',
        recipientType: 'all',
        recipientIds: [],
        targetRoles: [],
        channels: { push: true, email: false, inApp: true },
    });

    const [recipientPreview, setRecipientPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        if (announcement) {
            setFormData({
                subject: announcement.subject || '',
                description: announcement.description || '',
                shortDescription: announcement.shortDescription || '',
                type: announcement.type || 'general',
                recipientType: announcement.recipientType || 'all',
                recipientIds: announcement.recipientIds?.map(u => u._id || u) || [],
                targetRoles: announcement.targetRoles || [],
                channels: announcement.channels || { push: true, email: false, inApp: true },
            });
        }
    }, [announcement]);

    useEffect(() => {
        // Generate short description from description
        if (formData.description && !formData.shortDescription) {
            setFormData(prev => ({
                ...prev,
                shortDescription: formData.description.substring(0, 150),
            }));
        }
    }, [formData.description]);

    const previewRecipients = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${config.API_BASE_URL}/announcements/preview-recipients`,
                {
                    recipientType: formData.recipientType,
                    recipientIds: formData.recipientIds,
                    targetRoles: formData.targetRoles,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRecipientPreview(response.data);
        } catch (error) {
            console.error('Preview error:', error);
        }
    };

    useEffect(() => {
        previewRecipients();
    }, [formData.recipientType, formData.recipientIds, formData.targetRoles]);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleChannelToggle = (channel) => {
        setFormData(prev => ({
            ...prev,
            channels: { ...prev.channels, [channel]: !prev.channels[channel] },
        }));
    };

    const handleSubmit = async (sendNow = false) => {
        if (!formData.subject.trim() || !formData.description.trim()) {
            alert('Please fill in subject and description');
            return;
        }

        setLoading(true);
        try {
            if (isEditing) {
                await onUpdate(announcement._id, formData);
            } else {
                await onCreate({ ...formData, sendNow });
            }
        } finally {
            setLoading(false);
        }
    };

    const typeOptions = [
        { value: 'general', label: '📢 General', color: '#6366f1' },
        { value: 'important', label: '⚠️ Important', color: '#f59e0b' },
        { value: 'urgent', label: '🚨 Urgent', color: '#ef4444' },
        { value: 'update', label: '🔄 Update', color: '#10b981' },
        { value: 'event', label: '📅 Event', color: '#8b5cf6' },
    ];

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {isEditing ? 'Edit Announcement' : 'Create Announcement'}
                    </h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Subject */}
                    <div className="form-group">
                        <label className="form-label">Subject *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Announcement title..."
                            value={formData.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                        />
                    </div>

                    {/* Type */}
                    <div className="form-group">
                        <label className="form-label">Type</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {typeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleChange('type', opt.value)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: formData.type === opt.value ? `2px solid ${opt.color}` : '2px solid #e5e7eb',
                                        background: formData.type === opt.value ? `${opt.color}15` : 'white',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label className="form-label">Description *</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Write your announcement message..."
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={5}
                        />
                    </div>

                    {/* Short Description */}
                    <div className="form-group">
                        <label className="form-label">
                            Short Description (for push notification)
                            <span style={{ color: '#64748b', fontWeight: 400, marginLeft: '0.5rem' }}>
                                {formData.shortDescription.length}/150
                            </span>
                        </label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Brief summary for push notification..."
                            value={formData.shortDescription}
                            onChange={(e) => handleChange('shortDescription', e.target.value.substring(0, 150))}
                        />
                    </div>

                    {/* Recipients */}
                    <RecipientSelector
                        recipientType={formData.recipientType}
                        targetRoles={formData.targetRoles}
                        recipientIds={formData.recipientIds}
                        onChange={(data) => setFormData(prev => ({ ...prev, ...data }))}
                    />

                    {/* Recipient Preview */}
                    {recipientPreview && (
                        <div className="preview-section">
                            <div className="preview-label">Recipients Preview</div>
                            <div style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                                <div>
                                    <strong style={{ fontSize: '1.5rem' }}>{recipientPreview.totalRecipients}</strong>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total Recipients</div>
                                </div>
                                <div>
                                    <strong style={{ fontSize: '1.5rem' }}>{recipientPreview.withPushToken}</strong>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>With Push Token</div>
                                </div>
                            </div>
                            {recipientPreview.roleBreakdown && (
                                <div className="preview-recipients">
                                    {Object.entries(recipientPreview.roleBreakdown).map(([role, count]) => (
                                        <span key={role} className="recipient-chip">
                                            {role}: {count}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Channels */}
                    <div className="form-group">
                        <label className="form-label">Delivery Channels</label>
                        <div className="channels-grid">
                            <label className={`channel-toggle ${formData.channels.push ? 'active' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.channels.push}
                                    onChange={() => handleChannelToggle('push')}
                                />
                                📱 Push Notification
                            </label>
                            <label className={`channel-toggle ${formData.channels.email ? 'active' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.channels.email}
                                    onChange={() => handleChannelToggle('email')}
                                />
                                📧 Email
                            </label>
                            <label className={`channel-toggle ${formData.channels.inApp ? 'active' : ''}`}>
                                <input
                                    type="checkbox"
                                    checked={formData.channels.inApp}
                                    onChange={() => handleChannelToggle('inApp')}
                                />
                                📲 In-App
                            </label>
                        </div>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-secondary" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => handleSubmit(false)}
                        disabled={loading}
                    >
                        <Save size={16} />
                        {isEditing ? 'Update Draft' : 'Save as Draft'}
                    </button>
                    {!isEditing && (
                        <button
                            className="btn-primary"
                            onClick={() => handleSubmit(true)}
                            disabled={loading}
                        >
                            <Send size={16} />
                            {loading ? 'Sending...' : 'Send Now'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreateAnnouncement;
