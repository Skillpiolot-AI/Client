// Authentication Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import authAPI from '../services/authAPI';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check for existing session on app start
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await SecureStore.getItemAsync('authToken');
            const userData = await SecureStore.getItemAsync('userData');

            if (token && userData) {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.log('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            setUser(response.user);
            setIsAuthenticated(true);
            return { success: true, data: response };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const signup = async (userData) => {
        try {
            const response = await authAPI.signup(userData);
            return { success: true, data: response };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed'
            };
        }
    };

    const logout = async () => {
        try {
            await authAPI.logout();
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.log('Logout error:', error);
        }
    };

    const updateUser = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            const updatedUser = { ...user, ...response.user };
            setUser(updatedUser);
            await SecureStore.setItemAsync('userData', JSON.stringify(updatedUser));
            return { success: true, data: response };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.message || 'Update failed'
            };
        }
    };

    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
