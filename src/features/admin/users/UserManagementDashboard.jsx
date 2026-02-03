import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Edit, Trash2, CheckCircle, XCircle, 
  MoreVertical, Shield, Mail, Calendar, Activity, AlertCircle,
  RefreshCw, Download, Upload, Lock, Eye, ChevronLeft, ChevronRight,
  Loader2, Check, X, UserCheck, UserX
} from 'lucide-react';
import config from '../../config/config';

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    isVerified: '',
    isActive: '',
    isSuspended: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    perPage: 10
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [actionLoading, setActionLoading] = useState(false);

  const roles = ['User', 'Mentor', 'Admin', 'UniAdmin', 'UniTeach', 'Student'];

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, [pagination.currentPage, filters, sortBy, sortOrder, searchTerm]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.perPage,
        sortBy,
        sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.role && { role: filters.role }),
        ...(filters.isVerified && { isVerified: filters.isVerified }),
        ...(filters.isActive && { isActive: filters.isActive }),
        ...(filters.isSuspended && { isSuspended: filters.isSuspended })
      });

      const response = await fetch(`${config.API_BASE_URL}/user-data/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        showNotification('error', data.message || 'Failed to fetch users');
      }
    } catch (error) {
      showNotification('error', 'Network error. Please try again.');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/statistics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(user => user._id));
    }
  };

  const handleEdit = (user) => {
    setEditingUser({...user});
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingUser)
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'User updated successfully');
        setShowEditModal(false);
        fetchUsers();
      } else {
        showNotification('error', data.message || 'Failed to update user');
      }
    } catch (error) {
      showNotification('error', 'Network error. Please try again.');
      console.error('Error updating user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/${deletingUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', `User ${deletingUser.name} deleted successfully`);
        setShowDeleteModal(false);
        fetchUsers();
        fetchStatistics();
      } else {
        showNotification('error', data.message || 'Failed to delete user');
      }
    } catch (error) {
      showNotification('error', 'Network error. Please try again.');
      console.error('Error deleting user:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      showNotification('error', 'Please select users to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ userIds: selectedUsers })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', `Successfully deleted ${data.deletedCount} users`);
        setSelectedUsers([]);
        fetchUsers();
        fetchStatistics();
      } else {
        showNotification('error', data.message || 'Failed to delete users');
      }
    } catch (error) {
      showNotification('error', 'Network error. Please try again.');
      console.error('Error bulk deleting users:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', `User ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
      } else {
        showNotification('error', data.message || 'Failed to update user status');
      }
    } catch (error) {
      showNotification('error', 'Network error. Please try again.');
      console.error('Error toggling status:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) {
      showNotification('error', 'Password must be at least 6 characters');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ newPassword, sendEmail: true })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'Password reset successfully. Email sent to user.');
      } else {
        showNotification('error', data.message || 'Failed to reset password');
      }
    } catch (error) {
      showNotification('error', 'Network error. Please try again.');
      console.error('Error resetting password:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      Admin: 'bg-red-500',
      Mentor: 'bg-purple-500',
      User: 'bg-blue-500',
      UniAdmin: 'bg-green-500',
      UniTeach: 'bg-yellow-500',
      Student: 'bg-cyan-500'
    };
    return colors[role] || 'bg-gray-500';
  };

  const safeString = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    try {
      return String(value);
    } catch (e) {
      return fallback;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const d = new Date(dateString);
    if (isNaN(d)) return '—';
    return d.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-lg shadow-2xl transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-3">
            {notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center">
                <Users className="w-10 h-10 mr-3" />
                User Management Dashboard
              </h1>
              <p className="text-purple-300">Manage all users, roles, and permissions</p>
            </div>
            <button
              onClick={fetchUsers}
              className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all flex items-center space-x-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
          </div>

          {/* Statistics Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm mb-1">Total Users</p>
                    <p className="text-3xl font-bold text-white">{stats.overview.total}</p>
                  </div>
                  <Users className="w-12 h-12 text-blue-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm mb-1">Active</p>
                    <p className="text-3xl font-bold text-green-400">{stats.overview.active}</p>
                  </div>
                  <UserCheck className="w-12 h-12 text-green-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm mb-1">Verified</p>
                    <p className="text-3xl font-bold text-cyan-400">{stats.overview.verified}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-cyan-400" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm mb-1">Suspended</p>
                    <p className="text-3xl font-bold text-red-400">{stats.overview.suspended}</p>
                  </div>
                  <UserX className="w-12 h-12 text-red-400" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Role Filter */}
            <select
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-slate-800">All Roles</option>
              {roles.map(role => (
                <option key={role} value={role} className="bg-slate-800">{role}</option>
              ))}
            </select>

            {/* Verified Filter */}
            <select
              value={filters.isVerified}
              onChange={(e) => setFilters({...filters, isVerified: e.target.value})}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-slate-800">All Status</option>
              <option value="true" className="bg-slate-800">Verified</option>
              <option value="false" className="bg-slate-800">Unverified</option>
            </select>

            {/* Active Filter */}
            <select
              value={filters.isActive}
              onChange={(e) => setFilters({...filters, isActive: e.target.value})}
              className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" className="bg-slate-800">All Users</option>
              <option value="true" className="bg-slate-800">Active</option>
              <option value="false" className="bg-slate-800">Inactive</option>
            </select>

            {/* Bulk Actions */}
            {selectedUsers.length > 0 && (
              <button
                onClick={handleBulkDelete}
                disabled={actionLoading}
                className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Trash2 className="w-5 h-5" />
                <span>Delete ({selectedUsers.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Users className="w-16 h-16 text-purple-300 mb-4" />
              <p className="text-white text-xl">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === users.length}
                          onChange={handleSelectAll}
                          className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-purple-300">Joined</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-purple-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500 focus:ring-purple-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                              {safeString(user.name).charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-medium">{safeString(user.name) || 'Unknown User'}</p>
                                <p className="text-purple-300 text-sm">@{safeString(user.username)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-purple-300" />
                              <span className="text-white">{safeString(user.email)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              {user.isActive ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                              <span className={`text-sm ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {user.isVerified ? (
                                <CheckCircle className="w-4 h-4 text-cyan-400" />
                              ) : (
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                              )}
                              <span className={`text-sm ${user.isVerified ? 'text-cyan-400' : 'text-yellow-400'}`}>
                                {user.isVerified ? 'Verified' : 'Unverified'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-purple-300">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">{formatDate(user.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all"
                              title="Edit user"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(user._id, user.isActive)}
                              className={`p-2 rounded-lg transition-all ${
                                user.isActive 
                                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30' 
                                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              }`}
                              title={user.isActive ? 'Deactivate' : 'Activate'}
                            >
                              {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleResetPassword(user._id)}
                              className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-all"
                              title="Reset password"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(user)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-white/5 flex items-center justify-between">
                <div className="text-purple-300 text-sm">
                  Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} users
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setPagination({...pagination, currentPage: pagination.currentPage - 1})}
                    disabled={pagination.currentPage === 1}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 bg-white/10 text-white rounded-lg">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPagination({...pagination, currentPage: pagination.currentPage + 1})}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <Edit className="w-6 h-6 mr-2" />
                Edit User
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-purple-300 text-sm mb-2">Username</label>
                  <input
                    type="text"
                    value={editingUser.username}
                    onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-purple-300 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-purple-300 text-sm mb-2">Role</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {roles.map(role => (
                      <option key={role} value={role} className="bg-slate-800">{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-purple-300 text-sm mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={editingUser.phoneNumber || ''}
                    onChange={(e) => setEditingUser({...editingUser, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.isActive}
                    onChange={(e) => setEditingUser({...editingUser, isActive: e.target.checked})}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500"
                  />
                  <span className="text-white">Active</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingUser.isVerified}
                    onChange={(e) => setEditingUser({...editingUser, isVerified: e.target.checked})}
                    className="w-5 h-5 rounded border-white/20 bg-white/10 text-purple-500"
                  />
                  <span className="text-white">Verified</span>
                </label>
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex justify-end space-x-4">
              <button
                onClick={() => setShowEditModal(false)}
                disabled={actionLoading}
                className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateUser}
                disabled={actionLoading}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Update User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-slate-800 rounded-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">Delete User?</h2>
                <p className="text-purple-300 text-center mb-6">
                Are you sure you want to delete <strong className="text-white">{safeString(deletingUser.name) || 'this user'}</strong>? This action cannot be undone.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={actionLoading}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      <span>Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementDashboard;