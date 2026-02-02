import { useState } from 'react';
import { Plus, Trash2, Save, X, Loader2, Github, Linkedin, Globe, Link2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { toast } from 'react-hot-toast';

const SocialLinks = ({ profile, saving, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [links, setLinks] = useState({
        github: profile?.socialLinks?.github || '',
        linkedin: profile?.socialLinks?.linkedin || '',
        portfolio: profile?.socialLinks?.portfolio || '',
        twitter: profile?.socialLinks?.twitter || '',
        customLinks: profile?.socialLinks?.customLinks || [],
    });

    const handleChange = (field, value) => {
        setLinks(prev => ({ ...prev, [field]: value }));
    };

    const handleAddCustomLink = () => {
        setLinks(prev => ({
            ...prev,
            customLinks: [...prev.customLinks, { name: '', url: '' }],
        }));
    };

    const handleCustomLinkChange = (index, field, value) => {
        setLinks(prev => ({
            ...prev,
            customLinks: prev.customLinks.map((link, i) =>
                i === index ? { ...link, [field]: value } : link
            ),
        }));
    };

    const handleRemoveCustomLink = (index) => {
        setLinks(prev => ({
            ...prev,
            customLinks: prev.customLinks.filter((_, i) => i !== index),
        }));
    };

    const handleSave = async () => {
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
        const validateUrl = (url) => !url || url === '' || urlPattern.test(url);

        if (!validateUrl(links.github) || !validateUrl(links.linkedin) ||
            !validateUrl(links.portfolio) || !validateUrl(links.twitter)) {
            toast.error('Please enter valid URLs');
            return;
        }

        const validCustomLinks = links.customLinks.filter(link => link.name && link.url);

        const result = await onUpdate({
            ...links,
            customLinks: validCustomLinks,
        });

        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
        } else {
            toast.error(result.message);
        }
    };

    const handleCancel = () => {
        setLinks({
            github: profile?.socialLinks?.github || '',
            linkedin: profile?.socialLinks?.linkedin || '',
            portfolio: profile?.socialLinks?.portfolio || '',
            twitter: profile?.socialLinks?.twitter || '',
            customLinks: profile?.socialLinks?.customLinks || [],
        });
        setIsEditing(false);
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h2>Social Links</h2>
                {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>Edit</Button>
                ) : (
                    <div className="header-actions">
                        <Button variant="outline" onClick={handleCancel} disabled={saving}>
                            <X size={16} /> Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="save-btn">
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save
                        </Button>
                    </div>
                )}
            </div>

            <div className="links-grid">
                <div className="link-card">
                    <div className="link-icon github">
                        <Github size={24} />
                    </div>
                    <div className="link-content">
                        <Label>GitHub</Label>
                        <Input
                            value={links.github}
                            onChange={(e) => handleChange('github', e.target.value)}
                            disabled={!isEditing}
                            placeholder="https://github.com/username"
                        />
                    </div>
                </div>

                <div className="link-card">
                    <div className="link-icon linkedin">
                        <Linkedin size={24} />
                    </div>
                    <div className="link-content">
                        <Label>LinkedIn</Label>
                        <Input
                            value={links.linkedin}
                            onChange={(e) => handleChange('linkedin', e.target.value)}
                            disabled={!isEditing}
                            placeholder="https://linkedin.com/in/username"
                        />
                    </div>
                </div>

                <div className="link-card">
                    <div className="link-icon portfolio">
                        <Globe size={24} />
                    </div>
                    <div className="link-content">
                        <Label>Portfolio / Website</Label>
                        <Input
                            value={links.portfolio}
                            onChange={(e) => handleChange('portfolio', e.target.value)}
                            disabled={!isEditing}
                            placeholder="https://yourwebsite.com"
                        />
                    </div>
                </div>

                <div className="link-card">
                    <div className="link-icon twitter">
                        <span style={{ fontSize: '20px', fontWeight: 'bold' }}>𝕏</span>
                    </div>
                    <div className="link-content">
                        <Label>Twitter / X</Label>
                        <Input
                            value={links.twitter}
                            onChange={(e) => handleChange('twitter', e.target.value)}
                            disabled={!isEditing}
                            placeholder="https://twitter.com/username"
                        />
                    </div>
                </div>
            </div>

            <div className="custom-links-section">
                <div className="custom-links-header">
                    <h3>Custom Links</h3>
                    {isEditing && (
                        <Button variant="outline" size="sm" onClick={handleAddCustomLink}>
                            <Plus size={16} /> Add Link
                        </Button>
                    )}
                </div>

                {links.customLinks.length === 0 ? (
                    <div className="empty-custom">
                        <Link2 size={20} />
                        <span>No custom links added</span>
                    </div>
                ) : (
                    <div className="custom-links-list">
                        {links.customLinks.map((link, index) => (
                            <div key={index} className="custom-link-row">
                                <div className="custom-link-inputs">
                                    <Input
                                        value={link.name}
                                        onChange={(e) => handleCustomLinkChange(index, 'name', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="Link Name"
                                        className="name-input"
                                    />
                                    <Input
                                        value={link.url}
                                        onChange={(e) => handleCustomLinkChange(index, 'url', e.target.value)}
                                        disabled={!isEditing}
                                        placeholder="https://..."
                                        className="url-input"
                                    />
                                </div>
                                {isEditing && (
                                    <Button variant="ghost" size="sm" className="remove-btn" onClick={() => handleRemoveCustomLink(index)}>
                                        <Trash2 size={16} />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <style jsx>{`
        .section-container {
          padding: 32px;
          background: #ffffff;
          margin: 24px;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-header h2 {
          font-size: 22px;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
        }

        .header-actions {
          display: flex;
          gap: 10px;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .links-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }

        .link-card {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .link-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .link-icon.github {
          background: linear-gradient(135deg, #333, #24292e);
        }

        .link-icon.linkedin {
          background: linear-gradient(135deg, #0077b5, #00a0dc);
        }

        .link-icon.portfolio {
          background: linear-gradient(135deg, #f97316, #ea580c);
        }

        .link-icon.twitter {
          background: linear-gradient(135deg, #1a1a1a, #333);
        }

        .link-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .custom-links-section {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 20px;
        }

        .custom-links-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .custom-links-header h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0;
        }

        .empty-custom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 24px;
          color: #64748b;
        }

        .custom-links-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .custom-link-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .custom-link-inputs {
          display: flex;
          flex: 1;
          gap: 12px;
        }

        .name-input {
          flex: 1;
          max-width: 200px;
        }

        .url-input {
          flex: 2;
        }

        .remove-btn {
          color: #ef4444;
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .links-grid {
            grid-template-columns: 1fr;
          }

          .custom-link-inputs {
            flex-direction: column;
          }

          .name-input {
            max-width: none;
          }
        }
      `}</style>
        </div>
    );
};

export default SocialLinks;
