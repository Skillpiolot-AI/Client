import { useState, useRef } from 'react';
import { Camera, Trash2, Save, X, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { toast } from 'react-hot-toast';

const PersonalInformation = ({ profile, user, saving, onUpdate, onUploadPhoto, onRemovePhoto }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: profile?.firstName || user?.name?.split(' ')[0] || '',
        lastName: profile?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
        country: profile?.country || '',
        phoneNumber: profile?.phoneNumber || '',
        address: profile?.address || '',
        bio: profile?.bio || '',
    });
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const result = await onUpdate(formData);
        if (result.success) {
            toast.success(result.message);
            setIsEditing(false);
        } else {
            toast.error(result.message);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: profile?.firstName || user?.name?.split(' ')[0] || '',
            lastName: profile?.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
            dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
            country: profile?.country || '',
            phoneNumber: profile?.phoneNumber || '',
            address: profile?.address || '',
            bio: profile?.bio || '',
        });
        setIsEditing(false);
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        const result = await onUploadPhoto(file);
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    const handleRemovePhoto = async () => {
        const result = await onRemovePhoto();
        if (result.success) {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing ? (
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                        Edit
                    </Button>
                ) : (
                    <div className="header-actions">
                        <Button variant="outline" onClick={handleCancel} disabled={saving}>
                            <X size={16} />
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving} className="save-btn">
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save
                        </Button>
                    </div>
                )}
            </div>

            {/* Profile Photo Section */}
            <div className="photo-section">
                <div className="photo-container">
                    {user?.imageUrl ? (
                        <img src={user.imageUrl} alt={user.name} className="profile-photo" />
                    ) : (
                        <div className="photo-placeholder">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    )}
                </div>
                <div className="photo-actions">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoUpload}
                        className="hidden-input"
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={saving}
                    >
                        <Camera size={16} />
                        Upload Photo
                    </Button>
                    {user?.imageUrl && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemovePhoto}
                            disabled={saving}
                            className="remove-btn"
                        >
                            <Trash2 size={16} />
                            Remove
                        </Button>
                    )}
                </div>
            </div>

            {/* Form Fields */}
            <div className="form-grid">
                <div className="form-group">
                    <Label>First Name</Label>
                    <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="John"
                    />
                </div>
                <div className="form-group">
                    <Label>Last Name</Label>
                    <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Doe"
                    />
                </div>
                <div className="form-group">
                    <Label>Email</Label>
                    <Input
                        value={user?.email || ''}
                        disabled
                        className="disabled-field"
                    />
                    <span className="field-hint">Email can be changed in Security settings</span>
                </div>
                <div className="form-group">
                    <Label>Username</Label>
                    <Input
                        value={user?.username || ''}
                        disabled
                        className="disabled-field"
                    />
                </div>
                <div className="form-group">
                    <Label>Date of Birth</Label>
                    <Input
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        disabled={!isEditing}
                    />
                </div>
                <div className="form-group">
                    <Label>Country</Label>
                    <Input
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="India"
                    />
                </div>
                <div className="form-group">
                    <Label>Phone Number</Label>
                    <Input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="+91 9876543210"
                    />
                </div>
                <div className="form-group full-width">
                    <Label>Address</Label>
                    <Input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Your address"
                    />
                </div>
                <div className="form-group full-width">
                    <Label>Bio</Label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Tell us about yourself..."
                        rows={3}
                        className="bio-textarea"
                    />
                </div>
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
          margin-bottom: 32px;
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
          gap: 12px;
        }

        .save-btn {
          background: #f97316;
          color: white;
        }

        .save-btn:hover {
          background: #ea580c;
        }

        .photo-section {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding: 24px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .photo-container {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          border: 3px solid #f97316;
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.2);
        }

        .profile-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .photo-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #f97316, #ea580c);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 600;
          color: white;
        }

        .photo-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .hidden-input {
          display: none;
        }

        .remove-btn {
          color: #ef4444;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .disabled-field {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        .field-hint {
          font-size: 12px;
          color: #64748b;
        }

        .bio-textarea {
          width: 100%;
          padding: 12px;
          border-radius: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          color: #1e293b;
          font-size: 14px;
          resize: vertical;
          font-family: inherit;
        }

        .bio-textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f1f5f9;
        }

        .bio-textarea:focus {
          outline: none;
          border-color: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .photo-section {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
        </div>
    );
};

export default PersonalInformation;
