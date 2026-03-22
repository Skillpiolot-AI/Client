import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGroupContext } from '../../contexts/GroupContext';
import './styles/CommunityHomePage.css';

export default function CommunityHomePage() {
  const { fetchGroups, groups, loading } = useGroupContext();

  useEffect(() => {
    fetchGroups({ limit: 4 });
  }, []);

  return (
    <div className="bg-surface font-body text-on-surface">
      {/* Header Section: Editorial Hero */}
      <header className="mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="font-headline text-5xl md:text-6xl font-extrabold text-primary tracking-tight leading-none mb-6">
              The Hub for <span className="text-tertiary-container">Growth.</span>
            </h2>
            <p className="text-lg text-secondary leading-relaxed max-w-lg">
              Welcome back to SkillPilot. Join high-performance groups, track your community impact, and navigate your professional evolution.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/groups/discover" className="px-6 py-4 bg-surface-container-highest text-primary font-bold rounded-xl hover:bg-surface-container-high transition-all flex items-center gap-2">
              Explore Groups
            </Link>
            <Link to="/groups/create" className="px-6 py-4 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
              Create New Group
            </Link>
          </div>
        </div>
      </header>

      {/* Community Stats */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(31,27,24,0.06)] group hover:translate-y-[-4px] transition-all duration-300">
            <p className="font-label text-xs font-bold uppercase tracking-widest text-secondary mb-2">Total Members</p>
            <h3 className="font-headline text-4xl font-extrabold text-primary">12.4k</h3>
            <div className="mt-4 flex items-center gap-2 text-tertiary-fixed-dim bg-tertiary/5 w-fit px-2 py-1 rounded">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xs font-bold">+12% this month</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(31,27,24,0.06)] group hover:translate-y-[-4px] transition-all duration-300">
            <p className="font-label text-xs font-bold uppercase tracking-widest text-secondary mb-2">Active Groups</p>
            <h3 className="font-headline text-4xl font-extrabold text-primary">{loading ? '...' : groups.length || 0}</h3>
            <div className="mt-4 flex items-center gap-2 text-secondary w-fit px-2 py-1 rounded">
              <span className="material-symbols-outlined text-sm">groups</span>
              <span className="text-xs font-bold">Live discussions now</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_20px_40px_rgba(31,27,24,0.06)] group hover:translate-y-[-4px] transition-all duration-300">
            <p className="font-label text-xs font-bold uppercase tracking-widest text-secondary mb-2">Learning Hours</p>
            <h3 className="font-headline text-4xl font-extrabold text-primary">48.2k</h3>
            <div className="mt-4 flex items-center gap-2 text-secondary w-fit px-2 py-1 rounded">
              <span className="material-symbols-outlined text-sm">auto_stories</span>
              <span className="text-xs font-bold">Community-led sessions</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Channels Layout */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h4 className="font-headline text-2xl font-bold text-primary">Featured Channels</h4>
          <Link to="/groups/discover" className="font-label text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-primary/10 hover:border-primary transition-all">View All</Link>
        </div>

        {loading ? (
          <div>Loading awesome groups...</div>
        ) : groups.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-lowest rounded-xl">No groups available. Be the first to create one!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-6 grid-rows-2 gap-6 h-auto md:h-[600px]">
            {groups.slice(0, 3).map((group, index) => {
              if (index === 0) {
                // Large Feature Card
                return (
                  <Link key={group._id} to={`/groups/${group._id}`} className="md:col-span-4 md:row-span-2 relative overflow-hidden rounded-xl bg-primary group">
                    <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-surface-container-low" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-10 z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-tertiary-fixed text-tertiary font-bold text-[10px] uppercase rounded-full">Explore</span>
                        <span className="flex items-center gap-1 text-white/80 text-xs">
                          <span className="material-symbols-outlined text-xs">person</span> {group.memberCount || 0} members
                        </span>
                      </div>
                      <h5 className="font-headline text-4xl font-extrabold text-white mb-4">{group.name}</h5>
                      <p className="text-white/70 max-w-md mb-6 leading-relaxed">{group.description}</p>
                      <button className="bg-white text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
                        Enter Channel <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
                  </Link>
                );
              } else {
                // Secondary Feature Card
                const isTertiary = index % 2 !== 0; // alternates design color
                return (
                  <Link key={group._id} to={`/groups/${group._id}`} className={`md:col-span-2 md:row-span-1 rounded-xl p-8 flex flex-col justify-between border border-outline-variant/10 group transition-all ${isTertiary ? 'bg-tertiary-container hover:brightness-110' : 'bg-surface-container-low hover:bg-surface-container-high'}`}>
                    <div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${isTertiary ? 'bg-tertiary/20' : 'bg-white shadow-sm'}`}>
                        <span className={`material-symbols-outlined text-3xl ${isTertiary ? 'text-tertiary-fixed' : 'text-primary'}`}>{isTertiary ? 'analytics' : 'brush'}</span>
                      </div>
                      <h5 className={`font-headline text-2xl font-bold mb-2 ${isTertiary ? 'text-white' : 'text-primary'}`}>{group.name}</h5>
                      <p className={`text-sm leading-snug ${isTertiary ? 'text-white/70' : 'text-secondary'}`}>{group.description}</p>
                    </div>
                    <div className="mt-4 flex -space-x-2">
                      <div className={`text-xs font-bold ${isTertiary ? 'text-white' : 'text-primary'}`}>{group.memberCount || 0} members</div>
                    </div>
                  </Link>
                );
              }
            })}
          </div>
        )}
      </section>

      {/* Community CTA */}
      <section className="relative bg-surface-container-low rounded-3xl p-12 overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <span className="font-label text-xs font-bold uppercase tracking-widest text-secondary inline-block mb-4 px-3 py-1 bg-white rounded">The Pilot's Way</span>
            <h4 className="font-headline text-4xl font-extrabold text-primary mb-6 leading-tight">Can't find your niche?<br />Launch your own ecosystem.</h4>
            <p className="text-secondary mb-8 text-lg">Take the lead and start a community around your passion. We provide the tools for moderation, content sharing, and member growth.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/groups/create" className="px-8 py-4 bg-primary text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">Start a Group</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
