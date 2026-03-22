
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import config from '../../../config';

// Sub-components (Reusing existing components but wrapping in modern Bento Layout)
import OverviewCards from './components/OverviewCards';
import ActivityStats from './components/ActivityStats';
import LoginPatterns from './components/LoginPatterns';
import DetailedUserList from './components/DetailedUserList';

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('week');
  const [overview, setOverview] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const timeframeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'year', label: 'Last Year' },
  ];

  const tabOptions = [
    { id: 'overview', label: 'Analytics', icon: 'analytics' },
    { id: 'users', label: 'User Directory', icon: 'group' },
    { id: 'activity', label: 'Activity Logs', icon: 'list_alt' },
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeframe]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${config.API_BASE_URL}/analytics/overview`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeframe }
      });
      
      setOverview(response.data.overview);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAnalyticsData();
    setRefreshing(false);
    toast.success('Metrics synchronized');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl animate-spin text-primary mb-2">sync</span>
          <p className="text-secondary font-body">Loading environment analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen">
      <main className="pt-24 pb-20 px-8 max-w-[1440px] mx-auto">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 mt-8">
          <div>
            <h1 className="font-headline font-extrabold text-4xl text-primary tracking-tight mb-2">Systems Intelligence</h1>
            <p className="text-secondary">Comprehensive diagnostics of node growth, authentications, and traffic indexing.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary text-lg">calendar_today</span>
              <select 
                value={timeframe} 
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-surface-container-high border-none rounded-xl py-3 pl-10 pr-10 appearance-none font-label text-xs font-bold tracking-wider uppercase text-primary focus:ring-2 focus:ring-primary/10 w-full"
              >
                {timeframeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none">arrow_drop_down</span>
            </div>
            
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest transition-colors flex items-center justify-center"
            >
              <span className={`material-symbols-outlined text-primary ${refreshing ? 'animate-spin' : ''}`}>sync</span>
            </button>
          </div>
        </section>

        {/* Navigation Tabs (Sub-Navigation) */}
        <div className="flex gap-2 mb-8 bg-surface-container-low p-1.5 rounded-2xl w-fit">
          {tabOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-label text-xs font-bold tracking-wider uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/10'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Workspace Bento Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[600px]"
        >
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8">
              {/* Stat Bento (Calculated locally if API relies on sub-components) */}
              <OverviewCards overview={overview} timeframe={timeframe} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/5">
                  <h3 className="font-headline font-bold text-lg text-primary mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-tertiary">bubble_chart</span>
                    Access Metrics
                  </h3>
                  <ActivityStats timeframe={timeframe} />
                </div>
                
                <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/5">
                  <h3 className="font-headline font-bold text-lg text-primary mb-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary">insights</span>
                    Authentication Trails
                  </h3>
                  <LoginPatterns timeframe={timeframe} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10">
              <DetailedUserList timeframe={timeframe} />
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10">
              <ActivityStats timeframe={timeframe} detailed={true} />
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
