import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewGrid from './components/OverviewGrid';
import { useAuth } from '../../../AuthContext';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      background: '#F8FAFC',
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabSelect={setActiveTab} />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <Header user={user} />

        {/* Scrollable Body */}
        <div style={{
          flex: 1,
          padding: '32px',
          overflowY: 'auto',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          {activeTab === 'overview' && <OverviewGrid user={user} />}
          
          {activeTab !== 'overview' && (
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid #E2E8F0',
              color: '#64748B',
              fontSize: '15px',
              fontWeight: 600
            }}>
              🚀 {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} view integration pending connection...
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
