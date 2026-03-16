import React from 'react';
import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';

const C = {
  indigo: '#4F46E5',
  slate: '#64748B',
  dark: '#1E293B',
  border: '#E2E8F0',
};

export default function Header({ user }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div style={{
      height: '70px',
      background: '#fff',
      borderBottom: `1px solid ${C.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      boxSizing: 'border-box'
    }}>
      {/* Left: Search Bar */}
      <div style={{ position: 'relative', width: '280px' }}>
        <input 
          type="text" 
          placeholder="Search..." 
          style={{
            width: '100%',
            padding: '10px 16px 10px 40px',
            borderRadius: '12px',
            border: `1.5px solid ${C.border}`,
            background: '#F8FAFC',
            fontSize: '14px',
            outline: 'none',
            color: C.dark
          }}
        />
        <Search size={18} style={{ position: 'absolute', left: '14px', top: '12px', color: '#94A3B8' }} />
      </div>

      {/* Center: Date Node */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        fontWeight: 600,
        color: C.slate,
        background: '#F8FAFC',
        padding: '8px 16px',
        borderRadius: '10px',
        border: `1px solid ${C.border}`
      }}>
         📅 {currentDate} <ChevronDown size={14} />
      </div>

      {/* Right: Actions Queue & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
         <button style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', color: C.slate }}>
           <MessageSquare size={20} />
           <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', background: C.indigo, borderRadius: '50%' }} />
         </button>

         <button style={{ position: 'relative', background: 'transparent', border: 'none', cursor: 'pointer', color: C.slate }}>
           <Bell size={20} />
           <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', background: '#EF4444', borderRadius: '50%' }} />
         </button>

         <div style={{ height: '24px', width: '1px', background: C.border }} />

         {/* Profile Card */}
         <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
           <div style={{ textAlign: 'right' }}>
             <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: C.dark }}>{user?.name || 'Mentor'}</p>
             <p style={{ margin: 0, fontSize: '11px', color: C.slate, fontWeight: 500 }}>{user?.role || 'Mentor'}</p>
           </div>
           <div style={{
             width: '38px',
             height: '38px',
             borderRadius: '10px',
             background: 'linear-gradient(135deg, #FF6B6B, #FF8E53)',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             color: '#fff',
             fontWeight: 700,
             fontSize: '14px',
             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
           }}>
             {user?.name?.[0].toUpperCase() || 'M'}
           </div>
         </div>
      </div>
    </div>
  );
}
