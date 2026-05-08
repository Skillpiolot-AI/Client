import React, { useState, useEffect } from 'react';
import {
  Users, Search, Edit, Trash2, CheckCircle, XCircle,
  Shield, Mail, Calendar, AlertCircle, RefreshCw,
  Lock, ChevronLeft, ChevronRight, Loader2, Check, X,
  UserCheck, UserX
} from 'lucide-react';
import config from '../../config';

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ role: '', isVerified: '', isActive: '', isSuspended: '' });
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, perPage: 10 });
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
        page: pagination.currentPage, limit: pagination.perPage, sortBy, sortOrder,
        ...(searchTerm && { search: searchTerm }),
        ...(filters.role && { role: filters.role }),
        ...(filters.isVerified && { isVerified: filters.isVerified }),
        ...(filters.isActive && { isActive: filters.isActive }),
        ...(filters.isSuspended && { isSuspended: filters.isSuspended }),
      });
      const response = await fetch(`${config.API_BASE_URL}/user-data/users?${queryParams}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok) { setUsers(data.users); setPagination(data.pagination); }
      else showNotification('error', data.message || 'Failed to fetch users');
    } catch { showNotification('error', 'Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/statistics`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok) setStats(data.stats);
    } catch { /* silent */ }
  };

  const handleSelectUser = (userId) =>
    setSelectedUsers(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);

  const handleSelectAll = () =>
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map(u => u._id));

  const handleEdit = (user) => { setEditingUser({ ...user }); setShowEditModal(true); };

  const handleUpdateUser = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(editingUser),
      });
      const data = await response.json();
      if (response.ok) { showNotification('success', 'User updated successfully'); setShowEditModal(false); fetchUsers(); }
      else showNotification('error', data.message || 'Failed to update user');
    } catch { showNotification('error', 'Network error.'); }
    finally { setActionLoading(false); }
  };

  const handleDelete = (user) => { setDeletingUser(user); setShowDeleteModal(true); };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/${deletingUser._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if (response.ok) { showNotification('success', `User ${deletingUser.name} deleted`); setShowDeleteModal(false); fetchUsers(); fetchStatistics(); }
      else showNotification('error', data.message || 'Failed to delete user');
    } catch { showNotification('error', 'Network error.'); }
    finally { setActionLoading(false); }
  };

  const handleBulkDelete = async () => {
    if (!selectedUsers.length) return showNotification('error', 'Select users first');
    if (!window.confirm(`Delete ${selectedUsers.length} users?`)) return;
    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/bulk-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ userIds: selectedUsers }),
      });
      const data = await response.json();
      if (response.ok) { showNotification('success', `Deleted ${data.deletedCount} users`); setSelectedUsers([]); fetchUsers(); fetchStatistics(); }
      else showNotification('error', data.message || 'Failed');
    } catch { showNotification('error', 'Network error.'); }
    finally { setActionLoading(false); }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/${userId}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      const data = await response.json();
      if (response.ok) { showNotification('success', `User ${!currentStatus ? 'activated' : 'deactivated'}`); fetchUsers(); }
      else showNotification('error', data.message || 'Failed');
    } catch { showNotification('error', 'Network error.'); }
    finally { setActionLoading(false); }
  };

  const handleResetPassword = async (userId) => {
    const newPassword = prompt('Enter new password (min 6 characters):');
    if (!newPassword || newPassword.length < 6) return showNotification('error', 'Password must be at least 6 characters');
    setActionLoading(true);
    try {
      const response = await fetch(`${config.API_BASE_URL}/user-data/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ newPassword, sendEmail: true }),
      });
      const data = await response.json();
      if (response.ok) showNotification('success', 'Password reset. Email sent to user.');
      else showNotification('error', data.message || 'Failed');
    } catch { showNotification('error', 'Network error.'); }
    finally { setActionLoading(false); }
  };

  const roleBadge = (role) => {
    const map = { Admin: 'bg-red-100 text-red-700', Mentor: 'bg-purple-100 text-purple-700', User: 'bg-blue-100 text-blue-700', UniAdmin: 'bg-green-100 text-green-700', UniTeach: 'bg-yellow-100 text-yellow-800', Student: 'bg-cyan-100 text-cyan-700' };
    return map[role] || 'bg-gray-100 text-gray-600';
  };

  const safeStr = (v, fb = '') => { try { return v != null ? String(v) : fb; } catch { return fb; } };
  const fmtDate = (d) => { if (!d) return '—'; const dt = new Date(d); return isNaN(dt) ? '—' : dt.toLocaleDateString(); };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.overview.total, icon: <Users className="w-6 h-6 text-blue-500" />, color: 'bg-blue-50 border-blue-100' },
    { label: 'Active', value: stats.overview.active, icon: <UserCheck className="w-6 h-6 text-green-500" />, color: 'bg-green-50 border-green-100' },
    { label: 'Verified', value: stats.overview.verified, icon: <CheckCircle className="w-6 h-6 text-indigo-500" />, color: 'bg-indigo-50 border-indigo-100' },
    { label: 'Suspended', value: stats.overview.suspended, icon: <UserX className="w-6 h-6 text-red-500" />, color: 'bg-red-50 border-red-100' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50 font-body">
      {/* Toast */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 text-white text-sm font-medium ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              User Management
            </h1>
            <p className="text-gray-500 mt-1">Manage all platform users, roles, and permissions</p>
          </div>
          <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-all shadow-sm text-sm font-medium">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Stat Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className={`${s.color} border rounded-2xl p-5 flex items-center justify-between`}>
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-1">{s.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                </div>
                {s.icon}
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Search by name, email, or username..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            {[
              { label: 'All Roles', val: filters.role, key: 'role', opts: roles.map(r => ({ v: r, l: r })) },
              { label: 'All Status', val: filters.isVerified, key: 'isVerified', opts: [{ v: 'true', l: 'Verified' }, { v: 'false', l: 'Unverified' }] },
              { label: 'All Users', val: filters.isActive, key: 'isActive', opts: [{ v: 'true', l: 'Active' }, { v: 'false', l: 'Inactive' }] },
            ].map(f => (
              <select key={f.key} value={f.val} onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
                className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option value="">{f.label}</option>
                {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            ))}
            {selectedUsers.length > 0 && (
              <button onClick={handleBulkDelete} disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-all disabled:opacity-50">
                <Trash2 className="w-4 h-4" /> Delete ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Users className="w-14 h-14 mb-4" />
              <p className="text-lg font-medium">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-5 py-3 text-left">
                        <input type="checkbox" checked={selectedUsers.length === users.length && users.length > 0} onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-gray-300 text-primary" />
                      </th>
                      {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} className={`px-5 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={() => handleSelectUser(user._id)}
                            className="w-4 h-4 rounded border-gray-300 text-primary" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                              {safeStr(user.name).charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{safeStr(user.name) || 'Unknown'}</p>
                              <p className="text-gray-400 text-xs">@{safeStr(user.username)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate max-w-[200px]">{safeStr(user.email)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleBadge(user.role)}`}>{user.role}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className={`flex items-center gap-1.5 text-xs ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
                              {user.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                              {user.isActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className={`flex items-center gap-1.5 text-xs ${user.isVerified ? 'text-indigo-600' : 'text-amber-500'}`}>
                              {user.isVerified ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                            <Calendar className="w-3.5 h-3.5" />{fmtDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button onClick={() => handleEdit(user)} title="Edit" className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"><Edit className="w-4 h-4" /></button>
                            <button onClick={() => handleToggleStatus(user._id, user.isActive)} title={user.isActive ? 'Deactivate' : 'Activate'}
                              className={`p-1.5 rounded-lg transition-colors ${user.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}>
                              {user.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleResetPassword(user._id)} title="Reset password" className="p-1.5 rounded-lg text-purple-500 hover:bg-purple-50 transition-colors"><Lock className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete(user)} title="Delete" className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                <p className="text-sm text-gray-500">
                  Showing {((pagination.currentPage - 1) * pagination.perPage) + 1}–{Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} users
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })} disabled={pagination.currentPage === 1}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-1.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 font-medium">
                    {pagination.currentPage} / {pagination.totalPages}
                  </span>
                  <button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })} disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Edit className="w-5 h-5 text-primary" /> Edit User</h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[['Name', 'name', 'text'], ['Username', 'username', 'text']].map(([lbl, key, type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{lbl}</label>
                    <input type={type} value={editingUser[key] || ''} onChange={e => setEditingUser({ ...editingUser, [key]: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={editingUser.email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                  <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white">
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input type="text" value={editingUser.phoneNumber || ''} onChange={e => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
              <div className="flex items-center gap-6">
                {[['isActive', 'Active'], ['isVerified', 'Verified']].map(([key, lbl]) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={editingUser[key]} onChange={e => setEditingUser({ ...editingUser, [key]: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-primary" />
                    <span className="text-sm text-gray-700">{lbl}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleUpdateUser} disabled={actionLoading}
                className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:opacity-90 flex items-center gap-2 disabled:opacity-50">
                {actionLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : <><Check className="w-4 h-4" />Save Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-6 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete User?</h2>
              <p className="text-gray-500 text-sm mb-6">
                You are about to permanently delete <strong className="text-gray-900">{safeStr(deletingUser.name) || 'this user'}</strong>. This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={confirmDelete} disabled={actionLoading}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 flex items-center justify-center gap-2 disabled:opacity-50">
                  {actionLoading ? <><Loader2 className="w-4 h-4 animate-spin" />Deleting…</> : <><Trash2 className="w-4 h-4" />Delete</>}
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