import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import './styles/GroupDetailPage.css';

export default function GroupDetailPage() {
  const { id } = useParams();
  const { fetchGroupById, currentGroup, joinGroup, loading, error } = useGroupContext();
  const [isMember, setIsMember] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchGroupById(id).then((group) => {
        // Indicative membership check
        if (group && group.members) {
          setIsMember(true); // fallback or wire to auth
        }
      });
    }
  }, [id, fetchGroupById]);

  const handleJoinGroup = async () => {
    try {
      await joinGroup(id);
      setIsMember(true);
    } catch (err) {
      console.error('Failed to join group:', err);
    }
  };

  if (loading) return <div className="p-12 text-center text-secondary">Loading group details...</div>;
  if (error || !currentGroup) return <div className="p-12 text-center text-error bg-error-container rounded-xl">{error || 'Group not found'}</div>;

  return (
    <div className="bg-surface text-on-surface antialiased">
      {/* Hero Section: Group Header */}
      <section className="relative rounded-3xl overflow-hidden mb-12">
        <div className="h-64 md:h-80 w-full relative">
          <img 
            alt="Group Banner" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] uppercase font-bold tracking-widest rounded-full">
                {currentGroup.type || 'Public'}
              </span>
              <span className="flex items-center gap-1 text-white/90 text-sm font-medium">
                <span className="material-symbols-outlined text-sm">group</span> 
                {currentGroup.memberCount || 0} Members
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">{currentGroup.name}</h1>
            <p className="text-white/80 max-w-xl font-medium">{currentGroup.description}</p>
          </div>

          <div className="flex items-center gap-4">
            {isMember ? (
              <Link to={`/groups/${id}/chat`} className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                Enter Chat
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            ) : (
              <button 
                onClick={handleJoinGroup}
                className="px-8 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                Join Group
              </button>
            )}
            <button className="p-4 bg-white/10 backdrop-blur-md text-white rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </section>

      {/* Bento Layout: Content Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-8">
          {/* Description Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 transition-all duration-300 border border-outline-variant/10">
            <h2 className="text-2xl font-bold mb-6 text-primary">About this Community</h2>
            <div className="space-y-4 text-on-surface-variant leading-relaxed font-body">
              <p>{currentGroup.description}</p>
              <p>Welcome to our professional ecosystem. This space is dedicated to continuous learning, core development, and organization strategy queries mapping target loops efficiently.</p>
            </div>
          </div>

          {/* Rules Accordion */}
          {currentGroup.rules && currentGroup.rules.length > 0 && (
            <div className="bg-surface-container-low rounded-3xl p-8">
              <h2 className="text-2xl font-bold mb-8 text-primary">Community Rules</h2>
              <div className="space-y-4">
                {currentGroup.rules.map((rule, index) => (
                  <div key={index} className="group bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-300 border border-outline-variant/10">
                    <div className="w-full flex items-center justify-between p-6">
                      <span className="font-bold text-primary flex items-center gap-4">
                        <span className="text-primary/30 font-black">{(index + 1).toString().padStart(2, '0')}</span>
                        {rule}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Group Stats Card */}
          <div className="bg-primary text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">insights</span>
              Activity Insights
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60 text-sm">Created</span>
                <span className="font-bold">{new Date(currentGroup.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <span className="text-white/60 text-sm">Response Rate</span>
                <span className="font-bold">98%</span>
              </div>
            </div>
          </div>

          {/* Moderators */}
          <div className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/10">
            <h3 className="text-lg font-bold mb-6 text-primary">Moderators</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-surface-container-highest rounded-full flex items-center justify-center font-bold text-primary">
                  M
                </div>
                <div>
                  <span className="block font-bold text-primary text-sm">Owner</span>
                  <span className="text-xs text-on-surface-variant">Community Lead</span>
                </div>
              </div>
            </div>
            {isMember && (
              <Link to={`/groups/${id}/settings`} className="w-full mt-8 flex justify-center py-3 rounded-xl border border-outline-variant/30 text-primary text-sm font-bold hover:bg-surface-container-low transition-colors">
                Group Settings
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
