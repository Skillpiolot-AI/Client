import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

export default function CommunityLayout() {
  const navigationItems = [
    { title: 'Home', icon: 'grid_view', path: '/groups' },
    { title: 'Discovery', icon: 'explore', path: '/groups/discover' },
    { title: 'Create Group', icon: 'add_circle', path: '/groups/create' },
    { title: 'My Groups', icon: 'folder', path: '/groups/my-groups' },
    { title: 'Moderation', icon: 'gavel', path: '/groups/admin' },
    { title: 'Settings', icon: 'settings', path: '/groups/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex flex-col h-screen w-64 p-6 space-y-8 bg-surface sticky top-0 border-r border-outline-variant/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-container rounded-xl flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
          </div>
          <h1 className="font-headline font-extrabold text-primary text-xl tracking-tighter">SkillPilot</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <p className="font-label text-xs font-semibold uppercase tracking-[0.05em] text-slate-500 mb-4 px-4">Navigator</p>
          
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/groups'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:translate-x-1 ${
                  isActive 
                    ? 'bg-gradient-to-r from-primary to-primary-container text-white shadow-lg' 
                    : 'text-slate-600 hover:bg-surface-container-low'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-semibold">{item.title}</span>
            </NavLink>
          ))}
        </nav>
        
        {/* User Card */}
        <div className="pt-6 mt-auto">
          <div className="bg-surface-container-low rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container-highest rounded-full border-2 border-white flex items-center justify-center font-bold text-primary">
              C
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Community Lead</p>
              <p className="text-[10px] font-label uppercase tracking-wider text-secondary">Dashboard</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-8 md:px-16 py-12 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
