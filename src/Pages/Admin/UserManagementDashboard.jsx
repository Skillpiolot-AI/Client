// Removed lucide-react imports
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
    { label: 'Total Users', value: stats.overview.total, icon: 'groups', color: 'text-primary', bgColor: 'bg-primary-container/20' },
    { label: 'Active', value: stats.overview.active, icon: 'person_check', color: 'text-green-500', bgColor: 'bg-green-100/50' },
    { label: 'Verified', value: stats.overview.verified, icon: 'verified', color: 'text-indigo-500', bgColor: 'bg-indigo-100/50' },
    { label: 'Suspended', value: stats.overview.suspended, icon: 'person_off', color: 'text-error', bgColor: 'bg-error-container/20' },
  ] : [];

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface">
      {/* Toast */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-lg flex items-center gap-3 text-white text-sm font-medium ${notification.type === 'success' ? 'bg-green-600' : 'bg-error'}`}>
          <span className="material-symbols-outlined">{notification.type === 'success' ? 'check_circle' : 'error'}</span>
          {notification.message}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-headline font-extrabold text-primary flex items-center gap-3 tracking-tight">
              <span className="material-symbols-outlined text-4xl">groups</span>
              User Management
            </h1>
            <p className="text-secondary mt-1">Manage all platform users, roles, and permissions</p>
          </div>
          <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant rounded-xl text-on-surface hover:bg-surface-container-high transition-all shadow-sm text-sm font-medium">
            <span className="material-symbols-outlined text-sm">refresh</span> Refresh
          </button>
        </div>

        {/* Stat Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statCards.map((s) => (
              <div key={s.label} className={`${s.bgColor} rounded-2xl p-5 flex items-center justify-between border border-outline-variant/10 hover:shadow-md transition-shadow`}>
                <div>
                  <p className="text-[10px] text-secondary font-label tracking-widest uppercase mb-1">{s.label}</p>
                  <p className="text-2xl font-headline font-bold text-on-surface">{s.value}</p>
                </div>
                <span className={`material-symbols-outlined text-3xl ${s.color}`}>{s.icon}</span>
              </div>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-5 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-lg">search</span>
              <input type="text" placeholder="Search by name, email, or username..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            {[
              { label: 'All Roles', val: filters.role, key: 'role', opts: roles.map(r => ({ v: r, l: r })) },
              { label: 'All Status', val: filters.isVerified, key: 'isVerified', opts: [{ v: 'true', l: 'Verified' }, { v: 'false', l: 'Unverified' }] },
              { label: 'All Users', val: filters.isActive, key: 'isActive', opts: [{ v: 'true', l: 'Active' }, { v: 'false', l: 'Inactive' }] },
            ].map(f => (
              <select key={f.key} value={f.val} onChange={e => setFilters({ ...filters, [f.key]: e.target.value })}
                className="px-3 py-2.5 bg-surface border border-outline-variant/30 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                <option value="">{f.label}</option>
                {f.opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </select>
            ))}
            {selectedUsers.length > 0 && (
              <button onClick={handleBulkDelete} disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-error text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-md">
                <span className="material-symbols-outlined text-sm">delete</span> Delete ({selectedUsers.length})
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl shadow-lg overflow-hidden transition-all">
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-secondary opacity-60">
              <span className="material-symbols-outlined text-6xl mb-4">search_off</span>
              <p className="text-lg font-headline font-medium tracking-tight">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-container-low/50 border-b border-outline-variant/20">
                      <th className="px-5 py-4 text-left">
                        <input type="checkbox" checked={selectedUsers.length === users.length && users.length > 0} onChange={handleSelectAll}
                          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all" />
                      </th>
                      {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                        <th key={h} className={`px-5 py-4 font-label font-bold text-secondary text-[10px] uppercase tracking-widest ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {users.map(user => (
                      <tr key={user._id} className="hover:bg-surface-container-low/30 transition-colors group">
                        <td className="px-5 py-4">
                          <input type="checkbox" checked={selectedUsers.includes(user._id)} onChange={() => handleSelectUser(user._id)}
                            className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all" />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-headline font-bold text-sm shadow-sm">
                              {safeStr(user.name).charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-headline font-bold text-on-surface group-hover:text-primary transition-colors">{safeStr(user.name) || 'Unknown'}</p>
                              <p className="text-secondary text-[10px] tracking-wider uppercase font-label">@{safeStr(user.username)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-secondary">
                            <span className="material-symbols-outlined text-sm opacity-50">mail</span>
                            <span className="truncate max-w-[200px] font-body">{safeStr(user.email)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase ${roleBadge(user.role)}`}>{user.role}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase ${user.isActive ? 'text-green-600' : 'text-error'}`}>
                              <span className="material-symbols-outlined text-[14px] leading-none">{user.isActive ? 'check_circle' : 'cancel'}</span>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </div>
                            <div className={`flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase ${user.isVerified ? 'text-primary' : 'text-amber-500'}`}>
                              <span className="material-symbols-outlined text-[14px] leading-none">{user.isVerified ? 'verified' : 'pending'}</span>
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-secondary text-xs">
                            <span className="material-symbols-outlined text-sm opacity-50">calendar_today</span>
                            {fmtDate(user.createdAt)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleEdit(user)} title="Edit" className="p-2 rounded-xl text-primary hover:bg-primary/10 transition-all"><span className="material-symbols-outlined text-xl">edit</span></button>
                            <button onClick={() => handleToggleStatus(user._id, user.isActive)} title={user.isActive ? 'Deactivate' : 'Activate'}
                              className={`p-2 rounded-xl transition-all ${user.isActive ? 'text-amber-500 hover:bg-amber-50' : 'text-green-500 hover:bg-green-50'}`}>
                              <span className="material-symbols-outlined text-xl">{user.isActive ? 'lock_person' : 'lock_open'}</span>
                            </button>
                            <button onClick={() => handleResetPassword(user._id)} title="Reset password" className="p-2 rounded-xl text-tertiary hover:bg-tertiary/10 transition-all"><span className="material-symbols-outlined text-xl">password</span></button>
                            <button onClick={() => handleDelete(user)} title="Delete" className="p-2 rounded-xl text-error hover:bg-error/10 transition-all"><span className="material-symbols-outlined text-xl">delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-5 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-low/30 backdrop-blur-sm">
                <p className="text-xs font-label text-secondary tracking-wide uppercase">
                  Showing <strong className="text-primary">{((pagination.currentPage - 1) * pagination.perPage) + 1}–{Math.min(pagination.currentPage * pagination.perPage, pagination.total)}</strong> of {pagination.total} users
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })} disabled={pagination.currentPage === 1}
                    className="p-2.5 rounded-xl border border-outline-variant text-secondary hover:bg-surface-container-high hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined leading-none">chevron_left</span>
                  </button>
                  <span className="px-4 py-2 text-xs font-headline font-bold bg-surface-container-high/50 border border-outline-variant rounded-xl text-on-surface">
                    {pagination.currentPage} <span className="mx-1 opacity-40">/</span> {pagination.totalPages}
                  </span>
                  <button onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })} disabled={pagination.currentPage === pagination.totalPages}
                    className="p-2.5 rounded-xl border border-outline-variant text-secondary hover:bg-surface-container-high hover:text-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                    <span className="material-symbols-outlined leading-none">chevron_right</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in duration-300">
            <div className="px-8 py-6 border-b border-outline-variant/10 flex items-center justify-between">
              <h2 className="text-2xl font-headline font-extrabold text-primary flex items-center gap-3 tracking-tight">
                <span className="material-symbols-outlined text-3xl">edit_square</span> Edit User Account
              </h2>
              <button onClick={() => setShowEditModal(false)} className="p-2 text-secondary hover:text-error hover:bg-error/10 rounded-xl transition-all"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {[['Full Name', 'name', 'text'], ['User Identifier', 'username', 'text']].map(([lbl, key, type]) => (
                  <div key={key}>
                    <label className="block text-xs font-label font-bold tracking-widest uppercase text-secondary mb-2">{lbl}</label>
                    <input type={type} value={editingUser[key] || ''} onChange={e => setEditingUser({ ...editingUser, [key]: e.target.value })}
                      className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-label font-bold tracking-widest uppercase text-secondary mb-2">Electronic Mail</label>
                <input type="email" value={editingUser.email || ''} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-label font-bold tracking-widest uppercase text-secondary mb-2">Assigned Role</label>
                  <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer">
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-label font-bold tracking-widest uppercase text-secondary mb-2">Phone Number</label>
                  <input type="text" value={editingUser.phoneNumber || ''} onChange={e => setEditingUser({ ...editingUser, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/30 rounded-2xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                </div>
              </div>
              <div className="flex items-center gap-8 pt-2">
                {[['isActive', 'Active Status'], ['isVerified', 'Verified Account']].map(([key, lbl]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={editingUser[key]} onChange={e => setEditingUser({ ...editingUser, [key]: e.target.checked })}
                      className="w-5 h-5 rounded-lg border-outline-variant/30 text-primary focus:ring-primary/20 transition-all" />
                    <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors">{lbl}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="px-8 py-6 bg-surface-container-low/50 border-t border-outline-variant/10 flex justify-end gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-6 py-3 border border-outline-variant text-secondary rounded-2xl text-sm font-semibold hover:bg-surface-container-high transition-all">Discard</button>
              <button onClick={handleUpdateUser} disabled={actionLoading}
                className="px-8 py-3 bg-primary text-white rounded-2xl text-sm font-extrabold shadow-lg hover:opacity-90 flex items-center gap-2 transition-all disabled:opacity-50">
                {actionLoading ? <><span className="material-symbols-outlined animate-spin">progress_activity</span> Updating...</> : <><span className="material-symbols-outlined text-lg">check</span> Commit Changes</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-surface-container-highest/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-surface rounded-3xl max-w-md w-full shadow-2xl border border-outline-variant/30 animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-error-container/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-5xl text-error">warning</span>
              </div>
              <h2 className="text-2xl font-headline font-extrabold text-on-surface mb-3 tracking-tight">Delete User Account?</h2>
              <p className="text-secondary text-sm leading-relaxed mb-8">
                You are about to permanently delete <strong className="text-on-surface">{safeStr(deletingUser.name) || 'this user'}</strong>. This operation is irreversible and all associated data will be purged.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 px-4 py-3 border border-outline-variant text-secondary rounded-2xl text-sm font-semibold hover:bg-surface-container-high transition-all">Cancel</button>
                <button onClick={confirmDelete} disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-error text-white rounded-2xl text-sm font-extrabold shadow-lg hover:opacity-90 flex items-center justify-center gap-2 transition-all disabled:opacity-50">
                  {actionLoading ? <><span className="material-symbols-outlined animate-spin">progress_activity</span> Purging...</> : <><span className="material-symbols-outlined text-lg">delete_forever</span> Confirm Delete</>}
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