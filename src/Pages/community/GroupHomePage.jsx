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

  const trackPostView = () => {
    try {
      const recent = JSON.parse(localStorage.getItem('recentPostsSeen') || '[]');
      const filtered = recent.filter(p => p._id !== post._id);
      const updated = [{ _id: post._id, title: post.title, groupId, groupName: post.group?.name || '' }, ...filtered].slice(0, 10);
      localStorage.setItem('recentPostsSeen', JSON.stringify(updated));
      window.dispatchEvent(new Event('communityHistoryUpdate'));
    } catch {}
  };

  return (
    <div className="bg-white rounded-2xl border border-outline-variant/10 hover:border-primary/20 transition-all shadow-sm flex overflow-hidden group">
      {/* Vote column */}
      <div className="flex flex-col items-center py-3 px-3 bg-surface-container-low gap-1 min-w-[52px]">
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
              <Link to={`/groups/${groupId}?sub=${post.subGroup._id}`} className="font-bold text-primary hover:underline">
                /{post.subGroup.slug}
              </Link>
              <span>·</span>
            </>
          )}
          <span>Posted by</span>
          <span className="font-semibold text-on-surface">{post.author?.name || 'Anonymous'}</span>
          <span>·</span>
          <span>{timeSince(post.createdAt)}</span>
          {post.flair && (
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">{post.flair}</span>
          )}
          {post.isPinned && <span className="material-symbols-outlined text-green-500 text-sm">push_pin</span>}
        </div>

        <Link to={`/groups/${groupId}/post/${post._id}`} onClick={trackPostView} className="block group-hover:text-primary transition-colors">
          <h3 className="font-headline font-bold text-lg leading-snug mb-2">{post.title}</h3>
        </Link>

        {post.body && (
          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-3 mb-3">{post.body}</p>
        )}
        {post.type === 'link' && post.url && (
          <a href={post.url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-3">
            <span className="material-symbols-outlined text-sm">link</span>
            {post.url.slice(0, 60)}{post.url.length > 60 ? '...' : ''}
          </a>
        )}

        {/* Action bar */}
        <div className="flex items-center gap-1 flex-wrap">
          <Link
            to={`/groups/${groupId}/post/${post._id}`}
            onClick={trackPostView}
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

// ── GroupHomePage ──────────────────────────────────────────────────────────────
export default function GroupHomePage() {
  const params = useParams();
  const groupId = params.groupId || params.id;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { fetchGroupById, currentGroup, loading: ctxLoading } = useGroupContext();

  const [posts, setPosts] = useState([]);
  const [subGroups, setSubGroups] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  const [sort, setSort] = useState('hot');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeSubGroup, setActiveSubGroup] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postForm, setPostForm] = useState({ title: '', body: '', type: 'text', url: '', flair: '' });
  const [postSubmitting, setPostSubmitting] = useState(false);

  // Load group info
  useEffect(() => {
    if (!groupId) return;
    fetchGroupById(groupId).then(group => {
      if (group) {
        const ownerId = String(group.owner?._id || group.owner);
        const userId = String(user?._id || user?.id || '');
        if (userId && ownerId === userId) { setIsOwner(true); setIsMember(true); }
        // Track in history
        addToHistory({ _id: group._id, name: group.name });
        window.dispatchEvent(new Event('communityHistoryUpdate'));
      }
    });
    fetchSubGroups();
  }, [groupId, user]);

  // Load feed on sort/page/subgroup change
  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadFeed(1, true);
  }, [sort, activeSubGroup, groupId]);

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
      const params = new URLSearchParams({ sort, page: pg, limit: 10 });
      if (activeSubGroup) params.append('subGroup', activeSubGroup);
      const res = await fetch(`${API}/groups/${groupId}/feed?${params}`);
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
    if (!postForm.title.trim()) return;
    setPostSubmitting(true);
    try {
      const res = await fetch(`${API}/groups/${groupId}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tok()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...postForm, subGroup: activeSubGroup || null }),
      });
      const data = await res.json();
      if (res.ok) {
        setPosts(prev => [data.post, ...prev]);
        setShowPostForm(false);
        setPostForm({ title: '', body: '', type: 'text', url: '', flair: '' });
      }
    } catch {}
    setPostSubmitting(false);
  };

  if (ctxLoading && !currentGroup) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="pb-12">
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
            <div className="flex items-center gap-2">
              {isOwner && (
                <Link to={`/groups/${groupId}/admin`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant text-on-surface-variant text-sm font-bold hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-base">settings</span>
                  Admin
                </Link>
              )}
              <Link to={`/groups/${groupId}/chat`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface-container-low text-on-surface text-sm font-bold hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-base">chat</span>
                Chat
              </Link>
              <Link to={`/groups/${groupId}`} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-base">info</span>
                About
              </Link>
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
              {subGroups.slice(0, 5).map(sg => (
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
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold bg-dashed border border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all"
                >
                  + Add Subgroup
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Post Box */}
      {isAuthenticated() && (
        <div className="bg-white rounded-2xl p-4 mb-4 border border-outline-variant/10 shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <button
            onClick={() => setShowPostForm(!showPostForm)}
            className="flex-1 bg-surface-container-low rounded-xl px-4 py-2.5 text-left text-sm text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            Create a post...
          </button>
          <button onClick={() => setShowPostForm(!showPostForm)} className="p-2 rounded-xl hover:bg-surface-container-low text-outline-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">edit</span>
          </button>
        </div>
      )}

      {/* Post creation form */}
      {showPostForm && (
        <div className="bg-white rounded-2xl p-6 mb-4 border border-outline-variant/10 shadow-sm">
          <h3 className="font-headline font-bold mb-4">Create Post</h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="flex gap-2 mb-2">
              {['text', 'link', 'image'].map(t => (
                <button key={t} type="button" onClick={() => setPostForm(f => ({ ...f, type: t }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${postForm.type === t ? 'bg-primary !text-black' : 'bg-surface-container-low text-on-surface-variant'}`}
                >{t}</button>
              ))}
            </div>
            <input
              type="text" required placeholder="Title *" value={postForm.title}
              onChange={e => setPostForm(f => ({ ...f, title: e.target.value }))}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            {postForm.type === 'text' && (
              <textarea
                rows={4} placeholder="Body (optional)" value={postForm.body}
                onChange={e => setPostForm(f => ({ ...f, body: e.target.value }))}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              />
            )}
            {(postForm.type === 'link' || postForm.type === 'image') && (
              <input
                type="url" placeholder="URL" value={postForm.url}
                onChange={e => setPostForm(f => ({ ...f, url: e.target.value }))}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              />
            )}
            <input
              type="text" placeholder="Flair (optional)" value={postForm.flair}
              onChange={e => setPostForm(f => ({ ...f, flair: e.target.value }))}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setShowPostForm(false)} className="px-5 py-2 rounded-xl border border-outline-variant text-sm font-bold text-on-surface-variant">Cancel</button>
              <button type="submit" disabled={postSubmitting} className="px-6 py-2 rounded-xl bg-primary !text-black text-sm font-bold disabled:opacity-50">
                {postSubmitting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
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
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
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
