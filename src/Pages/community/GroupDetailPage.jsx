import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import { useAuth } from '../../AuthContext';

export default function GroupDetailPage() {
  const params = useParams();
  const id = params.groupId || params.id;
  const { fetchGroupById, currentGroup, joinGroup, leaveGroup, loading, error } = useGroupContext();
  const { user, isAuthenticated } = useAuth();
  const [isMember, setIsMember] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [joinLoading, setJoinLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      setIsInitialLoad(true);
      fetchGroupById(id).then((group) => {
        if (group) {
          // Check ownership
          const ownerId = group.owner?._id || group.owner;
          const userId = user?._id || user?.id;
          if (userId && ownerId && String(ownerId) === String(userId)) {
            setIsOwner(true);
            setIsMember(true);
          }
          // Check membership (member list presence or owner)
          if (group.members && Array.isArray(group.members)) {
            const memberIds = group.members.map(m => String(m._id || m));
            if (userId && memberIds.includes(String(userId))) {
              setIsMember(true);
            }
          }
        }
        setIsInitialLoad(false);
      }).catch(() => {
        setIsInitialLoad(false);
      });
    }
  }, [id, fetchGroupById, user]);

  const handleJoin = async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    try {
      setJoinLoading(true);
      await joinGroup(id);
      setIsMember(true);
    } catch (err) {
      console.error('Failed to join group:', err);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleLeave = async () => {
    if (isOwner) {
      alert('As the group owner, you cannot leave. Transfer ownership or delete the group first.');
      return;
    }
    try {
      setJoinLoading(true);
      await leaveGroup(id);
      setIsMember(false);
    } catch (err) {
      console.error('Failed to leave group:', err);
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading || isInitialLoad) return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-on-surface-variant font-medium">Loading community...</p>
      </div>
    </div>
  );
  if (error) return <div className="p-12 text-center text-error bg-error-container rounded-xl mt-24">Error: {error}</div>;
  if (!currentGroup) return <div className="p-12 text-center text-on-surface-variant bg-surface-container-low rounded-xl mt-24">This community could not be found.</div>;

  const ownerName = currentGroup.owner?.name || 'Unknown';
  const ownerInitial = ownerName.charAt(0).toUpperCase();

  return (
    <main className="min-h-screen pb-24 bg-surface text-on-surface antialiased font-body">
      {/* Hero Banner */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <img
          alt="Group Cover"
          className="w-full h-full object-cover"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG2QkZoyb5Aid36KdClUQiQKNhI_sgaHoKkgb3NO3Oki0F16o01OKGVpc5YXgJmWXgkoYnNS1C-9PVBKDKLFI0uMyQ0EPgmus_3YWdHHMWnh5wATRewWjIThIx68Vm2S7JJqMvNA3F5yQWceHQ-nOfUbFDhhrUnOsir-N4NI6ibJVmnRTXIfODhVuz451CXzGpJSYhzTqd064n2tPN_hAt72G1yAg1EI0gXqeyGA_wRjxsQV7WEw1CBvFz5prstkXvUUaDLtfc-js"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-10 flex flex-col md:flex-row justify-between md:items-end gap-6">
          <div className="max-w-2xl">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-white/60 mb-4">
              <Link to="/groups" className="text-xs font-label uppercase tracking-widest hover:text-white transition-colors">Groups</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-xs font-label uppercase tracking-widest font-bold text-white truncate max-w-xs">{currentGroup.name || 'Community'}</span>
            </nav>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-widest uppercase font-label backdrop-blur-sm">{currentGroup.type || 'Public'}</span>
              {currentGroup.category && (
                <span className="bg-primary/80 text-white px-3 py-1 rounded-full text-[0.65rem] font-bold tracking-widest uppercase font-label">{currentGroup.category}</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-white tracking-tight mb-3">{currentGroup.name}</h1>
            <p className="text-white/75 text-base font-body leading-relaxed max-w-xl line-clamp-2">{currentGroup.description}</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
              <span className="material-symbols-outlined text-lg">group</span>
              <span>{currentGroup.membersCount || currentGroup.memberCount || 0} Members</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Owner: Settings button */}
              {isOwner && (
                <Link
                  to={`/groups/${id}/admin`}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm !text-white border border-white/30 hover:bg-white/30 transition-all font-bold text-sm"
                >
                  <span className="material-symbols-outlined text-sm">settings</span>
                  Settings
                </Link>
              )}

              {/* Member actions */}
              {isMember ? (
                <>
                  <Link
                    to={`/groups/${id}/chat`}
                    className="premium-gradient px-7 py-3 rounded-xl !text-black font-headline font-bold text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span>
                    Enter Chat
                  </Link>
                  {!isOwner && (
                    <button
                      onClick={handleLeave}
                      disabled={joinLoading}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/20 backdrop-blur-sm !text-white border border-white/30 hover:bg-red-500/80 hover:border-red-400 transition-all font-bold text-sm"
                    >
                      <span className="material-symbols-outlined text-sm">exit_to_app</span>
                      Leave
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={joinLoading}
                  className="premium-gradient px-7 py-3 rounded-xl !text-black font-headline font-bold text-sm uppercase tracking-widest flex items-center gap-2 shadow-xl hover:-translate-y-1 transition-all duration-300 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-sm">group_add</span>
                  {joinLoading ? 'Joining...' : isAuthenticated() ? 'Join Group' : 'Login to Join'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1300px] mx-auto px-8 md:px-12 -mt-8 relative z-10">
        <div className="grid grid-cols-12 gap-8">

          {/* Left: About + Rules */}
          <div className="col-span-12 lg:col-span-8 space-y-8">

            {/* About Card */}
            <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_4px_24px_rgba(31,27,24,0.06)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">info</span>
                </div>
                <h2 className="text-xl font-headline font-bold tracking-tight">About this Community</h2>
              </div>
              <p className="text-on-surface-variant font-body leading-relaxed whitespace-pre-line">{currentGroup.description}</p>

              <div className="mt-6 flex items-center gap-4 pt-6 border-t border-outline-variant/10 text-sm text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">calendar_today</span>
                  <span>Created {currentGroup.createdAt ? new Date(currentGroup.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Recently'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">lock{currentGroup.type === 'Private' ? '' : '_open'}</span>
                  <span>{currentGroup.type || 'Public'} Group</span>
                </div>
              </div>
            </div>

            {/* Restrictions Banner — non-members */}
            {!isMember && (
              <div className="bg-surface-container-low border border-outline-variant/20 rounded-2xl p-6 flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">lock_open</span>
                <div>
                  <h3 className="font-headline font-bold text-on-surface mb-1">
                    {isAuthenticated() ? 'Join to access the chat and all content' : 'Log in to participate'}
                  </h3>
                  <p className="text-sm text-on-surface-variant">
                    {isAuthenticated()
                      ? 'You are viewing this community as a guest. Join to send messages, access exclusive resources, and connect with members.'
                      : 'Create an account or log in to join this community and interact with members.'}
                  </p>
                </div>
                {!isAuthenticated() && (
                  <Link to="/login" className="ml-auto flex-shrink-0 bg-primary !text-black font-bold px-5 py-2 rounded-xl text-sm hover:opacity-90 transition">Log In</Link>
                )}
              </div>
            )}

            {/* Community Rules */}
            {currentGroup.rules && currentGroup.rules.length > 0 && (
              <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-[0px_4px_24px_rgba(31,27,24,0.06)]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary">gavel</span>
                  </div>
                  <h2 className="text-xl font-headline font-bold tracking-tight">Community Rules</h2>
                </div>
                <div className="space-y-4">
                  {currentGroup.rules.map((rule, index) => (
                    <div key={rule._id || index} className="flex gap-4 p-4 bg-surface-container-low rounded-xl">
                      <span className="font-headline font-black text-primary/30 text-2xl w-8 flex-shrink-0">{index + 1}</span>
                      <div>
                        <h4 className="font-headline font-bold text-sm mb-1">{rule.title || `Rule ${index + 1}`}</h4>
                        <p className="text-on-surface-variant text-sm leading-relaxed">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Creator, Stats, Members */}
          <div className="col-span-12 lg:col-span-4 space-y-6">

            {/* Creator Card */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_24px_rgba(31,27,24,0.06)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-primary">manage_accounts</span>
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest">Community Creator</h3>
              </div>
              <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-white text-xl flex-shrink-0">
                  {ownerInitial}
                </div>
                <div>
                  <h4 className="font-headline font-bold text-on-surface">{ownerName}</h4>
                  <p className="text-xs font-label uppercase tracking-widest text-primary font-bold">Founder · Community Lead</p>
                </div>
                {isOwner && (
                  <span className="ml-auto text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-full uppercase tracking-wider">You</span>
                )}
              </div>
            </div>

            {/* Members Count Card */}
            <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0px_4px_24px_rgba(31,27,24,0.06)]">
              <div className="flex items-center gap-3 mb-5">
                <span className="material-symbols-outlined text-primary">group</span>
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest">Members</h3>
              </div>
              <p className="text-4xl font-headline font-extrabold text-primary">
                {currentGroup.membersCount || currentGroup.memberCount || 0}
              </p>
              <p className="text-on-surface-variant text-sm mt-1">Active community members</p>
              {isMember && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 rounded-lg px-3 py-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  You are a member
                </div>
              )}
            </div>

            {/* Owner Settings Panel */}
            {isOwner && (
              <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="material-symbols-outlined text-primary">admin_panel_settings</span>
                  <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary">Owner Controls</h3>
                </div>
                <div className="space-y-3">
                  <Link
                    to={`/groups/${id}/admin`}
                    className="flex items-center gap-3 w-full p-3 rounded-xl bg-white hover:bg-surface-container-low transition-colors text-on-surface font-semibold text-sm"
                  >
                    <span className="material-symbols-outlined text-primary text-lg">settings</span>
                    Group Settings
                  </Link>
                  <Link
                    to={`/groups/${id}/admin`}
                    className="flex items-center gap-3 w-full p-3 rounded-xl bg-white hover:bg-surface-container-low transition-colors text-on-surface font-semibold text-sm"
                  >
                    <span className="material-symbols-outlined text-primary text-lg">edit</span>
                    Edit Group Details
                  </Link>
                  <Link
                    to={`/groups/${id}/admin`}
                    className="flex items-center gap-3 w-full p-3 rounded-xl bg-white hover:bg-surface-container-low transition-colors text-on-surface font-semibold text-sm"
                  >
                    <span className="material-symbols-outlined text-primary text-lg">people</span>
                    Manage Members
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
