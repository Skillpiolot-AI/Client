import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

// Set up axios interceptors for global auth handling
let isInterceptorSetup = false;

const setupAxiosInterceptors = (clearAuthCallback) => {
  if (isInterceptorSetup) return;
  
  // Request interceptor to add auth token
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors globally
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.log('Authentication error detected, clearing auth data');
        clearAuthCallback();
      }
      return Promise.reject(error);
    }
  );

  isInterceptorSetup = true;
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    // Setup axios interceptors with clearAuth callback
    setupAxiosInterceptors(clearAuth);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log('AuthProvider useEffect - Token exists:', !!token, 'Role:', role);
    
    if (token && role) {
      // Verify token is still valid
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      console.log('Verifying token...');
      const response = await axios.get(`${config.API_BASE_URL}/auth/me`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Token verification response:', response.data);
      
      if (response.data) {
        setUser({ 
          ...response.data, 
          id: response.data._id,
          token, 
          role: localStorage.getItem('role') 
        });
        console.log('User authenticated successfully:', response.data.username, response.data.role);
      } else {
        console.log('Invalid response from /auth/me');
        clearAuth();
      }
    } catch (error) {
      console.error('Token verification failed:', error.response?.status, error.response?.data);
      
      // Clear auth data on any auth failure
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    console.log('Login data received in context:', userData);
    
    const userObj = {
      ...userData.user,
      id: userData.user._id || userData.user.id,
      token: userData.token,
      role: userData.role
    };
    
    setUser(userObj);
    
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    
    console.log('User logged in and stored:', userObj.username, userObj.role);
  };

  const logout = () => {
    console.log('Logging out user...');
    clearAuth();
    // Redirect to login page
    window.location.href = '/login';
  };

  const isAuthenticated = () => {
    const hasUser = !!user;
    const hasToken = !!localStorage.getItem('token');
    console.log('Auth check - hasUser:', hasUser, 'hasToken:', hasToken);
    return hasUser && hasToken;
  };

  const hasRole = (requiredRole) => {
    const userRole = user?.role;
    const hasRequiredRole = userRole === requiredRole;
    console.log('Role check - user role:', userRole, 'required:', requiredRole, 'hasRole:', hasRequiredRole);
    return hasRequiredRole;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying authentication...</p>
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