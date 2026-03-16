import React from 'react';
import { ArrowUpRight, Calendar, Users, DollarSign, Star, Briefcase, Eye, MessageSquare } from 'lucide-react';

const C = {
  indigo: '#4F46E5',
  slate: '#64748B',
  dark: '#1E293B',
  border: '#E2E8F0',
};

export default function OverviewGrid({ user }) {
  const metrics = [
    { title: 'Total Earnings', value: '₹45,200', icon: DollarSign, color: '#EF4444', bg: '#FEE2E2' },
    { title: 'Active Bookings', value: '12', icon: Calendar, color: '#F59E0B', bg: '#FEF3C7' },
    { title: 'Total Students', value: '148', icon: Users, color: '#3B82F6', bg: '#DBEAFE' },
    { title: 'Average Rating', value: '4.8', icon: Star, color: '#10B981', bg: '#D1FAE5' },
  ];

  const notifications = [
    { text: 'Aman booked a 1:1 Resume Review for tomorrow.', type: 'booking', time: '2 mins ago' },
    { text: 'New direct message received from Shreya.', type: 'message', time: '12 mins ago' },
    { text: 'Your application with priority DM response is now live!', type: 'system', time: '1 hour ago' },
  ];

  return (
    <div style={{ display: 'flex', gap: '24px', flex: 1, flexDirection: 'column' }}>
      
      {/* Top Section: Welcome + Notifications */}
      <div style={{ display: 'flex', gap: '24px' }}>
        
        {/* Welcome Banner */}
        <div style={{
          flex: 2,
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '32px',
          border: `1px solid ${C.border}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>
          <div>
            <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: 800, color: C.dark }}>
              Hi, {user?.name || 'Mentor'}!
            </h1>
            <p style={{ margin: '0 0 20px', fontSize: '14px', color: C.slate, fontWeight: 500 }}>
              What are we doing today?
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: C.slate }}>
                <span style={{ color: C.indigo }}>➔</span> Check Calendar
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: C.slate }}>
                <span style={{ color: '#F59E0B' }}>➔</span> Manage Wallet
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: C.slate }}>
                <span style={{ color: '#EF4444' }}>➔</span> View Sessions
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: C.slate }}>
                <span style={{ color: '#10B981' }}>➔</span> Edit Services
              </div>
            </div>
          </div>

          {/* Cute Meditation Placeholder Element */}
          <div style={{
            width: '140px',
            height: '140px',
            background: '#F8FAFC',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '64px',
            boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
          }}>
            🧘‍♂️
          </div>
        </div>

        {/* Notifications Bar */}
        <div style={{
          flex: 1,
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '24px',
          border: `1px solid ${C.border}`,
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: C.dark }}>Notifications</h3>
            <button style={{ background: 'transparent', border: 'none', color: C.indigo, fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>See all</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((n, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '12px',
                padding: '12px',
                borderRadius: '16px',
                background: '#F8FAFC',
                border: `1px solid ${C.border}`,
                alignItems: 'center'
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px', background: '#E0E7FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.indigo
                }}>
                  {n.type === 'booking' ? <Calendar size={16} /> : <MessageSquare size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: 600, color: C.dark, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.text}</p>
                  <p style={{ margin: 0, fontSize: '10px', color: C.slate }}>{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Metrics Grid Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <div key={i} style={{
              background: '#FFFFFF',
              borderRadius: '24px',
              padding: '24px',
              border: `1px solid ${C.border}`,
              position: 'relative',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', background: m.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color
                }}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <button style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div>
                <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: C.slate }}>{m.title}</p>
                <p style={{ margin: '0', fontSize: '24px', fontWeight: 800, color: C.dark }}>{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
