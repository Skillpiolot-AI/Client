import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import { useAuth } from '../../AuthContext';

const HISTORY_KEY = 'communityHistory';
const RECENT_POSTS_KEY = 'recentPostsSeen';

const addToHistory = (group) => {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const filtered = history.filter(g => g._id !== group._id);
    const updated = [{ _id: group._id, name: group.name, slug: group.slug }, ...filtered].slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch {}
};

export { addToHistory };

export default function CommunityLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { myGroups, fetchMyGroups, groups, fetchGroups } = useGroupContext();
  const { user, isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchGroups();
    if (isAuthenticated()) fetchMyGroups();
    // Load history & recent posts from localStorage
    try {
      setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
      setRecentPosts(JSON.parse(localStorage.getItem(RECENT_POSTS_KEY) || '[]'));
    } catch {}
    // Listen for storage changes (when groups are visited)
    const handleStorage = () => {
      setHistory(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'));
      setRecentPosts(JSON.parse(localStorage.getItem(RECENT_POSTS_KEY) || '[]'));
    };
    window.addEventListener('communityHistoryUpdate', handleStorage);
    return () => window.removeEventListener('communityHistoryUpdate', handleStorage);
  }, [isAuthenticated()]);

  // Live search
  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const filtered = groups.filter(g =>
      g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setSearchResults(filtered.slice(0, 6));
  }, [searchQuery, groups]);

  const navLinks = [
    { to: '/groups', label: 'Home', icon: 'home', exact: true },
    { to: '/groups?sort=trending', label: 'Trending', icon: 'local_fire_department' },
    { to: '/groups/my-groups', label: 'My Communities', icon: 'bookmarks' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#fff8f5] text-on-surface font-body">
      <div className="flex max-w-[1440px] mx-auto">

        {/* ── LEFT SIDEBAR ──────────────────────────────────── */}
        <aside className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto pr-2 pt-6 pb-20">

          {/* Primary Navigation */}
          <nav className="space-y-0.5 mb-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to.split('?')[0])
                    ? 'bg-white shadow-sm text-primary'
                    : 'text-on-surface-variant hover:bg-white/70 hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-xl">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Create Group Button */}
          <Link
            to="/groups/create"
            className="flex items-center justify-center gap-2 mx-1 mb-6 py-2.5 bg-primary !text-white rounded-xl text-sm font-bold shadow-sm hover:opacity-90 transition-all"
          >
            <span className="material-symbols-outlined text-base">add</span>
            Create Community
          </Link>

          <div className="border-t border-outline-variant/20 mb-4" />

          {/* My Communities */}
          {isAuthenticated() && myGroups.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-4 mb-2">My Communities</p>
              <div className="space-y-0.5">
                {myGroups.slice(0, 8).map(g => (
                  <Link
                    key={g._id}
                    to={`/groups/${g._id}`}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-on-surface-variant hover:bg-white hover:text-on-surface transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {g.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="truncate">{g.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent History */}
          {history.length > 0 && (
            <div className="mb-4">
              <div className="border-t border-outline-variant/20 mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant px-4 mb-2">Recently Visited</p>
              <div className="space-y-0.5">
                {history.map(g => (
                  <Link
                    key={g._id}
                    to={`/groups/${g._id}`}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm text-on-surface-variant hover:bg-white hover:text-on-surface transition-all"
                  >
                    <span className="material-symbols-outlined text-sm text-outline-variant">history</span>
                    <span className="truncate">{g.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Footer links */}
          <div className="border-t border-outline-variant/20 pt-4 mt-auto">
            <p className="text-[10px] text-on-surface-variant px-4">
              SkillPilot Communities · Privacy · Terms
            </p>
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────── */}
        <main className="flex-1 min-w-0 pt-6 px-4 lg:px-6">
          <Outlet />
        </main>

        {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
        <aside className="hidden xl:flex flex-col w-72 flex-shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto pt-6 pb-20 pl-4">

          {/* Community Search */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-outline-variant/10">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Search Communities</p>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline-variant text-sm">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search groups, tags..."
                className="w-full bg-surface-container-low rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
              />
            </div>
            {searchResults.length > 0 && (
              <div className="mt-2 space-y-1">
                {searchResults.map(g => (
                  <Link
                    key={g._id}
                    to={`/groups/${g._id}`}
                    onClick={() => setSearchQuery('')}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-surface-container-low transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {g.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-on-surface">{g.name}</p>
                      <p className="text-xs text-on-surface-variant">{g.membersCount || 0} members</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Recently Seen Posts */}
          {recentPosts.length > 0 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4 border border-outline-variant/10">
              <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Recent Posts Seen</p>
              <div className="space-y-3">
                {recentPosts.slice(0, 10).map(p => (
                  <Link
                    key={p._id}
                    to={`/groups/${p.groupId}/post/${p._id}`}
                    className="block hover:bg-surface-container-low rounded-xl p-2 transition-colors"
                  >
                    <p className="text-sm font-semibold text-on-surface line-clamp-2">{p.title}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">{p.groupName}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Trending Communities */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-outline-variant/10">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-3">Top Communities</p>
            <div className="space-y-2">
              {groups.slice(0, 5).map((g, i) => (
                <Link
                  key={g._id}
                  to={`/groups/${g._id}`}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container-low transition-colors"
                >
                  <span className="font-headline font-black text-primary/30 text-lg w-5">{i + 1}</span>
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {g.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">{g.name}</p>
                    <p className="text-xs text-on-surface-variant">{g.membersCount || 0} members</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
