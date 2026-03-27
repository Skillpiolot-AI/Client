import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import { useAuth } from '../../AuthContext';

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'members', label: 'Members', icon: 'group' },
  { id: 'content', label: 'Content Rules', icon: 'rule' },
  { id: 'settings', label: 'Settings', icon: 'settings' },
  { id: 'modlog', label: 'Mod Log', icon: 'history' },
  { id: 'danger', label: 'Danger Zone', icon: 'warning' },
];

const API_BASE = 'http://localhost:3001/api';
const token = () => localStorage.getItem('token');

export default function GroupAdminPage() {
  const params = useParams();
  const groupId = params.groupId || params.id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { fetchGroupById, currentGroup, getGroupMembers, groupMembers, loading: ctxLoading } = useGroupContext();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Members state
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberAction, setMemberAction] = useState(null); // 'ban' | 'mute' | 'role'
  const [actionReason, setActionReason] = useState('');
  const [muteDuration, setMuteDuration] = useState('60');
  const [newRole, setNewRole] = useState('Member');

  // Group settings state
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    description: '',
    type: 'Public',
    allowedContentTypes: { text: true, images: true, videos: true, links: true },
    postApprovalRequired: false,
    rateLimitPostsPerHour: 20,
    nsfwFilter: true,
    lockdownMode: false,
    allowMemberInvites: true,
    joinQuestion: '',
    requireJoinQuestion: false,
  });

  // Mod log (mock for demo)
  const [modLog] = useState([
    { id: 1, action: 'User Banned', actor: 'Admin', target: 'JohnDoe', reason: 'Spam', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, action: 'Post Deleted', actor: 'Moderator', target: 'a post', reason: 'Violates rules', timestamp: new Date(Date.now() - 7200000) },
    { id: 3, action: 'User Muted (24h)', actor: 'Admin', target: 'MemX', reason: 'Off-topic', timestamp: new Date(Date.now() - 86400000) },
  ]);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (!groupId) return;
    fetchGroupById(groupId).then((group) => {
      if (!group) return;
      const ownerId = String(group.owner?._id || group.owner);
      const userId = String(user?._id || user?.id);
      if (ownerId !== userId) {
        navigate(`/groups/${groupId}`);
      }
      setSettingsForm(f => ({
        ...f,
        name: group.name || '',
        description: group.description || '',
        type: group.type || 'Public',
        allowMemberInvites: group.settings?.allowMemberInvites ?? true,
        postApprovalRequired: group.settings?.postApprovalRequired ?? false,
        lockdownMode: group.settings?.lockdownMode ?? false,
        nsfwFilter: group.settings?.nsfwFilter ?? true,
        rateLimitPostsPerHour: group.settings?.rateLimitPostsPerHour ?? 20,
      }));
    });
    getGroupMembers(groupId);
  }, [groupId, user]);

  const handleBan = async () => {
    if (!selectedMember) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/groups/${groupId}/ban-user`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedMember.user?._id, reason: actionReason }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(`${selectedMember.user?.name} has been banned.`);
      getGroupMembers(groupId);
      setSelectedMember(null);
      setMemberAction(null);
    } catch (e) { showToast(e.message, 'error'); }
    setLoading(false);
  };

  const handleMute = async () => {
    if (!selectedMember) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/groups/${groupId}/mute-user`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: selectedMember.user?._id, durationMinutes: parseInt(muteDuration), reason: actionReason }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      showToast(`${selectedMember.user?.name} muted for ${muteDuration} minutes.`);
      setSelectedMember(null);
      setMemberAction(null);
    } catch (e) { showToast(e.message, 'error'); }
    setLoading(false);
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/groups/${groupId}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: settingsForm.name,
          description: settingsForm.description,
          type: settingsForm.type,
          settings: {
            allowMemberInvites: settingsForm.allowMemberInvites,
            postApprovalRequired: settingsForm.postApprovalRequired,
            lockdownMode: settingsForm.lockdownMode,
            nsfwFilter: settingsForm.nsfwFilter,
            rateLimitPostsPerHour: settingsForm.rateLimitPostsPerHour,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast('Group settings saved successfully!');
    } catch (e) { showToast(e.message || 'Failed to save settings.', 'error'); }
    setLoading(false);
  };

  const handleDeleteGroup = async (confirmName) => {
    if (confirmName !== currentGroup?.name) {
      showToast('Group name does not match.', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/groups/${groupId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token()}` },
      });
      if (!res.ok) throw new Error((await res.json()).error);
      navigate('/groups');
    } catch (e) { showToast(e.message || 'Failed to delete group.', 'error'); }
    setLoading(false);
  };

  const toggleLockdown = async () => {
    const newVal = !settingsForm.lockdownMode;
    setSettingsForm(f => ({ ...f, lockdownMode: newVal }));
    showToast(newVal ? '🔒 Lockdown enabled — posting suspended.' : '🔓 Lockdown lifted — posting resumed.');
  };

  if (ctxLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface text-on-surface antialiased font-body">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl font-semibold shadow-2xl text-sm flex items-center gap-2 transition-all ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-600 text-white'}`}>
          <span className="material-symbols-outlined text-sm">{toast.type === 'error' ? 'error' : 'check_circle'}</span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={`/groups/${groupId}`} className="p-2 hover:bg-surface-container rounded-xl transition-colors">
              <span className="material-symbols-outlined text-outline">arrow_back</span>
            </Link>
            <div>
              <nav className="flex items-center gap-2 text-on-surface-variant text-xs mb-1">
                <Link to="/groups" className="hover:text-primary transition-colors">Groups</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <Link to={`/groups/${groupId}`} className="hover:text-primary transition-colors truncate max-w-[160px]">{currentGroup?.name}</Link>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-primary font-semibold">Admin Panel</span>
              </nav>
              <h1 className="font-headline font-bold text-lg text-on-surface">Group Administration</h1>
            </div>
          </div>
          {/* Lockdown Toggle */}
          <button
            onClick={toggleLockdown}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${settingsForm.lockdownMode ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-base">{settingsForm.lockdownMode ? 'lock' : 'lock_open'}</span>
            {settingsForm.lockdownMode ? 'Lockdown Active' : 'Enable Lockdown'}
          </button>
        </div>

        {/* Tab Bar */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex gap-1 overflow-x-auto pb-0">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              } ${tab.id === 'danger' ? 'text-red-500 hover:text-red-600' : ''}`}
            >
              <span className="material-symbols-outlined text-base">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">

        {/* ─── TAB 1: OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: 'Members', value: currentGroup?.membersCount || 0, icon: 'group', color: 'text-blue-600' },
                { label: 'Type', value: currentGroup?.type || 'Public', icon: 'public', color: 'text-green-600' },
                { label: 'Status', value: settingsForm.lockdownMode ? 'Locked' : 'Active', icon: settingsForm.lockdownMode ? 'lock' : 'check_circle', color: settingsForm.lockdownMode ? 'text-red-600' : 'text-green-600' },
                { label: 'Created', value: currentGroup?.createdAt ? new Date(currentGroup.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—', icon: 'calendar_today', color: 'text-purple-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm border border-outline-variant/10">
                  <span className={`material-symbols-outlined text-3xl mb-3 block ${stat.color}`}>{stat.icon}</span>
                  <p className="text-2xl font-headline font-extrabold text-on-surface">{stat.value}</p>
                  <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
              <h2 className="font-headline font-bold text-lg mb-4">Role Hierarchy</h2>
              <div className="space-y-3">
                {[
                  { role: 'Admin (You)', perms: ['All permissions', 'Delete group', 'Transfer ownership', 'Change settings'], color: 'bg-red-50 border-red-200 text-red-700' },
                  { role: 'Moderator', perms: ['Delete posts', 'Warn/Mute/Ban users', 'Pin content', 'Approve content'], color: 'bg-blue-50 border-blue-200 text-blue-700' },
                  { role: 'Member', perms: ['Post & comment', 'React & vote', 'Report content'], color: 'bg-green-50 border-green-200 text-green-700' },
                  { role: 'Guest', perms: ['Read-only access', 'No posting'], color: 'bg-gray-50 border-gray-200 text-gray-600' },
                ].map(r => (
                  <div key={r.role} className={`flex items-start gap-4 p-4 rounded-xl border ${r.color}`}>
                    <strong className="font-bold text-sm w-28 flex-shrink-0">{r.role}</strong>
                    <div className="flex flex-wrap gap-2">
                      {r.perms.map(p => <span key={p} className="text-xs bg-white/60 px-2 py-0.5 rounded-full border border-current/20">{p}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: MEMBERS ─── */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-xl">Member Management</h2>
              <span className="text-sm text-on-surface-variant">{groupMembers.length} members</span>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Member</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant hidden md:table-cell">Role</th>
                    <th className="text-left px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant hidden md:table-cell">Joined</th>
                    <th className="text-right px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {groupMembers.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-10 text-center text-on-surface-variant">No members found</td></tr>
                  )}
                  {groupMembers.map((m) => (
                    <tr key={m._id} className="hover:bg-surface-container/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {m.user?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-on-surface">{m.user?.name || 'Unknown'}</p>
                            <p className="text-xs text-on-surface-variant hidden md:block">{m.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          m.role?.name === 'Admin' ? 'bg-red-100 text-red-700' :
                          m.role?.name === 'Moderator' ? 'bg-blue-100 text-blue-700' :
                          'bg-surface-container text-on-surface-variant'
                        }`}>{m.role?.name || 'Member'}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant hidden md:table-cell">
                        {m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => { setSelectedMember(m); setMemberAction('mute'); setActionReason(''); }}
                            className="p-2 rounded-lg text-outline-variant hover:text-yellow-600 hover:bg-yellow-50 transition-colors"
                            title="Mute"
                          >
                            <span className="material-symbols-outlined text-base">volume_off</span>
                          </button>
                          <button
                            onClick={() => { setSelectedMember(m); setMemberAction('ban'); setActionReason(''); }}
                            className="p-2 rounded-lg text-outline-variant hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Ban"
                          >
                            <span className="material-symbols-outlined text-base">block</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Modal */}
            {selectedMember && memberAction && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                  <h3 className="font-headline font-bold text-xl mb-2">
                    {memberAction === 'ban' ? '🚫 Ban Member' : '🔇 Mute Member'}
                  </h3>
                  <p className="text-on-surface-variant text-sm mb-6">
                    {memberAction === 'ban'
                      ? `This will permanently remove ${selectedMember.user?.name} from the group and prevent them from rejoining.`
                      : `${selectedMember.user?.name} won't be able to post for the selected duration.`}
                  </p>

                  {memberAction === 'mute' && (
                    <div className="mb-4">
                      <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Mute Duration</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[['60', '1 hour'], ['1440', '24 hours'], ['10080', '7 days'], ['', 'Permanent']].map(([val, label]) => (
                          <button
                            key={label}
                            onClick={() => setMuteDuration(val || '525960')}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all ${muteDuration === (val || '525960') ? 'bg-primary text-white border-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary'}`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Reason *</label>
                    <textarea
                      className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/20"
                      rows="3"
                      placeholder={memberAction === 'ban' ? 'Reason for ban...' : 'Reason for mute...'}
                      value={actionReason}
                      onChange={e => setActionReason(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={memberAction === 'ban' ? handleBan : handleMute}
                      disabled={!actionReason.trim() || loading}
                      className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50 ${memberAction === 'ban' ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
                    >
                      {loading ? 'Processing...' : memberAction === 'ban' ? 'Confirm Ban' : 'Confirm Mute'}
                    </button>
                    <button
                      onClick={() => { setSelectedMember(null); setMemberAction(null); }}
                      className="px-6 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-colors"
                    >Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 3: CONTENT RULES ─── */}
        {activeTab === 'content' && (
          <div className="space-y-8 max-w-3xl">
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
              <h2 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">photo_filter</span>
                Allowed Content Types
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(settingsForm.allowedContentTypes).map(([type, enabled]) => (
                  <label key={type} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${enabled ? 'border-primary bg-primary/5' : 'border-outline-variant bg-surface-container-low'}`}>
                    <input type="checkbox" checked={enabled} onChange={() => setSettingsForm(f => ({ ...f, allowedContentTypes: { ...f.allowedContentTypes, [type]: !enabled } }))} className="sr-only" />
                    <span className={`material-symbols-outlined text-2xl ${enabled ? 'text-primary' : 'text-outline-variant'}`}>
                      {type === 'text' ? 'text_fields' : type === 'images' ? 'image' : type === 'videos' ? 'videocam' : 'link'}
                    </span>
                    <div>
                      <p className="font-bold capitalize text-on-surface">{type}</p>
                      <p className="text-xs text-on-surface-variant">{enabled ? 'Allowed' : 'Blocked'}</p>
                    </div>
                    <span className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${enabled ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                      {enabled && <span className="material-symbols-outlined text-white text-xs">check</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-6">
              <h2 className="font-headline font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">timer</span>
                Rate Limiting & Moderation
              </h2>

              <div>
                <label className="block text-sm font-bold text-on-surface mb-2">Max posts per hour</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range" min="1" max="100" value={settingsForm.rateLimitPostsPerHour}
                    onChange={e => setSettingsForm(f => ({ ...f, rateLimitPostsPerHour: parseInt(e.target.value) }))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-primary font-bold text-lg w-12 text-center">{settingsForm.rateLimitPostsPerHour}</span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">Members can post up to {settingsForm.rateLimitPostsPerHour} times per hour before rate limiting kicks in.</p>
              </div>

              {[
                { key: 'postApprovalRequired', label: 'Require post approval', desc: 'All posts must be approved by a moderator before being visible.', icon: 'approval' },
                { key: 'nsfwFilter', label: 'Enable NSFW / content filter', desc: 'Automatically flag and review potentially inappropriate content.', icon: 'security' },
                { key: 'allowMemberInvites', label: 'Allow member invites', desc: 'Members can invite others to join this group.', icon: 'person_add' },
              ].map(({ key, label, desc, icon }) => (
                <div key={key} className="flex items-start justify-between gap-6 py-4 border-t border-outline-variant/10">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary mt-0.5">{icon}</span>
                    <div>
                      <p className="font-semibold text-sm text-on-surface">{label}</p>
                      <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettingsForm(f => ({ ...f, [key]: !f[key] }))}
                    className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${settingsForm[key] ? 'bg-primary' : 'bg-surface-container-highest'}`}
                  >
                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${settingsForm[key] ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10">
              <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">psychology</span>
                AI Moderation <span className="text-xs font-normal text-on-surface-variant ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Beta</span>
              </h2>
              <div className="space-y-3">
                {['Auto-flag toxic content', 'Detect spam / bot patterns', 'Suggest mutes for repeat offenders'].map(feature => (
                  <div key={feature} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                    <span className="material-symbols-outlined text-primary text-sm">auto_fix_high</span>
                    <span className="text-sm text-on-surface">{feature}</span>
                    <span className="ml-auto text-xs text-on-surface-variant bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full font-bold">Coming Soon</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 4: SETTINGS ─── */}
        {activeTab === 'settings' && (
          <div className="space-y-8 max-w-3xl">
            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-6">
              <h2 className="font-headline font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">edit</span>
                Group Details
              </h2>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Group Name</label>
                <input
                  type="text" value={settingsForm.name}
                  onChange={e => setSettingsForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Description</label>
                <textarea
                  rows="4" value={settingsForm.description}
                  onChange={e => setSettingsForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-on-surface outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-8 border border-outline-variant/10 space-y-4">
              <h2 className="font-headline font-bold text-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lock</span>
                Privacy & Membership
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {['Public', 'Private', 'Invite-only'].map(t => (
                  <button key={t} onClick={() => setSettingsForm(f => ({ ...f, type: t }))}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${settingsForm.type === t ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant text-on-surface-variant hover:border-primary/40'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <p className="text-xs text-on-surface-variant">
                {settingsForm.type === 'Public' ? 'Anyone can find and join this group.' :
                 settingsForm.type === 'Private' ? 'Members must request to join. Group is visible in search.' :
                 'Members must be invited directly. Group is hidden from search.'}
              </p>

              <div className="pt-4 border-t border-outline-variant/10">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={settingsForm.requireJoinQuestion}
                    onChange={() => setSettingsForm(f => ({ ...f, requireJoinQuestion: !f.requireJoinQuestion }))}
                    className="mt-1 accent-primary w-4 h-4"
                  />
                  <div>
                    <p className="font-semibold text-sm">Require join question</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">New members must answer a screening question before joining.</p>
                  </div>
                </label>
                {settingsForm.requireJoinQuestion && (
                  <input
                    type="text" value={settingsForm.joinQuestion}
                    onChange={e => setSettingsForm(f => ({ ...f, joinQuestion: e.target.value }))}
                    placeholder="e.g. Why do you want to join this community?"
                    className="mt-3 w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                  />
                )}
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              disabled={loading}
              className="premium-gradient !text-black font-headline font-bold px-10 py-4 rounded-xl shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">save</span>
              {loading ? 'Saving...' : 'Save All Settings'}
            </button>
          </div>
        )}

        {/* ─── TAB 5: MOD LOG ─── */}
        {activeTab === 'modlog' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-xl">Moderation Log</h2>
              <span className="text-xs text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">{modLog.length} actions recorded</span>
            </div>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
              {modLog.length === 0 ? (
                <div className="p-10 text-center text-on-surface-variant">No moderation actions yet.</div>
              ) : (
                <div className="divide-y divide-outline-variant/10">
                  {modLog.map(entry => (
                    <div key={entry.id} className="flex items-start gap-4 px-6 py-4">
                      <span className={`material-symbols-outlined text-2xl mt-0.5 ${
                        entry.action.includes('Ban') ? 'text-red-500' :
                        entry.action.includes('Mute') ? 'text-yellow-500' :
                        'text-blue-500'
                      }`}>
                        {entry.action.includes('Ban') ? 'block' : entry.action.includes('Mute') ? 'volume_off' : 'delete'}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-on-surface">{entry.action}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          By <strong>{entry.actor}</strong> on <strong>{entry.target}</strong> · "{entry.reason}"
                        </p>
                      </div>
                      <time className="text-xs text-on-surface-variant flex-shrink-0">
                        {entry.timestamp.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </time>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 6: DANGER ZONE ─── */}
        {activeTab === 'danger' && (
          <div className="space-y-8 max-w-2xl">
            <div className="border-2 border-red-200 rounded-2xl p-8 bg-red-50">
              <h2 className="font-headline font-bold text-xl text-red-700 flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined">warning</span>
                Danger Zone
              </h2>
              <p className="text-red-600 text-sm">Actions in this section are irreversible. Please proceed with caution.</p>
            </div>

            {/* Emergency Lockdown */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 flex items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-red-500 text-2xl mt-0.5">security</span>
                <div>
                  <h3 className="font-bold text-on-surface">Emergency Lockdown</h3>
                  <p className="text-sm text-on-surface-variant mt-1">Instantly suspend all member posting and interaction. Only admins can still act.</p>
                  <p className={`text-xs font-bold mt-2 ${settingsForm.lockdownMode ? 'text-red-600' : 'text-green-600'}`}>
                    Status: {settingsForm.lockdownMode ? '🔒 Locked Down' : '✅ Normal'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleLockdown}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${settingsForm.lockdownMode ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
              >
                {settingsForm.lockdownMode ? 'Lift Lockdown' : 'Activate Lockdown'}
              </button>
            </div>

            {/* Transfer Ownership */}
            <TransferOwnership members={groupMembers} groupId={groupId} showToast={showToast} />

            {/* Delete Group */}
            <DeleteGroupSection groupName={currentGroup?.name} onDelete={handleDeleteGroup} loading={loading} />
          </div>
        )}

      </div>
    </div>
  );
}

function TransferOwnership({ members, groupId, showToast }) {
  const [targetId, setTargetId] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="bg-surface-container-lowest rounded-2xl p-6 border border-orange-200">
      <div className="flex items-start gap-4 mb-5">
        <span className="material-symbols-outlined text-orange-500 text-2xl">swap_horiz</span>
        <div>
          <h3 className="font-bold text-on-surface">Transfer Ownership</h3>
          <p className="text-sm text-on-surface-variant mt-1">Hand over the group to another admin-level member. You will lose owner privileges.</p>
        </div>
      </div>
      <select value={targetId} onChange={e => setTargetId(e.target.value)}
        className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none mb-4"
      >
        <option value="">Select new owner...</option>
        {members.map(m => <option key={m._id} value={m.user?._id}>{m.user?.name}</option>)}
      </select>
      <label className="flex items-center gap-2 text-sm text-on-surface-variant cursor-pointer mb-4">
        <input type="checkbox" checked={confirmed} onChange={() => setConfirmed(!confirmed)} className="accent-orange-500 w-4 h-4" />
        I understand this action cannot be undone
      </label>
      <button
        disabled={!targetId || !confirmed}
        onClick={() => showToast('Ownership transferred! (Backend wiring pending)', 'success')}
        className="bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-600 disabled:opacity-40 transition-all"
      >
        Transfer Ownership
      </button>
    </div>
  );
}

function DeleteGroupSection({ groupName, onDelete, loading }) {
  const [confirmText, setConfirmText] = useState('');

  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-5">
        <span className="material-symbols-outlined text-red-600 text-2xl">delete_forever</span>
        <div>
          <h3 className="font-bold text-red-800">Delete Group</h3>
          <p className="text-sm text-red-600 mt-1">Permanently delete this group and all its content. This <strong>cannot be undone.</strong></p>
        </div>
      </div>
      <p className="text-sm text-red-700 font-semibold mb-2">Type <code className="bg-red-100 px-2 py-0.5 rounded font-mono">{groupName}</code> to confirm:</p>
      <input
        type="text" value={confirmText} onChange={e => setConfirmText(e.target.value)}
        placeholder={`Type "${groupName}" to confirm`}
        className="w-full bg-white border border-red-300 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-red-300 mb-4 font-mono"
      />
      <button
        disabled={confirmText !== groupName || loading}
        onClick={() => onDelete(confirmText)}
        className="bg-red-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-red-700 disabled:opacity-40 transition-all flex items-center gap-2"
      >
        <span className="material-symbols-outlined text-base">delete_forever</span>
        {loading ? 'Deleting...' : 'Permanently Delete Group'}
      </button>
    </div>
  );
}
