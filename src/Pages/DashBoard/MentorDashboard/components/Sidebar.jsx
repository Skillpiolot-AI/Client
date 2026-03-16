import React from 'react';
import { LayoutGrid, Calendar, MessageSquare, Settings, Briefcase, Users, LogOut } from 'lucide-react';

const C = {
  indigo: '#4F46E5',
  bg: '#F8FAFC',
  border: '#E2E8F0',
  slate: '#64748B',
  dark: '#1E293B',
};

export default function Sidebar({ activeTab, onTabSelect }) {
  const links = [
    { id: 'overview', icon: LayoutGrid, label: 'Dashboard' },
    { id: 'services', icon: Briefcase, label: 'Services' },
    { id: 'calendar', icon: Calendar, label: 'Schedule' },
    { id: 'sessions', icon: Users, label: 'Sessions' },
    { id: 'messages', icon: MessageSquare, label: 'Messages' },
  ];

  return (
    <div style={{
      width: '90px',
      background: '#fff',
      borderRight: `1px solid ${C.border}`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '24px 0',
      height: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Logo Placeholder */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800,
          fontSize: '18px'
        }}>S</div>
      </div>

      {/* Main Links */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {links.map(link => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;

          return (
            <button
              key={link.id}
              onClick={() => onTabSelect(link.id)}
              title={link.label}
              style={{
                background: isActive ? '#EEF2FF' : 'transparent',
                border: 'none',
                borderRadius: '14px',
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isActive ? C.indigo : C.slate,
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 6px -1px rgba(79, 70, 229, 0.1)' : 'none'
              }}
            >
              <Icon size={22} strokeWidth={2} />
            </button>
          );
        })}
      </div>

      {/* Bottom Settings / Log out */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button style={{ background: 'transparent', border: 'none', color: C.slate, cursor: 'pointer' }}>
          <Settings size={22} />
        </button>
        <button style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer' }}>
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
}
