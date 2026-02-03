import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import config from '../../../config/config';

const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`${config.API_BASE_URL}/profile/me`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });

            if (response.data.success) {
                setProfile(response.data.profile);
                setUser(response.data.profile.user);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Update personal information
    const updatePersonalInfo = async (data) => {
        setSaving(true);
        try {
            const response = await axios.put(`${config.API_BASE_URL}/profile/personal`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: 'Personal information updated' };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update' };
        } finally {
            setSaving(false);
        }
    };

    // Update 10th grade
    const updateTenthGrade = async (data) => {
        setSaving(true);
        try {
            const response = await axios.put(`${config.API_BASE_URL}/profile/education/tenth`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: '10th grade details updated' };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update' };
        } finally {
            setSaving(false);
        }
    };

    // Update 12th grade
    const updateTwelfthGrade = async (data) => {
        setSaving(true);
        try {
            const response = await axios.put(`${config.API_BASE_URL}/profile/education/twelfth`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: '12th grade details updated' };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update' };
        } finally {
            setSaving(false);
        }
    };

    // Update undergraduate
    const updateUndergraduate = async (data) => {
        setSaving(true);
        try {
            const response = await axios.put(`${config.API_BASE_URL}/profile/education/undergraduate`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: 'Undergraduate details updated' };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update' };
        } finally {
            setSaving(false);
        }
    };

    // Update graduation
    const updateGraduation = async (data) => {
        setSaving(true);
        try {
            const response = await axios.put(`${config.API_BASE_URL}/profile/education/graduation`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: 'Graduation details updated' };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update' };
        } finally {
            setSaving(false);
        }
    };

    // Update experience
    const updateExperience = async (data) => {
        setSaving(true);
        try {
            const response = await axios.put(`${config.API_BASE_URL}/profile/experience`, { experience: data }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: 'Experience updated' };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update' };
        } finally {
            setSaving(false);
        }
    };

    // Update social links
    const updateSocialLinks = async (data) => {
        setSaving(true);
        try {
            const response = await axios.put(`${config.API_BASE_URL}/profile/social-links`, data, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: 'Social links updated' };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update' };
        } finally {
            setSaving(false);
        }
    };

    // Upload profile photo
    const uploadPhoto = async (file) => {
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append('photo', file);

            const response = await axios.post(`${config.API_BASE_URL}/profile/photo`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: 'Photo uploaded', imageUrl: response.data.imageUrl };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to upload photo' };
        } finally {
            setSaving(false);
        }
    };

    // Remove profile photo
    const removePhoto = async () => {
        setSaving(true);
        try {
            const response = await axios.delete(`${config.API_BASE_URL}/profile/photo`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: 'Photo removed' };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to remove photo' };
        } finally {
            setSaving(false);
        }
    };

    // Toggle newsletter
    const toggleNewsletter = async (value) => {
        setSaving(true);
        try {
            const response = await axios.put(`${config.API_BASE_URL}/auth/newsletter`, { newsletter: value }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data.success) {
                await fetchProfile();
                return { success: true, message: response.data.message };
            }
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update' };
        } finally {
            setSaving(false);
        }
    };

    return {
        profile,
        user,
        loading,
        error,
        saving,
        refetch: fetchProfile,
        updatePersonalInfo,
        updateTenthGrade,
        updateTwelfthGrade,
        updateUndergraduate,
        updateGraduation,
        updateExperience,
        updateSocialLinks,
        uploadPhoto,
        removePhoto,
        toggleNewsletter,
    };
};

export default useProfile;
