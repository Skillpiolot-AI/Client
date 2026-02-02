import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Save the attempted URL and redirect to login with that info
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (allowedRoles.includes(user.role)) {
    return <Outlet />;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;