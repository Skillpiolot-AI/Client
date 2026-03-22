const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json',
});

export const groupService = {
  // Fetch all groups with filtering
  async fetchGroups(filters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await fetch(`${API_BASE}/groups?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch groups');
    return response.json();
  },

  // Fetch user's groups
  async fetchMyGroups() {
    const response = await fetch(`${API_BASE}/groups/my-groups`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch my groups');
    return response.json();
  },

  // Fetch single group details
  async fetchGroupById(groupId) {
    const response = await fetch(`${API_BASE}/groups/${groupId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch group');
    return response.json();
  },

  // Create new group
  async createGroup(groupData) {
    const response = await fetch(`${API_BASE}/groups`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(groupData),
    });
    
    if (!response.ok) throw new Error('Failed to create group');
    return response.json();
  },

  // Join a group
  async joinGroup(groupId) {
    const response = await fetch(`${API_BASE}/groups/${groupId}/join`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to join group');
    return response.json();
  },

  // Leave a group
  async leaveGroup(groupId) {
    const response = await fetch(`${API_BASE}/groups/${groupId}/leave`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to leave group');
    return response.json();
  },

  // Get group members
  async getGroupMembers(groupId) {
    const response = await fetch(`${API_BASE}/groups/${groupId}/members`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch members');
    return response.json();
  },

  // Get group reports
  async getGroupReports(groupId) {
    const response = await fetch(`${API_BASE}/groups/${groupId}/reports`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
  },

  // Ban user from group
  async banUser(groupId, banData) {
    const response = await fetch(`${API_BASE}/groups/${groupId}/ban-user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(banData),
    });
    
    if (!response.ok) throw new Error('Failed to ban user');
    return response.json();
  },

  // Mute user in group
  async muteUser(groupId, muteData) {
    const response = await fetch(`${API_BASE}/groups/${groupId}/mute-user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(muteData),
    });
    
    if (!response.ok) throw new Error('Failed to mute user');
    return response.json();
  },

  // Validate invite code
  async validateInviteCode(inviteCode) {
    const response = await fetch(`${API_BASE}/groups/invite/${inviteCode}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) throw new Error('Invalid invite code');
    return response.json();
  },

  // Join group with invite code
  async joinGroupWithInviteCode(groupId, inviteCode) {
    const response = await fetch(`${API_BASE}/groups/${groupId}/join-with-code`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ inviteCode }),
    });
    
    if (!response.ok) throw new Error('Failed to join group');
    return response.json();
  },
};
