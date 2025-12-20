// API Configuration for SkillPilot Mobile App
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const API_BASE_URL = 'https://server-x82u.onrender.com/api';
export const BASE_URL = 'https://server-x82u.onrender.com';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    async (config) => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.log('Error getting token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expired, clear storage
            await SecureStore.deleteItemAsync('authToken');
            await SecureStore.deleteItemAsync('userData');
        }
        return Promise.reject(error);
    }
);

export default api;
