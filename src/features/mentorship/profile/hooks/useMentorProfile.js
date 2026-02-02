import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../../../config';
import { useAuth } from '../../../AuthContext';
import { toast } from 'react-hot-toast';

const useMentorProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [sessionStats, setSessionStats] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [sessionStatusCounts, setSessionStatusCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${config.API_BASE_URL}/mentors/my-profile`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setProfile(response.data.profile);
            setSessionStats(response.data.sessionStats);
            setError(null);
        } catch (err) {
            console.error('Error fetching mentor profile:', err);
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, [user.token]);

    const fetchSessions = useCallback(async (status = null) => {
        try {
            const params = status ? { status } : {};
            const response = await axios.get(`${config.API_BASE_URL}/mentors/my-sessions`, {
                headers: { Authorization: `Bearer ${user.token}` },
                params,
            });
            setSessions(response.data.sessions);
            setSessionStatusCounts(response.data.statusCounts);
        } catch (err) {
            console.error('Error fetching sessions:', err);
            toast.error('Failed to load sessions');
        }
    }, [user.token]);

    useEffect(() => {
        if (user?.token) {
            fetchProfile();
            fetchSessions();
        }
    }, [user?.token, fetchProfile, fetchSessions]);

    const updateProfile = async (updateData) => {
        try {
            setSaving(true);
            const response = await axios.put(
                `${config.API_BASE_URL}/mentors/my-profile`,
                updateData,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setProfile(response.data.profile);
            toast.success(`Profile updated! ${response.data.changesCount} changes saved.`);
            return response.data;
        } catch (err) {
            console.error('Error updating profile:', err);
            toast.error(err.response?.data?.message || 'Failed to update profile');
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const addBusyDate = async (date, reason) => {
        try {
            setSaving(true);
            const response = await axios.post(
                `${config.API_BASE_URL}/mentors/busy-dates`,
                { action: 'add', date, reason },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setProfile(prev => ({ ...prev, busyDates: response.data.busyDates }));
            toast.success('Busy date added');
            return response.data;
        } catch (err) {
            console.error('Error adding busy date:', err);
            toast.error(err.response?.data?.message || 'Failed to add busy date');
            throw err;
        } finally {
            setSaving(false);
        }
    };

    const removeBusyDate = async (dateId) => {
        try {
            setSaving(true);
            const response = await axios.post(
                `${config.API_BASE_URL}/mentors/busy-dates`,
                { action: 'remove', dateId },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setProfile(prev => ({ ...prev, busyDates: response.data.busyDates }));
            toast.success('Busy date removed');
            return response.data;
        } catch (err) {
            console.error('Error removing busy date:', err);
            toast.error(err.response?.data?.message || 'Failed to remove busy date');
            throw err;
        } finally {
            setSaving(false);
        }
    };

    return {
        profile,
        sessionStats,
        sessions,
        sessionStatusCounts,
        loading,
        saving,
        error,
        fetchProfile,
        fetchSessions,
        updateProfile,
        addBusyDate,
        removeBusyDate,
    };
};

export default useMentorProfile;
