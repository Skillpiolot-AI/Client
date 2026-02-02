
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Users, 
  Activity, 
  Calendar, 
  TrendingUp,
  Eye,
  Clock,
  UserPlus,
  LogIn,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'react-hot-toast';
import config from '../../../config';
import OverviewCards from './components/OverviewCards';
import UserAnalytics from './components/UserAnalytics';
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
    { value: '24h', label: '24 Hours' },
    { value: 'week', label: '1 Week' },
    { value: 'month', label: '1 Month' },
    { value: 'year', label: '1 Year' },
  ];

  const tabOptions = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'patterns', label: 'Login Patterns', icon: TrendingUp },
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
    toast.success('Data refreshed successfully');
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_BASE_URL}/analytics/export`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeframe },
        responseType: 'blob'
      });
      
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Analytics data exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Monitor user engagement and platform performance</p>
            </div>
            <div className="flex space-x-3">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeframeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                className="flex items-center"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={exportData} className="flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabOptions.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <OverviewCards overview={overview} timeframe={timeframe} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ActivityStats timeframe={timeframe} />
                <LoginPatterns timeframe={timeframe} />
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <DetailedUserList timeframe={timeframe} />
          )}

          {activeTab === 'activity' && (
            <ActivityStats timeframe={timeframe} detailed={true} />
          )}

          {activeTab === 'patterns' && (
            <LoginPatterns timeframe={timeframe} detailed={true} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
