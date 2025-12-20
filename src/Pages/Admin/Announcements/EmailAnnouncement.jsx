// EmailAnnouncement Component - Markdown Email Editor
import React, { useState } from 'react';
import { X, Send, Eye, Code, FileText } from 'lucide-react';
import { marked } from 'marked';

const EmailAnnouncement = ({ onClose, onSend }) => {
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        recipientType: 'all',
        targetRoles: [],
        channels: { push: false, email: true, inApp: false },
        emailSettings: { isMarkdown: true, previewText: '' },
    });

    const [viewMode, setViewMode] = useState('edit'); // 'edit' or 'preview'
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRoleToggle = (role) => {
        const newRoles = formData.targetRoles.includes(role)
            ? formData.targetRoles.filter(r => r !== role)
            : [...formData.targetRoles, role];
        setFormData(prev => ({ ...prev, targetRoles: newRoles }));
    };

    const handleSubmit = async (sendNow = false) => {
        if (!formData.subject.trim() || !formData.description.trim()) {
            alert('Please fill in subject and content');
            return;
        }

        setLoading(true);
        try {
            await onSend({
                ...formData,
                shortDescription: formData.description.substring(0, 150),
                sendNow,
            });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const getPreviewHtml = () => {
        try {
            return marked(formData.description);
        } catch {
            return formData.description;
        }
    };

    const recipientOptions = [
        { value: 'all', label: '👥 All Users' },
        { value: 'mentors', label: '🎓 Mentors' },
        { value: 'users', label: '👤 Users' },
    ];

    const roleOptions = ['User', 'Mentor', 'Admin', 'Student', 'UniAdmin', 'UniTeach'];

    const markdownHelp = `
**Markdown Tips:**
- **Bold**: \`**text**\`
- *Italic*: \`*text*\`
- # Heading: \`# Title\`
- [Link](url): \`[text](url)\`
- List: \`- item\`
- Code: \`\`code\`\`
  `;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '900px' }}>
                <div className="modal-header">
                    <h2 className="modal-title">📧 Email Announcement</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* Subject */}
                    <div className="form-group">
                        <label className="form-label">Email Subject *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter email subject..."
                            value={formData.subject}
                            onChange={(e) => handleChange('subject', e.target.value)}
                        />
                    </div>

                    {/* Preview Text */}
                    <div className="form-group">
                        <label className="form-label">Preview Text (shown in email inbox)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Brief preview shown in email clients..."
                            value={formData.emailSettings.previewText}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                emailSettings: { ...prev.emailSettings, previewText: e.target.value }
                            }))}
                            maxLength={150}
                        />
                    </div>

                    {/* Target Audience */}
                    <div className="form-group">
                        <label className="form-label">Send To</label>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                            {recipientOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleChange('recipientType', opt.value)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: formData.recipientType === opt.value ? '2px solid #6366f1' : '2px solid #e5e7eb',
                                        background: formData.recipientType === opt.value ? '#f0f0ff' : 'white',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {formData.recipientType === 'all' && (
                            <div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                    Or filter by specific roles:
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                    {roleOptions.map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => handleRoleToggle(role)}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                border: formData.targetRoles.includes(role) ? '2px solid #6366f1' : '1px solid #e5e7eb',
                                                background: formData.targetRoles.includes(role) ? '#f0f0ff' : 'white',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                            }}
                                        >
                                            {role}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Editor Toggle */}
                    <div className="form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label className="form-label" style={{ marginBottom: 0 }}>
                                Email Content (Markdown supported)
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('edit')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: viewMode === 'edit' ? '#6366f1' : '#e5e7eb',
                                        color: viewMode === 'edit' ? 'white' : '#64748b',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }}
                                >
                                    <Code size={14} />
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('preview')}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        background: viewMode === 'preview' ? '#6366f1' : '#e5e7eb',
                                        color: viewMode === 'preview' ? 'white' : '#64748b',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                    }}
                                >
                                    <Eye size={14} />
                                    Preview
                                </button>
                            </div>
                        </div>

                        {viewMode === 'edit' ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem' }}>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Write your email content using Markdown..."
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    style={{ minHeight: '300px', fontFamily: 'monospace' }}
                                />
                                <div style={{
                                    background: '#f8fafc',
                                    padding: '1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.75rem',
                                    color: '#64748b',
                                    whiteSpace: 'pre-wrap',
                                }}>
                                    {markdownHelp}
                                </div>
                            </div>
                        ) : (
                            <div className="markdown-preview" style={{ minHeight: '300px' }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                                    padding: '20px',
                                    borderRadius: '12px 12px 0 0',
                                    marginBottom: '1rem',
                                }}>
                                    <h1 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>
                                        {formData.subject || 'Email Subject'}
                                    </h1>
                                </div>
                                <div
                                    dangerouslySetInnerHTML={{ __html: getPreviewHtml() }}
                                    style={{ padding: '0 1rem' }}
                                />
                            </div>
                        )}
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
                        <FileText size={16} />
                        Save as Draft
                    </button>
                    <button
                        className="btn-primary"
                        onClick={() => handleSubmit(true)}
                        disabled={loading}
                    >
                        <Send size={16} />
                        {loading ? 'Sending...' : 'Send Email'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmailAnnouncement;
