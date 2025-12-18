import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';

const AuthContext = createContext();

// Setup axios interceptors globally to add token and handle 401s
let isInterceptorSetup = false;

const setupAxiosInterceptors = (clearAuthCallback) => {
  if (isInterceptorSetup) return;

  // Request interceptor to add auth token
  axios.interceptors.request.use(
    (axiosConfig) => {
      const token = localStorage.getItem('token');
      if (token) {
        axiosConfig.headers.Authorization = `Bearer ${token}`;
      }
      return axiosConfig;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor to handle auth errors globally
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log('Session expired or unauthorized, clearing auth data');
        clearAuthCallback();
      }
      return Promise.reject(error);
    }
  );

  isInterceptorSetup = true;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    // Setup axios interceptors once
    setupAxiosInterceptors(clearAuth);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(`${config.API_BASE_URL}/auth/me`);

      if (response.data) {
        const userObj = {
          ...response.data,
          _id: response.data._id || response.data.id,
          id: response.data._id || response.data.id,
          token,
          role: localStorage.getItem('role') || response.data.role
        };

        setUser(userObj);
        localStorage.setItem('userId', userObj._id);
      } else {
        clearAuth();
      }
    } catch (error) {
      console.error('Token verification failed:', error.response?.status);
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    const userObj = {
      ...(userData.user || userData),
      _id: (userData.user?._id || userData.user?.id) || (userData._id || userData.id),
      id: (userData.user?._id || userData.user?.id) || (userData._id || userData.id),
      token: userData.token,
      role: userData.role || (userData.user?.role)
    };

    setUser(userObj);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userObj.role);
    localStorage.setItem('userId', userObj._id);
  };

  const logout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  const isAuthenticated = () => !!user && !!localStorage.getItem('token');

  const hasRole = (requiredRole) => {
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user?.role);
    }
    return user?.role === requiredRole;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8F7]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-medium animate-pulse">Synchronizing Session...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasRole,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}