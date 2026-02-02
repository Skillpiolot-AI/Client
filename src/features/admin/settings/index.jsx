"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import config from '../../../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Gift,
    Calendar,
    Clock,
    Settings,
    Bell,
    DollarSign,
    Info,
    Save,
    RefreshCw
} from 'lucide-react';
import './styles.css';

/**
 * SystemSettings - Admin page for managing platform settings
 * Includes free mentorship toggle, booking settings, and reminders
 */
const SystemSettings = () => {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [settings, setSettings] = useState(null);

    // Form states
    const [freeMentorshipEnabled, setFreeMentorshipEnabled] = useState(false);
    const [freeMentorshipEndDate, setFreeMentorshipEndDate] = useState('');
    const [freeMentorshipReason, setFreeMentorshipReason] = useState('');

    // Booking settings
    const [minBookingAdvanceHours, setMinBookingAdvanceHours] = useState(24);
    const [maxBookingAdvanceDays, setMaxBookingAdvanceDays] = useState(30);
    const [cancellationWindowHours, setCancellationWindowHours] = useState(12);
    const [autoConfirmBookings, setAutoConfirmBookings] = useState(true);

    // Rating settings
    const [ratingRequestAfterHours, setRatingRequestAfterHours] = useState(1);
    const [ratingExpiryHours, setRatingExpiryHours] = useState(48);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(
                `${config.API_BASE_URL}/bookings/admin/settings`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            const data = response.data.settings;
            setSettings(data);

            // Populate form fields
            if (data.globalFreeMentorship) {
                setFreeMentorshipEnabled(data.globalFreeMentorship.enabled || false);
                if (data.globalFreeMentorship.endDate) {
                    setFreeMentorshipEndDate(
                        new Date(data.globalFreeMentorship.endDate).toISOString().split('T')[0]
                    );
                }
                setFreeMentorshipReason(data.globalFreeMentorship.reason || '');
            }

            if (data.bookingSettings) {
                setMinBookingAdvanceHours(data.bookingSettings.minBookingAdvanceHours || 24);
                setMaxBookingAdvanceDays(data.bookingSettings.maxBookingAdvanceDays || 30);
                setCancellationWindowHours(data.bookingSettings.cancellationWindowHours || 12);
                setAutoConfirmBookings(data.bookingSettings.autoConfirmBookings !== false);
            }

            if (data.ratingSettings) {
                setRatingRequestAfterHours(data.ratingSettings.requestAfterHours || 1);
                setRatingExpiryHours(data.ratingSettings.expiryHours || 48);
            }

        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveFreeMentorship = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');

            await axios.put(
                `${config.API_BASE_URL}/bookings/admin/settings`,
                {
                    globalFreeMentorship: {
                        enabled: freeMentorshipEnabled,
                        endDate: freeMentorshipEndDate || null,
                        reason: freeMentorshipReason
                    }
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success(
                freeMentorshipEnabled
                    ? '🎉 Free mentorship enabled!'
                    : 'Free mentorship disabled'
            );
            fetchSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveBookingSettings = async () => {
        try {
            setIsSaving(true);
            const token = localStorage.getItem('token');

            await axios.put(
                `${config.API_BASE_URL}/bookings/admin/settings`,
                {
                    bookingSettings: {
                        minBookingAdvanceHours: parseInt(minBookingAdvanceHours),
                        maxBookingAdvanceDays: parseInt(maxBookingAdvanceDays),
                        cancellationWindowHours: parseInt(cancellationWindowHours),
                        autoConfirmBookings
                    }
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            toast.success('Booking settings saved!');
            fetchSettings();
        } catch (error) {
            console.error('Error saving settings:', error);
            toast.error('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="system-settings-container">
                <div className="system-settings-content">
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div className="loading-spinner-small" style={{ width: 40, height: 40 }}></div>
                        <p>Loading settings...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="system-settings-container">
            <div className="system-settings-content">
                {/* Header */}
                <div className="settings-header">
                    <h1>⚙️ System Settings</h1>
                    <p>Manage platform-wide settings for mentorship and bookings</p>
                </div>

                {/* Free Mentorship Card */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-title">
                            <div className="icon green">
                                <Gift size={20} />
                            </div>
                            <h2>Free Mentorship</h2>
                        </div>
                        <div className="toggle-container">
                            <div
                                className={`toggle-switch ${freeMentorshipEnabled ? 'active' : ''}`}
                                onClick={() => setFreeMentorshipEnabled(!freeMentorshipEnabled)}
                            />
                            <span className={`toggle-label ${freeMentorshipEnabled ? 'active' : ''}`}>
                                {freeMentorshipEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                        </div>
                    </div>

                    {freeMentorshipEnabled && (
                        <div className="free-mentorship-banner">
                            <span className="banner-icon">🎁</span>
                            <div>
                                <h3>Free Mentorship is Active!</h3>
                                <p>All mentorship sessions are currently free for students.</p>
                            </div>
                        </div>
                    )}

                    <div className="info-box">
                        <p>
                            <Info size={16} className="info-icon" />
                            When enabled, all mentorship sessions become free for students.
                            Mentors will still receive notifications but no payments will be processed.
                        </p>
                    </div>

                    <div className="settings-row">
                        <div className="form-group">
                            <label>End Date (Optional)</label>
                            <input
                                type="date"
                                value={freeMentorshipEndDate}
                                onChange={(e) => setFreeMentorshipEndDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                            />
                            <span className="helper-text">
                                Leave empty for no end date. Free mentorship will auto-disable after this date.
                            </span>
                        </div>

                        <div className="form-group">
                            <label>Reason / Campaign Name</label>
                            <input
                                type="text"
                                value={freeMentorshipReason}
                                onChange={(e) => setFreeMentorshipReason(e.target.value)}
                                placeholder="e.g., Holiday Special, Launch Offer"
                            />
                            <span className="helper-text">
                                Internal note for tracking purposes
                            </span>
                        </div>
                    </div>

                    <div className="button-group">
                        <button
                            className="btn-primary"
                            onClick={handleSaveFreeMentorship}
                            disabled={isSaving}
                        >
                            {isSaving && <span className="loading-spinner-small"></span>}
                            <Save size={16} style={{ marginRight: 8 }} />
                            Save Free Mentorship Settings
                        </button>
                    </div>

                    {settings?.globalFreeMentorship?.enabledAt && (
                        <p className="last-updated">
                            Last updated: {new Date(settings.globalFreeMentorship.enabledAt).toLocaleString()}
                            {settings.globalFreeMentorship.enabledBy && ` by Admin`}
                        </p>
                    )}
                </div>

                {/* Booking Settings Card */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-title">
                            <div className="icon blue">
                                <Calendar size={20} />
                            </div>
                            <h2>Booking Settings</h2>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="form-group">
                            <label>Minimum Advance Booking (Hours)</label>
                            <input
                                type="number"
                                value={minBookingAdvanceHours}
                                onChange={(e) => setMinBookingAdvanceHours(e.target.value)}
                                min="1"
                                max="168"
                            />
                            <span className="helper-text">
                                Students must book at least this many hours in advance
                            </span>
                        </div>

                        <div className="form-group">
                            <label>Maximum Advance Booking (Days)</label>
                            <input
                                type="number"
                                value={maxBookingAdvanceDays}
                                onChange={(e) => setMaxBookingAdvanceDays(e.target.value)}
                                min="1"
                                max="90"
                            />
                            <span className="helper-text">
                                How far in the future students can book
                            </span>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="form-group">
                            <label>Cancellation Window (Hours)</label>
                            <input
                                type="number"
                                value={cancellationWindowHours}
                                onChange={(e) => setCancellationWindowHours(e.target.value)}
                                min="1"
                                max="72"
                            />
                            <span className="helper-text">
                                Allow cancellation up to this many hours before session
                            </span>
                        </div>

                        <div className="form-group">
                            <label>Auto-Confirm Bookings</label>
                            <div className="toggle-container" style={{ marginTop: 8 }}>
                                <div
                                    className={`toggle-switch ${autoConfirmBookings ? 'active' : ''}`}
                                    onClick={() => setAutoConfirmBookings(!autoConfirmBookings)}
                                />
                                <span className={`toggle-label ${autoConfirmBookings ? 'active' : ''}`}>
                                    {autoConfirmBookings ? 'Yes' : 'No'}
                                </span>
                            </div>
                            <span className="helper-text">
                                If disabled, mentors must manually confirm each booking
                            </span>
                        </div>
                    </div>

                    <div className="button-group">
                        <button
                            className="btn-primary"
                            onClick={handleSaveBookingSettings}
                            disabled={isSaving}
                        >
                            {isSaving && <span className="loading-spinner-small"></span>}
                            <Save size={16} style={{ marginRight: 8 }} />
                            Save Booking Settings
                        </button>
                    </div>
                </div>

                {/* Reminder Settings Card */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-title">
                            <div className="icon purple">
                                <Bell size={20} />
                            </div>
                            <h2>Reminder & Rating Settings</h2>
                        </div>
                    </div>

                    <div className="settings-row">
                        <div className="form-group">
                            <label>Send Rating Request After (Hours)</label>
                            <input
                                type="number"
                                value={ratingRequestAfterHours}
                                onChange={(e) => setRatingRequestAfterHours(e.target.value)}
                                min="0"
                                max="24"
                            />
                            <span className="helper-text">
                                Hours after session completion to request rating
                            </span>
                        </div>

                        <div className="form-group">
                            <label>Rating Expiry (Hours)</label>
                            <input
                                type="number"
                                value={ratingExpiryHours}
                                onChange={(e) => setRatingExpiryHours(e.target.value)}
                                min="12"
                                max="168"
                            />
                            <span className="helper-text">
                                How long students have to submit their rating
                            </span>
                        </div>
                    </div>

                    <div className="info-box">
                        <p>
                            <Info size={16} className="info-icon" />
                            Reminder emails are sent automatically at: 1 hour, 30 min, 10 min, 5 min, and 2 min before sessions.
                        </p>
                    </div>
                </div>

                {/* Current Status Card */}
                <div className="settings-card">
                    <div className="settings-card-header">
                        <div className="settings-card-title">
                            <div className="icon orange">
                                <Settings size={20} />
                            </div>
                            <h2>Current Status</h2>
                        </div>
                        <button className="btn-secondary" onClick={fetchSettings}>
                            <RefreshCw size={16} style={{ marginRight: 8 }} />
                            Refresh
                        </button>
                    </div>

                    <div className="settings-row">
                        <div>
                            <strong>Free Mentorship:</strong>{' '}
                            <span className={`status-badge ${settings?.globalFreeMentorship?.enabled ? 'active' : 'inactive'}`}>
                                {settings?.globalFreeMentorship?.enabled ? '✅ Active' : '❌ Inactive'}
                            </span>
                        </div>
                        <div>
                            <strong>Auto-Confirm:</strong>{' '}
                            <span className={`status-badge ${settings?.bookingSettings?.autoConfirmBookings !== false ? 'active' : 'inactive'}`}>
                                {settings?.bookingSettings?.autoConfirmBookings !== false ? '✅ Yes' : '❌ No'}
                            </span>
                        </div>
                    </div>

                    {settings?.updatedAt && (
                        <p className="last-updated">
                            Settings last updated: {new Date(settings.updatedAt).toLocaleString()}
                        </p>
                    )}
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default SystemSettings;
