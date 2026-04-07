import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import { useAuth } from '../../AuthContext';
import { addToHistory } from './CommunityLayout';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const tok = () => localStorage.getItem('token');

function timeSince(date) {
  const sec = Math.floor((Date.now() - new Date(date)) / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

// ── PostCard ──────────────────────────────────────────────────────────────────
function PostCard({ post, groupId }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [score, setScore] = useState(post.score || 0);
  const [userVote, setUserVote] = useState(0);

  const vote = async (v) => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    const newVote = userVote === v ? 0 : v;
    try {
      const res = await fetch(`${API}/groups/${groupId}/posts/${post._id}/vote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: newVote }),
      });
      const data = await res.json();
      setScore(data.score);
      setUserVote(newVote);
    } catch {}
  };

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all shadow-sm flex overflow-hidden group">
      {/* Vote column */}
      <div className="flex flex-col items-center py-3 px-3 bg-surface-container-low gap-1 min-w-[48px]">
        <button onClick={() => vote(1)} className={`p-1 rounded-lg transition-colors ${userVote === 1 ? 'text-orange-500' : 'text-outline-variant hover:text-orange-400'}`}>
          <span className="material-symbols-outlined text-xl">arrow_upward</span>
        </button>
        <span className={`text-sm font-black ${score > 0 ? 'text-orange-500' : score < 0 ? 'text-blue-500' : 'text-on-surface-variant'}`}>{score}</span>
        <button onClick={() => vote(-1)} className={`p-1 rounded-lg transition-colors ${userVote === -1 ? 'text-blue-500' : 'text-outline-variant hover:text-blue-400'}`}>
          <span className="material-symbols-outlined text-xl">arrow_downward</span>
        </button>
      </div>

      {/* Post content */}
      <div className="flex-1 p-4 min-w-0">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant mb-2 flex-wrap">
          {post.subGroup && (
            <>
              <span className="font-bold text-primary">/{post.subGroup.slug}</span>
              <span>·</span>
            </>
          )}
          <span className="font-semibold text-on-surface">{post.author?.name || 'Anonymous'}</span>
          <span>·</span>
          <span>{timeSince(post.createdAt)}</span>
          {post.flair && (
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{post.flair}</span>
          )}
          {post.isPinned && <span className="material-symbols-outlined text-green-500 text-sm">push_pin</span>}
        </div>

        <Link to={`/groups/${groupId}/post/${post._id}`} className="block group-hover:text-primary transition-colors">
          <p className="text-sm text-on-surface leading-relaxed mb-3 line-clamp-5">{post.body}</p>
        </Link>

        {/* Action bar */}
        <div className="flex items-center gap-1 flex-wrap">
          <Link
            to={`/groups/${groupId}/post/${post._id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-sm">chat_bubble</span>
            {post.commentsCount || 0} Comments
          </Link>
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.origin + `/groups/${groupId}/post/${post._id}`); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-sm">share</span>
            Share
          </button>
        </div>
      </div>
    </div>
  );
}

// ── AnnouncementPanel ─────────────────────────────────────────────────────────
function AnnouncementPanel({ groupId, isAdmin, onClose, getAnnouncements, createAnnouncement }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMsg, setNewMsg] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    getAnnouncements(groupId).then(data => {
      setAnnouncements(data.announcements || []);
      setLoading(false);
      // Mark as seen
      localStorage.setItem(`ann_seen_${groupId}`, Date.now().toString());
    }).catch(() => setLoading(false));
  }, [groupId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    setSending(true);
    try {
      const data = await createAnnouncement(groupId, newMsg.trim());
      setAnnouncements(prev => [data.announcement, ...prev]);
      setNewMsg('');
    } catch {}
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div
        className="relative w-full max-w-sm h-full bg-white shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">campaign</span>
            <h3 className="font-headline font-bold text-lg">Announcements</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Admin compose */}
        {isAdmin && (
          <form onSubmit={handleSend} className="p-4 border-b border-outline-variant/20 flex gap-2">
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              placeholder="Send announcement..."
              className="flex-1 bg-surface-container-low rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={sending || !newMsg.trim()}
              className="px-3 py-2 rounded-xl bg-primary !text-black text-sm font-bold disabled:opacity-40"
            >
              {sending ? '...' : 'Send'}
            </button>
          </form>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : announcements.length === 0 ? (
            <div className="text-center py-10 text-on-surface-variant text-sm">No announcements yet.</div>
          ) : (
            announcements.map(ann => (
              <div key={ann._id} className={`p-3 rounded-xl ${ann.type === 'settings_change' ? 'bg-amber-50 border border-amber-200' : 'bg-surface-container-low'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${ann.type === 'settings_change' ? 'bg-amber-200 text-amber-800' : 'bg-primary/10 text-primary'}`}>
                    {ann.type === 'settings_change' ? '⚙ Settings' : '📢 Admin'}
                  </span>
                  <span className="text-xs text-on-surface-variant">{ann.sentBy?.name}</span>
                  <span className="text-xs text-on-surface-variant ml-auto">{timeSince(ann.createdAt)}</span>
                </div>
                <p className="text-sm text-on-surface leading-relaxed">{ann.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ── ThreeDotMenu ──────────────────────────────────────────────────────────────
function ThreeDotMenu({ groupId, onLeave, onReport, onMute, isMuted }) {
  const [open, setOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reporting, setReporting] = useState(false);
  const [toast, setToast] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim()) return;
    setReporting(true);
    try {
      await onReport(reportReason);
      setShowReportModal(false);
      setReportReason('');
      showToast('Group reported. Thank you!');
    } catch { showToast('Failed to report.'); }
    setReporting(false);
  };

  const handleMute = async () => {
    setOpen(false);
    try {
      const res = await onMute();
      showToast(res?.muted ? 'Notifications muted' : 'Notifications unmuted');
    } catch { showToast('Failed to update mute setting.'); }
  };

  return (
    <div className="relative" ref={menuRef}>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-on-surface text-surface text-sm font-semibold px-5 py-2.5 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors"
        title="More options"
      >
        <span className="material-symbols-outlined">more_horiz</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl shadow-xl border border-outline-variant/20 py-1.5 z-50 overflow-hidden">
          <button
            onClick={handleMute}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-base text-on-surface-variant">
              {isMuted ? 'notifications' : 'notifications_off'}
            </span>
            {isMuted ? 'Unmute notifications' : 'Mute notifications'}
          </button>
          <button
            onClick={() => { setOpen(false); onLeave(); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors text-red-600"
          >
            <span className="material-symbols-outlined text-base">exit_to_app</span>
            Leave group
          </button>
          <div className="h-px bg-outline-variant/20 mx-3 my-1" />
          <button
            onClick={() => { setOpen(false); setShowReportModal(true); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-surface-container-low transition-colors text-red-400"
          >
            <span className="material-symbols-outlined text-base">flag</span>
            Report group
          </button>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40" onClick={() => setShowReportModal(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
            <h4 className="font-headline font-bold text-lg mb-4">Report Group</h4>
            <form onSubmit={handleReport} className="space-y-4">
              <textarea
                rows={3}
                required
                value={reportReason}
                onChange={e => setReportReason(e.target.value)}
                placeholder="Why are you reporting this group?"
                className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setShowReportModal(false)} className="px-5 py-2 rounded-xl border border-outline-variant text-sm font-bold text-on-surface-variant">Cancel</button>
                <button type="submit" disabled={reporting || !reportReason.trim()} className="px-5 py-2 rounded-xl bg-red-500 text-white text-sm font-bold disabled:opacity-50">
                  {reporting ? 'Reporting...' : 'Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── GroupHomePage ─────────────────────────────────────────────────────────────
export default function GroupHomePage() {
  const params = useParams();
  const groupId = params.groupId || params.id;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    fetchGroupById, currentGroup, loading: ctxLoading,
    leaveGroup, joinGroup, reportGroup, muteSelfGroup,
    getAnnouncements, createAnnouncement,
  } = useGroupContext();

  const [posts, setPosts] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [sort, setSort] = useState('hot');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeSubGroup, setActiveSubGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Post form
  const [showPostForm, setShowPostForm] = useState(false);
  const [postBody, setPostBody] = useState('');
  const [postSubGroup, setPostSubGroup] = useState('');
  const [postSubmitting, setPostSubmitting] = useState(false);

  // Announcements
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  // Load group info + membership check
  useEffect(() => {
    if (!groupId) return;
    fetchGroupById(groupId).then(group => {
      if (group) {
        const ownerId = String(group.owner?._id || group.owner);
        const userId = String(user?._id || user?.id || '');
        if (userId && ownerId === userId) {
          setIsOwner(true);
          setIsMember(true);
        }
        addToHistory({ _id: group._id, name: group.name });
        window.dispatchEvent(new Event('communityHistoryUpdate'));
      }
    });
    // Check membership separately for non-owners
    if (isAuthenticated() && tok()) {
      fetch(`${API}/groups/${groupId}/members`, {
        headers: { Authorization: `Bearer ${tok()}` },
      })
        .then(r => r.json())
        .then(data => {
          const members = data.members || [];
          const userId = String(user?._id || user?.id || '');
          const found = userId && members.some(m =>
            String(m.user?._id || m.user) === userId
          );
          if (found) setIsMember(true);
        })
        .catch(() => {});
    } else {
      setIsMember(false);
    }
    fetchSubGroups();
    checkUnreadAnnouncements();
  }, [groupId, user]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadFeed(1, true);
  }, [sort, activeSubGroup, groupId]);

  const checkUnreadAnnouncements = async () => {
    try {
      const lastSeen = parseInt(localStorage.getItem(`ann_seen_${groupId}`) || '0');
      const data = await getAnnouncements(groupId);
      const announcements = data.announcements || [];
      if (announcements.length > 0) {
        const latestTime = new Date(announcements[0].createdAt).getTime();
        setHasUnread(latestTime > lastSeen);
      }
    } catch {}
  };

  const fetchSubGroups = async () => {
    try {
      const res = await fetch(`${API}/groups/${groupId}/subgroups`);
      const data = await res.json();
      setSubGroups(data.subgroups || []);
    } catch {}
  };

  const loadFeed = async (pg = page, reset = false) => {
    setFeedLoading(true);
    try {
      const p = new URLSearchParams({ sort, page: pg, limit: 10 });
      if (activeSubGroup) p.append('subGroup', activeSubGroup);
      const res = await fetch(`${API}/groups/${groupId}/feed?${p}`);
      const data = await res.json();
      const newPosts = data.posts || [];
      setPosts(prev => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(pg < data.pages);
      setPage(pg);
    } catch {}
    setFeedLoading(false);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!isAuthenticated()) { navigate('/login'); return; }
    if (!postBody.trim()) return;
    setPostSubmitting(true);
    try {
      const res = await fetch(`${API}/groups/${groupId}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: postBody, subGroup: postSubGroup || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => [data.post, ...prev]);
        setShowPostForm(false);
        setPostBody('');
        setPostSubGroup('');
      }
    } catch {}
    setPostSubmitting(false);
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    try {
      await leaveGroup(groupId);
      setIsMember(false);
      setIsOwner(false);
    } catch {}
  };

  const handleJoin = async () => {
    if (!isAuthenticated()) { navigate('/login'); return; }
    try {
      await joinGroup(groupId);
      setIsMember(true);
    } catch {}
  };

  const handleReport = async (reason) => {
    await reportGroup(groupId, reason);
  };

  const handleMute = async () => {
    const res = await muteSelfGroup(groupId);
    setIsMuted(res?.muted ?? !isMuted);
    return res;
  };

  if (ctxLoading && !currentGroup) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="pb-12">
      {/* Announcement Panel */}
      {showAnnouncements && (
        <AnnouncementPanel
          groupId={groupId}
          isAdmin={isOwner}
          onClose={() => { setShowAnnouncements(false); setHasUnread(false); }}
          getAnnouncements={getAnnouncements}
          createAnnouncement={createAnnouncement}
        />
      )}

      {/* Group Header */}
      {currentGroup && (
        <div className="bg-white rounded-2xl p-6 mb-6 border border-outline-variant/10 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center font-headline font-black text-white text-2xl">
                {currentGroup.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h1 className="font-headline font-extrabold text-2xl">{currentGroup.name}</h1>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${currentGroup.type === 'Public' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {currentGroup.type}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant">{currentGroup.membersCount || 0} members · {subGroups.length} subgroups</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {isOwner && (
                <Link to={`/groups/${groupId}/admin`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-bold hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-base">settings</span>
                  Admin
                </Link>
              )}

              {/* Join button for non-members */}
              {isAuthenticated() && !isMember && (
                <button
                  onClick={handleJoin}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary !text-black text-sm font-bold hover:opacity-90 transition-all"
                >
                  <span className="material-symbols-outlined text-base">add</span>
                  Join
                </button>
              )}

              {/* Chat link — show for members and owners */}
              {(isMember || isOwner) && (
                <Link to={`/groups/${groupId}/chat`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm font-bold hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-base">chat</span>
                  Chat
                </Link>
              )}

              {/* Announcement Bell */}
              {isAuthenticated() && isMember && (
                <button
                  onClick={() => setShowAnnouncements(true)}
                  className="relative p-2 rounded-xl hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-colors"
                  title="Announcements"
                >
                  <span className="material-symbols-outlined">notifications</span>
                  {hasUnread && !isMuted && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </button>
              )}

              {/* Three-dot menu — only for members who are not owner */}
              {isAuthenticated() && isMember && !isOwner && (

                <ThreeDotMenu
                  groupId={groupId}
                  onLeave={handleLeave}
                  onReport={handleReport}
                  onMute={handleMute}
                  isMuted={isMuted}
                />
              )}
            </div>
          </div>

          {/* Tags */}
          {currentGroup.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {currentGroup.tags.map(t => (
                <span key={t} className="text-xs bg-surface-container-low text-on-surface-variant px-3 py-1 rounded-full font-semibold">#{t}</span>
              ))}
            </div>
          )}

          {/* Subgroups Row */}
          {subGroups.length > 0 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveSubGroup(null)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${!activeSubGroup ? 'bg-primary !text-black' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
              >
                All Posts
              </button>
              {subGroups.slice(0, 6).map(sg => (
                <button
                  key={sg._id}
                  onClick={() => setActiveSubGroup(activeSubGroup === sg._id ? null : sg._id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeSubGroup === sg._id ? 'bg-primary !text-black' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'}`}
                >
                  /{sg.slug}
                </button>
              ))}
              {isOwner && (
                <button
                  onClick={() => navigate(`/groups/${groupId}/admin`)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                >
                  + Add Subgroup
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Create Post Box (Reddit-style) ── */}
      {isAuthenticated() && (
        <div className="bg-white rounded-2xl p-4 mb-4 border border-outline-variant/10 shadow-sm">
          {!showPostForm ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <button
                onClick={() => setShowPostForm(true)}
                className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-left text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                What's on your mind?
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreatePost} className="space-y-3">
              <textarea
                rows={4}
                autoFocus
                required
                value={postBody}
                onChange={e => setPostBody(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
              {/* Subgroup selector */}
              {subGroups.length > 0 && (
                <select
                  value={postSubGroup}
                  onChange={e => setPostSubGroup(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant/30 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Main group</option>
                  {subGroups.map(sg => (
                    <option key={sg._id} value={sg._id}>/{sg.slug}</option>
                  ))}
                </select>
              )}
              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => { setShowPostForm(false); setPostBody(''); setPostSubGroup(''); }} className="px-5 py-2 rounded-xl border border-outline-variant text-sm font-bold text-on-surface-variant">Cancel</button>
                <button type="submit" disabled={postSubmitting || !postBody.trim()} className="px-6 py-2 rounded-xl bg-primary !text-black text-sm font-bold disabled:opacity-50">
                  {postSubmitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Sort Bar */}
      <div className="flex items-center gap-2 mb-4">
        {[['hot', 'local_fire_department'], ['new', 'schedule'], ['top', 'trending_up']].map(([s, icon]) => (
          <button key={s} onClick={() => setSort(s)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all capitalize ${sort === s ? 'bg-white shadow-sm text-primary border border-primary/20' : 'text-on-surface-variant hover:bg-white hover:shadow-sm'}`}
          >
            <span className="material-symbols-outlined text-sm">{icon}</span>
            {s}
          </button>
        ))}
      </div>

      {/* Feed */}
      <div className="space-y-3">
        {feedLoading && posts.length === 0 ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-outline-variant/10">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-4 block">article</span>
            <h3 className="font-headline font-bold text-xl mb-2">No posts yet</h3>
            <p className="text-on-surface-variant text-sm">Be the first to post in this community!</p>
          </div>
        ) : (
          posts.map(post => <PostCard key={post._id} post={post} groupId={groupId} />)
        )}
      </div>

      {/* Load more */}
      {hasMore && posts.length > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={() => { const next = page + 1; setPage(next); loadFeed(next); }}
            disabled={feedLoading}
            className="px-8 py-3 rounded-xl bg-white border border-outline-variant/20 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-all shadow-sm disabled:opacity-50"
          >
            {feedLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}
