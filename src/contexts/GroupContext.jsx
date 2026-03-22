import React, { createContext, useContext, useState, useCallback } from 'react';

const GroupContext = createContext();

// Helper function to get API base URL from environment
const getApiBase = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [currentGroup, setCurrentGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all groups
  const fetchGroups = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.page) queryParams.append('page', filters.page);
      if (filters.limit) queryParams.append('limit', filters.limit);

      const response = await fetch(`${getApiBase()}/groups?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch groups');
      const data = await response.json();
      setGroups(data.groups || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching groups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch user's groups
  const fetchMyGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiBase()}/groups/my-groups`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch user groups');
      const data = await response.json();
      setMyGroups(data.groups || []);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching my groups:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single group
  const fetchGroupById = useCallback(async (groupId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiBase()}/groups/${groupId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch group');
      const data = await response.json();
      setCurrentGroup(data.group);
      return data.group;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching group:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new group
  const createGroup = useCallback(async (groupData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiBase()}/groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      if (!response.ok) throw new Error('Failed to create group');
      const data = await response.json();
      setCurrentGroup(data.group);
      await fetchGroups();
      return data.group;
    } catch (err) {
      setError(err.message);
      console.error('Error creating group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchGroups]);

  // Join group
  const joinGroup = useCallback(async (groupId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiBase()}/groups/${groupId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to join group');
      const data = await response.json();
      await fetchMyGroups();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error joining group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyGroups]);

  // Leave group
  const leaveGroup = useCallback(async (groupId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiBase()}/groups/${groupId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to leave group');
      await fetchMyGroups();
      return true;
    } catch (err) {
      setError(err.message);
      console.error('Error leaving group:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyGroups]);

  // Get group members
  const getGroupMembers = useCallback(async (groupId) => {
    try {
      const response = await fetch(`${getApiBase()}/groups/${groupId}/members`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch members');
      const data = await response.json();
      setGroupMembers(data.members || []);
      return data.members;
    } catch (err) {
      setError(err.message);
      console.error('Error fetching members:', err);
    }
  }, []);

  // Get reports
  const getReports = useCallback(async (groupId) => {
    try {
      const response = await fetch(`${getApiBase()}/groups/${groupId}/reports`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch reports');
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reports:', err);
    }
  }, []);

  // Ban user
  const banUser = useCallback(async (groupId, banData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiBase()}/groups/${groupId}/ban-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(banData),
      });

      if (!response.ok) throw new Error('Failed to ban user');
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error('Error banning user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mute user
  const muteUser = useCallback(async (groupId, muteData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiBase()}/groups/${groupId}/mute-user`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(muteData),
      });

      if (!response.ok) throw new Error('Failed to mute user');
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error('Error muting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Validate invite code
  const validateInviteCode = useCallback(async (inviteCode) => {
    try {
      const response = await fetch(`${getApiBase()}/groups/invite/${inviteCode}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Invalid invite code');
      return await response.json();
    } catch (err) {
      setError(err.message);
      console.error('Error validating invite code:', err);
    }
  }, []);

  // Join with invite code
  const joinGroupWithInviteCode = useCallback(async (groupId, inviteCode) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${getApiBase()}/groups/${groupId}/join-with-code`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inviteCode }),
      });

      if (!response.ok) throw new Error('Failed to join group with invite code');
      const data = await response.json();
      await fetchMyGroups();
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Error joining with invite code:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchMyGroups]);

  const value = {
    groups,
    myGroups,
    currentGroup,
    groupMembers,
    loading,
    error,
    fetchGroups,
    fetchMyGroups,
    fetchGroupById,
    createGroup,
    joinGroup,
    leaveGroup,
    getGroupMembers,
    getReports,
    banUser,
    muteUser,
    validateInviteCode,
    joinGroupWithInviteCode,
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroupContext must be used within GroupProvider');
  }
  return context;
};
