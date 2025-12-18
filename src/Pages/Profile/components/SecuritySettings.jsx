import { useState } from 'react';
import { Mail, Trash2, Loader2, AlertTriangle, Shield, Key } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import axios from 'axios';
import config from '../../../config';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../../AuthContext';

const SecuritySettings = ({ user }) => {
    const { logout, setToken } = useAuth();

    const [showEmailChange, setShowEmailChange] = useState(false);
    const [emailStep, setEmailStep] = useState('request');
    const [newEmail, setNewEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [emailLoading, setEmailLoading] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [deleteConfirmText, setDeleteConfirmText] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleRequestEmailChange = async () => {
        if (!newEmail) {
            toast.error('Please enter a new email address');
            return;
        }

        if (newEmail === user?.email) {
            toast.error('New email must be different from current email');
            return;
        }

        setEmailLoading(true);
        try {
            const response = await axios.post(`${config.API_BASE_URL}/auth/request-email-change`,
                { newEmail },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.success) {
                toast.success('Verification code sent to the new email');
                setEmailStep('verify');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send verification code');
        } finally {
            setEmailLoading(false);
        }
    };

    const handleVerifyEmailChange = async () => {
        if (!otp) {
            toast.error('Please enter the verification code');
            return;
        }

        setEmailLoading(true);
        try {
            const response = await axios.post(`${config.API_BASE_URL}/auth/verify-email-change`,
                { newEmail, otp },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            if (response.data.success) {
                toast.success('Email changed successfully');
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    setToken(response.data.token);
                }
                setShowEmailChange(false);
                setEmailStep('request');
                setNewEmail('');
                setOtp('');
                window.location.reload();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        } finally {
            setEmailLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') {
            toast.error('Please type DELETE to confirm');
            return;
        }

        if (user?.authProvider !== 'google' && !deletePassword) {
            toast.error('Please enter your password');
            return;
        }

        setDeleteLoading(true);
        try {
            const response = await axios.delete(`${config.API_BASE_URL}/auth/delete-account`, {
                data: { password: deletePassword, confirmDelete: deleteConfirmText },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                toast.success('Account deleted successfully');
                logout();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete account');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="section-container">
            <div className="section-header">
                <h2>Security & Privacy</h2>
            </div>

            <div className="settings-list">
                <div className="setting-card">
                    <div className="setting-icon email">
                        <Mail size={24} />
                    </div>
                    <div className="setting-content">
                        <h3>Change Email Address</h3>
                        <p>Current: <strong>{user?.email}</strong></p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowEmailChange(!showEmailChange)}
                    >
                        {showEmailChange ? 'Cancel' : 'Change Email'}
                    </Button>
                </div>

                {showEmailChange && (
                    <div className="email-change-form">
                        {emailStep === 'request' ? (
                            <>
                                <div className="form-group">
                                    <Label>New Email Address</Label>
                                    <Input
                                        type="email"
                                        value={newEmail}
                                        onChange={(e) => setNewEmail(e.target.value)}
                                        placeholder="Enter new email address"
                                    />
                                </div>
                                <Button onClick={handleRequestEmailChange} disabled={emailLoading} className="primary-btn">
                                    {emailLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                    Send Verification Code
                                </Button>
                            </>
                        ) : (
                            <>
                                <div className="info-box">
                                    <p>A verification code has been sent to <strong>{newEmail}</strong>. Please check your inbox.</p>
                                </div>
                                <div className="form-group">
                                    <Label>Verification Code</Label>
                                    <Input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="Enter 6-digit code"
                                        maxLength={6}
                                    />
                                </div>
                                <div className="form-actions">
                                    <Button variant="outline" onClick={() => setEmailStep('request')}>
                                        Back
                                    </Button>
                                    <Button onClick={handleVerifyEmailChange} disabled={emailLoading} className="primary-btn">
                                        {emailLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                                        Verify & Change Email
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                <div className="setting-card">
                    <div className="setting-icon password">
                        <Key size={24} />
                    </div>
                    <div className="setting-content">
                        <h3>Change Password</h3>
                        <p>Update your password regularly for security</p>
                    </div>
                    <Button variant="outline" onClick={() => window.location.href = '/forgot-password'}>
                        Change Password
                    </Button>
                </div>

                <div className="setting-card danger">
                    <div className="setting-icon delete">
                        <Trash2 size={24} />
                    </div>
                    <div className="setting-content">
                        <h3>Delete Account</h3>
                        <p>Permanently delete your account and all data</p>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                    >
                        {showDeleteConfirm ? 'Cancel' : 'Delete Account'}
                    </Button>
                </div>

                {showDeleteConfirm && (
                    <div className="delete-confirm-form">
                        <div className="warning-box">
                            <AlertTriangle size={24} />
                            <div>
                                <h4>This action is irreversible!</h4>
                                <p>All your data including profile, education details, experience, projects, and certifications will be permanently deleted.</p>
                            </div>
                        </div>

                        {user?.authProvider !== 'google' && (
                            <div className="form-group">
                                <Label>Enter your password to confirm</Label>
                                <Input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    placeholder="Your password"
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <Label>Type <strong>DELETE</strong> to confirm</Label>
                            <Input
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value.toUpperCase())}
                                placeholder="Type DELETE"
                            />
                        </div>

                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteLoading || deleteConfirmText !== 'DELETE'}
                            className="delete-btn"
                        >
                            {deleteLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            Permanently Delete My Account
                        </Button>
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

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .setting-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
        }

        .setting-card.danger {
          border-color: #fecaca;
          background: #fef2f2;
        }

        .setting-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .setting-icon.email {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .setting-icon.password {
          background: linear-gradient(135deg, #f97316, #ea580c);
        }

        .setting-icon.delete {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .setting-content {
          flex: 1;
        }

        .setting-content h3 {
          color: #1e293b;
          font-size: 16px;
          font-weight: 500;
          margin: 0 0 4px 0;
        }

        .setting-content p {
          color: #64748b;
          font-size: 14px;
          margin: 0;
        }

        .email-change-form,
        .delete-confirm-form {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 24px;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-actions {
          display: flex;
          gap: 12px;
        }

        .primary-btn {
          background: #f97316;
          color: white;
        }

        .info-box {
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .info-box p {
          color: #64748b;
          margin: 0;
          font-size: 14px;
        }

        .warning-box {
          display: flex;
          gap: 16px;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          color: #ef4444;
        }

        .warning-box h4 {
          color: #dc2626;
          margin: 0 0 4px 0;
          font-size: 14px;
        }

        .warning-box p {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: #991b1b;
        }

        .delete-btn {
          width: 100%;
          margin-top: 8px;
        }

        @media (max-width: 768px) {
          .section-container {
            padding: 20px;
            margin: 16px;
          }

          .setting-card {
            flex-wrap: wrap;
          }
        }
      `}</style>
        </div>
    );
};

export default SecuritySettings;
