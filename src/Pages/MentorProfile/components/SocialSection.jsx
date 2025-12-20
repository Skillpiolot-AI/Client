import { useState, useEffect } from 'react';
import { Save, Linkedin, Twitter, Github, Globe, Youtube, BookOpen, Loader2 } from 'lucide-react';

const SocialSection = ({ profile, saving, onUpdate }) => {
    const [formData, setFormData] = useState({
        socialLinks: {
            linkedIn: '',
            twitter: '',
            github: '',
            medium: '',
            portfolio: '',
            youtube: '',
        },
    });
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                socialLinks: profile.socialLinks || {
                    linkedIn: '',
                    twitter: '',
                    github: '',
                    medium: '',
                    portfolio: '',
                    youtube: '',
                },
            });
        }
    }, [profile]);

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            socialLinks: { ...prev.socialLinks, [field]: value },
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        if (!hasChanges) return;
        await onUpdate({ socialLinks: formData.socialLinks });
        setHasChanges(false);
    };

    const socialFields = [
        { key: 'linkedIn', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/yourprofile', color: '#0A66C2' },
        { key: 'twitter', label: 'Twitter / X', icon: Twitter, placeholder: 'https://twitter.com/yourhandle', color: '#1DA1F2' },
        { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/yourusername', color: '#333' },
        { key: 'medium', label: 'Medium', icon: BookOpen, placeholder: 'https://medium.com/@yourprofile', color: '#000' },
        { key: 'portfolio', label: 'Portfolio', icon: Globe, placeholder: 'https://yourportfolio.com', color: '#059669' },
        { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/c/yourchannel', color: '#FF0000' },
    ];

    return (
        <div className="social-section">
            <div className="section-header">
                <div>
                    <h2>Social & Links</h2>
                    <p>Add your social profiles and portfolio links</p>
                </div>
                <button
                    className={`save-btn ${!hasChanges ? 'disabled' : ''}`}
                    onClick={handleSave}
                    disabled={saving || !hasChanges}
                >
                    {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            <div className="form-card">
                <div className="social-grid">
                    {socialFields.map((field) => {
                        const Icon = field.icon;
                        return (
                            <div key={field.key} className="social-input-group">
                                <div className="input-label">
                                    <Icon size={18} style={{ color: field.color }} />
                                    <label>{field.label}</label>
                                </div>
                                <input
                                    type="url"
                                    value={formData.socialLinks[field.key] || ''}
                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                                {formData.socialLinks[field.key] && (
                                    <a
                                        href={formData.socialLinks[field.key]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="preview-link"
                                    >
                                        Preview
                                    </a>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx>{`
        .social-section {
          padding: 32px;
          max-width: 800px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
        }

        .section-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 4px 0;
        }

        .section-header p {
          color: #64748b;
          margin: 0;
        }

        .save-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: #1A237E;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .save-btn:hover:not(.disabled) {
          background: #3949AB;
        }

        .save-btn.disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .form-card {
          background: white;
          border-radius: 12px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .social-grid {
          display: grid;
          gap: 24px;
        }

        .social-input-group {
          position: relative;
        }

        .input-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .input-label label {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
        }

        .social-input-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .social-input-group input:focus {
          outline: none;
          border-color: #1A237E;
          box-shadow: 0 0 0 3px rgba(26, 35, 126, 0.1);
        }

        .preview-link {
          position: absolute;
          right: 12px;
          top: 42px;
          font-size: 12px;
          color: #1A237E;
          font-weight: 600;
          text-decoration: none;
        }

        .preview-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .social-section {
            padding: 20px;
          }

          .section-header {
            flex-direction: column;
            gap: 16px;
          }

          .save-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
        </div>
    );
};

export default SocialSection;
