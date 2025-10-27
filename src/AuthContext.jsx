<<<<<<< HEAD
=======
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import config from './config';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const role = localStorage.getItem('role');

//     if (token && role) {
//       // Verify token is still valid
//       verifyToken(token);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   // const verifyToken = async (token) => {


//   //   try {
//   //     const response = await axios.get(`${config.API_BASE_URL}/auth/me`, {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //         'Content-Type': 'application/json'
//   //       }
//   //     });

//   //     if (response.data) {
//   //       setUser({
//   //         ...response.data,
//   //         id: response.data._id,
//   //         token,
//   //         role: localStorage.getItem('role')
//   //       });
//   //     } else {
//   //       // Invalid response, clear auth
//   //       clearAuth();
//   //     }
//   //   } catch (error) {
//   //     console.error('Token verification failed:', error.response?.status, error.response?.data);

//   //     // Clear auth data on any auth failure
//   //     clearAuth();
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };


//   // In AuthContext.jsx - Replace the verifyToken function

// const verifyToken = async (token) => {
//   try {
//     console.log('Verifying token...');
//     const response = await axios.get(`${config.API_BASE_URL}/auth/me`, {
//       headers: { 
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       }
//     });
    
//     console.log('Token verification response:', response.data);
    
//     if (response.data) {
//       // Ensure both id and _id are set
//       const userObj = {
//         ...response.data, 
//         _id: response.data._id || response.data.id,
//         id: response.data._id || response.data.id,
//         token, 
//         role: localStorage.getItem('role') 
//       };
      
//       setUser(userObj);
      
//       // Store userId in localStorage for backup
//       localStorage.setItem('userId', userObj._id);
      
//       console.log('User authenticated successfully:', userObj.username, userObj.role, 'ID:', userObj._id);
//     } else {
//       console.log('Invalid response from /auth/me');
//       clearAuth();
//     }
//   } catch (error) {
//     console.error('Token verification failed:', error.response?.status, error.response?.data);
//     clearAuth();
//   } finally {
//     setLoading(false);
//   }
// };

//   const clearAuth = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//     localStorage.removeItem('role');
//   };

//   const login = (userData) => {
//     console.log('Login data received:', userData);

//     // Ensure we have both id and _id for compatibility
//     const userObj = {
//       ...userData.user,
//       _id: userData.user._id || userData.user.id,
//       id: userData.user._id || userData.user.id,
//       token: userData.token,
//       role: userData.role
//     };

//     console.log('Processed user object:', userObj);

//     setUser(userObj);

//     localStorage.setItem('token', userData.token);
//     localStorage.setItem('role', userData.role);
//     localStorage.setItem('userId', userObj._id); // Store userId separately

//     console.log('User logged in and stored:', userObj.username, userObj.role, 'ID:', userObj._id);
//   };

//   const logout = () => {
//     clearAuth();
//     // Redirect to login page
//     window.location.href = '/login';
//   };

//   const isAuthenticated = () => {
//     return !!user && !!localStorage.getItem('token');
//   };

//   const hasRole = (requiredRole) => {
//     return user?.role === requiredRole;
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider value={{
//       user,
//       login,
//       logout,
//       isAuthenticated,
//       hasRole,
//       loading
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


>>>>>>> backup-feature-update
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from './config';

const AuthContext = createContext();

<<<<<<< HEAD
=======
// Setup axios interceptors globally
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

>>>>>>> backup-feature-update
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

<<<<<<< HEAD
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role) {
      // Verify token is still valid
=======
  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    // Setup axios interceptors with clearAuth callback
    setupAxiosInterceptors(clearAuth);

    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('AuthProvider initializing - Token exists:', !!token, 'Role:', role);

    if (token && role) {
>>>>>>> backup-feature-update
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
<<<<<<< HEAD
=======
      console.log('Verifying token...');
>>>>>>> backup-feature-update
      const response = await axios.get(`${config.API_BASE_URL}/auth/me`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
<<<<<<< HEAD
      if (response.data) {
        setUser({ 
          ...response.data, 
          id: response.data._id,
          token, 
          role: localStorage.getItem('role') 
        });
      } else {
        // Invalid response, clear auth
=======
      console.log('Token verification response:', response.data);
      
      if (response.data) {
        // Ensure both id and _id are set
        const userObj = {
          ...response.data, 
          _id: response.data._id || response.data.id,
          id: response.data._id || response.data.id,
          token, 
          role: localStorage.getItem('role') 
        };
        
        setUser(userObj);
        
        // Store userId in localStorage for backup
        localStorage.setItem('userId', userObj._id);
        
        console.log('User authenticated successfully:', userObj.username, userObj.role, 'ID:', userObj._id);
      } else {
        console.log('Invalid response from /auth/me');
>>>>>>> backup-feature-update
        clearAuth();
      }
    } catch (error) {
      console.error('Token verification failed:', error.response?.status, error.response?.data);
<<<<<<< HEAD
      
      // Clear auth data on any auth failure
=======
>>>>>>> backup-feature-update
      clearAuth();
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  const login = (userData) => {
    console.log('Login data received:', userData);
    
    setUser({
      ...userData,
      id: userData._id || userData.id,
    });
    
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
  };

  const logout = () => {
=======
  const login = (userData) => {
    console.log('Login data received:', userData);

    // Ensure we have both id and _id for compatibility
    const userObj = {
      ...userData.user,
      _id: userData.user._id || userData.user.id,
      id: userData.user._id || userData.user.id,
      token: userData.token,
      role: userData.role
    };

    console.log('Processed user object:', userObj);

    setUser(userObj);

    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('userId', userObj._id);

    console.log('User logged in and stored:', userObj.username, userObj.role, 'ID:', userObj._id);
  };

  const logout = () => {
    console.log('Logging out user...');
>>>>>>> backup-feature-update
    clearAuth();
    // Redirect to login page
    window.location.href = '/login';
  };

  const isAuthenticated = () => {
<<<<<<< HEAD
    return !!user && !!localStorage.getItem('token');
  };

  const hasRole = (requiredRole) => {
    return user?.role === requiredRole;
=======
    const hasUser = !!user;
    const hasToken = !!localStorage.getItem('token');
    return hasUser && hasToken;
  };

  const hasRole = (requiredRole) => {
    const userRole = user?.role;
    const hasRequiredRole = userRole === requiredRole;
    return hasRequiredRole;
>>>>>>> backup-feature-update
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      hasRole,
      loading 
=======
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated,
      hasRole,
      loading
>>>>>>> backup-feature-update
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