import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';

export default function MyGroupsPage() {
  const { fetchMyGroups, myGroups, loading, error } = useGroupContext();

  useEffect(() => {
    fetchMyGroups();
  }, [fetchMyGroups]);

  // Icons array for visual variety
  const icons = ['architecture', 'leaderboard', 'psychology', 'diversity_3', 'terminal', 'lightbulb'];
  const colors = [
    { bg: 'bg-primary', text: 'text-white' },
    { bg: 'bg-secondary-container', text: 'text-on-secondary-container' },
    { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container' },
    { bg: 'bg-primary-container', text: 'text-on-primary-container' },
    { bg: 'bg-tertiary', text: 'text-on-tertiary' },
    { bg: 'bg-secondary', text: 'text-on-secondary' }
  ];

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-secondary-container min-h-screen">
      <main className="pt-20 pb-24 px-6 md:px-12 lg:px-24">
        
        {/* Header Section */}
        <header className="max-w-7xl mx-auto mb-16 space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-on-surface-variant">
              <Link to="/groups" className="text-xs font-label uppercase tracking-widest hover:text-primary transition-colors">Groups</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-xs font-label uppercase tracking-widest font-bold text-primary">My Groups</span>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors duration-300">
                <span className="material-symbols-outlined text-primary">search</span>
              </button>
              <button className="p-2 hover:bg-surface-container-high rounded-full transition-colors duration-300">
                <span className="material-symbols-outlined text-primary">more_vert</span>
              </button>
            </div>
          </div>
          <h1 className="font-headline text-5xl md:text-6xl font-extrabold tracking-tighter text-primary">
            My Groups
          </h1>
          <p className="text-on-surface-variant max-w-lg text-lg leading-relaxed">
            Strategic overview of your active professional communities and specialized mentorship circles.
          </p>
        </header>

        {error && (
          <div className="max-w-7xl mx-auto mb-8 p-6 bg-error-container text-on-error-container rounded-xl flex items-center gap-3">
            <span className="material-symbols-outlined">error</span>
            {error}
          </div>
        )}

        {/* Main Grid */}
        <section className="max-w-7xl mx-auto relative z-10">
          {loading ? (
            <div className="flex justify-center p-12 text-primary font-bold">Loading your communities...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              
              {myGroups.map((group, index) => {
                const icon = icons[index % icons.length];
                const colorTheme = colors[index % colors.length];
                
                return (
                  <div key={group._id} className="group relative overflow-hidden rounded-xl bg-surface-container-lowest p-8 transition-all duration-300 shadow-sm hover:shadow-[0px_20px_40px_rgba(31,27,24,0.06)] hover:-translate-y-1 border border-outline-variant/10">
                    <div className="flex justify-between items-start mb-12">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${colorTheme.bg} ${colorTheme.text}`}>
                        <span className="material-symbols-outlined text-2xl">{icon}</span>
                      </div>
                      <div className="bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        {group.category || 'Active'}
                      </div>
                    </div>
                    
                    <Link to={`/groups/${group._id}`} className="block">
                      <h3 className="font-headline text-2xl font-bold text-primary mb-2 hover:underline">{group.name}</h3>
                    </Link>
                    
                    <p className="text-on-surface-variant text-sm mb-8 leading-relaxed line-clamp-2">
                      {group.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-primary-container text-white flex items-center justify-center text-xs font-bold z-10">
                          {group.name.charAt(0)}
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-surface-container-lowest bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-primary z-0">
                          +{group.memberCount}
                        </div>
                      </div>
                      
                      <Link to={`/groups/${group._id}/chat`} className="flex items-center text-primary font-bold text-xs uppercase tracking-tighter hover:text-secondary transition-colors">
                        <span>Enter Chat</span>
                        <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                );
              })}

              {/* Create Group Action Card */}
              <Link to="/groups/create" className="flex flex-col items-center justify-center rounded-xl bg-surface-container-low border-2 border-dashed border-outline-variant/30 p-8 group cursor-pointer hover:bg-surface-container transition-all duration-300 min-h-[320px]">
                <div className="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:!text-white transition-all duration-300">
                  <span className="material-symbols-outlined text-primary group-hover:!text-white text-2xl">add</span>
                </div>
                <p className="font-headline font-bold text-primary uppercase text-xs tracking-widest">Join / Create Community</p>
              </Link>
              
            </div>
          )}
        </section>

        {/* Featured / Report Section */}
        <section className="max-w-7xl mx-auto mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Featured Banner */}
            <div className="lg:col-span-2 rounded-2xl p-12 relative overflow-hidden shadow-2xl premium-gradient text-white">
              <div className="relative z-10 space-y-6">
                <span className="bg-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
                  Featured Program
                </span>
                <h2 className="font-headline text-4xl font-extrabold leading-tight max-w-md">Quantum Computing Foundations</h2>
                <p className="text-white/80 max-w-sm leading-relaxed">Join the next cohort of pioneers exploring the frontier of high-performance computation and networking.</p>
                <button className="bg-white text-primary px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-tighter hover:bg-surface-bright transition-colors duration-300 flex items-center">
                  Request Invitation
                  <span className="material-symbols-outlined ml-2 text-sm">north_east</span>
                </button>
              </div>
              <div className="absolute -right-20 -top-20 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px]"></div>
            </div>

            {/* Stats Panel */}
            <div className="bg-surface-container-low rounded-2xl p-10 flex flex-col justify-between border border-outline-variant/10">
              <div>
                <div className="flex items-center space-x-2 text-primary mb-6">
                  <span className="material-symbols-outlined">analytics</span>
                  <span className="font-label text-xs font-bold uppercase tracking-widest">Network Pulse</span>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
                    <span className="text-on-surface-variant text-sm font-medium">Active Communities</span>
                    <span className="font-headline text-3xl font-bold text-primary">{myGroups?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
                    <span className="text-on-surface-variant text-sm font-medium">Recent Discussions</span>
                    <span className="font-headline text-3xl font-bold text-primary">24+</span>
                  </div>
                </div>
              </div>
              <button className="w-full mt-8 text-center py-4 rounded-xl border border-outline-variant/30 text-xs font-bold uppercase tracking-widest text-primary hover:bg-surface-container transition-colors duration-300">
                View Full Report
              </button>
            </div>
          </div>
        </section>

      </main>
      
      {/* Mini Footer */}
      <footer className="max-w-7xl mx-auto pb-12 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center text-on-surface-variant/50 text-[10px] font-label uppercase tracking-[0.2em] relative z-10">
        <div className="flex items-center space-x-8 mb-6 md:mb-0">
          <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
          <Link to="#" className="hover:text-primary transition-colors">Guidelines</Link>
          <Link to="#" className="hover:text-primary transition-colors">Support</Link>
        </div>
        <div>
          © 2024 Navigator Strategic Ecosystem
        </div>
      </footer>
    </div>
  );
}
