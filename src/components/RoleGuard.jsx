/**
 * RoleGuard.jsx
 * Protects routes based on user role and mentor status.
 * 
 * Usage:
 *   <RoleGuard roles={['Mentor', 'Admin']}>  — only approved mentors or admins
 *   <RoleGuard roles={['Mentor', 'Admin']} allowPending>  — also lets pending mentors through (own preview)
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function RoleGuard({ children, roles = [], allowPending = false }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Not logged in → redirect to login
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role;
  const mentorStatus = user?.mentorStatus;

  // Admin always passes through
  if (userRole === 'Admin') return children;

  // Check if the role is allowed
  const roleAllowed = roles.includes(userRole);

  // For mentors: must be approved, OR pending is allowed (own profile preview)
  if (roleAllowed && userRole === 'Mentor') {
    if (mentorStatus === 'approved') return children;
    if (allowPending && mentorStatus === 'pending') return children;
    // rejected or no status
    return (
      <div style={{ maxWidth: '500px', margin: '80px auto', padding: '32px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
          {mentorStatus === 'pending' ? '⏳' : '❌'}
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', margin: '0 0 8px' }}>
          {mentorStatus === 'pending' ? 'Application Under Review' : 'Access Restricted'}
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
          {mentorStatus === 'pending'
            ? 'Your mentor application is pending admin approval. You\'ll be notified once reviewed. You can preview your profile below.'
            : 'Your mentor application was not approved. Please contact support.'}
        </p>
        {mentorStatus === 'pending' && (
          <a href="/mentor-profile-preview" style={{ display: 'inline-block', background: '#4F46E5', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
            Preview My Profile
          </a>
        )}
      </div>
    );
  }

  // Non-mentor role not in allowed list
  if (!roleAllowed) {
    return (
      <div style={{ maxWidth: '500px', margin: '80px auto', padding: '32px', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1E293B', margin: '0 0 8px' }}>Access Denied</h2>
        <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
          This page is only available to mentors and admins.
        </p>
        <a href="/become-a-mentor" style={{ display: 'inline-block', background: '#4F46E5', color: '#fff', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>
          Apply to Become a Mentor →
        </a>
      </div>
    );
  }

  return children;
}
