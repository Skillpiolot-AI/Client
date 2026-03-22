import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GroupProvider } from '../contexts/GroupContext';
import LoadingSpinner from '../components/LoadingSpinner';

// Lazy load all community pages
const CommunityHomePage = lazy(() => import('../Pages/Community/CommunityHomePage'));
const GroupDiscoveryPage = lazy(() => import('../Pages/Community/GroupDiscoveryPage'));
const GroupDetailPage = lazy(() => import('../Pages/Community/GroupDetailPage'));
const GroupChatPage = lazy(() => import('../Pages/Community/GroupChatPage'));
const CreateGroupPage = lazy(() => import('../Pages/Community/CreateGroupPage'));
const MyGroupsPage = lazy(() => import('../Pages/Community/MyGroupsPage'));
const GroupSettingsPage = lazy(() => import('../Pages/Community/GroupSettingsPage'));
const GroupAdminPage = lazy(() => import('../Pages/Community/GroupAdminPage'));
const JoinGroupPage = lazy(() => import('../Pages/Community/JoinGroupPage'));

const ProtectedGroupRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

export default function GroupRoutes() {
  return (
    <GroupProvider>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<CommunityHomePage />} />
          <Route path="/discover" element={<GroupDiscoveryPage />} />
          <Route path="/groups/:id" element={<GroupDetailPage />} />
          <Route path="/join/:inviteCode" element={<JoinGroupPage />} />
          
          {/* Protected routes */}
          <Route 
            path="/chat/:groupId" 
            element={
              <ProtectedGroupRoute>
                <GroupChatPage />
              </ProtectedGroupRoute>
            } 
          />
          <Route 
            path="/create" 
            element={
              <ProtectedGroupRoute>
                <CreateGroupPage />
              </ProtectedGroupRoute>
            } 
          />
          <Route 
            path="/my-groups" 
            element={
              <ProtectedGroupRoute>
                <MyGroupsPage />
              </ProtectedGroupRoute>
            } 
          />
          <Route 
            path="/groups/:id/settings" 
            element={
              <ProtectedGroupRoute>
                <GroupSettingsPage />
              </ProtectedGroupRoute>
            } 
          />
          <Route 
            path="/groups/:id/admin" 
            element={
              <ProtectedGroupRoute>
                <GroupAdminPage />
              </ProtectedGroupRoute>
            } 
          />
        </Routes>
      </Suspense>
    </GroupProvider>
  );
}
