// Auth API endpoints
import api from './api';
import * as SecureStore from 'expo-secure-store';

export const authAPI = {
    // Login - backend accepts username, email, or registrationNumber in the 'username' field
    login: async (email, password) => {
        const response = await api.post('/auth/login', { username: email, password });
        if (response.data.token) {
            await SecureStore.setItemAsync('authToken', response.data.token);
            await SecureStore.setItemAsync('userData', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Signup
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    // Verify Email
    verifyEmail: async (token) => {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        return response.data;
    },

    // Resend Verification
    resendVerification: async (email) => {
        const response = await api.post('/auth/resend-verification', { email });
        return response.data;
    },

    // Forgot Password
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset Password
    resetPassword: async (token, password) => {
        const response = await api.post('/auth/reset-password', { token, password });
        return response.data;
    },

    // Google OAuth
    googleAuth: async (tokenId) => {
        const response = await api.post('/auth/google', { tokenId });
        if (response.data.token) {
            await SecureStore.setItemAsync('authToken', response.data.token);
            await SecureStore.setItemAsync('userData', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await api.get('/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async (profileData) => {
        const response = await api.put('/profile', profileData);
        return response.data;
    },

    // Logout
    logout: async () => {
        await SecureStore.deleteItemAsync('authToken');
        await SecureStore.deleteItemAsync('userData');
    },
};

export default authAPI;
