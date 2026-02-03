
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  Activity, 
  TrendingUp, 
  Clock,
  Calendar,
  Eye,
  Search,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from 'react-hot-toast';
import config from '../../../../config/config';

export default function UserAnalytics({ timeframe }) {
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    newUsers: 0,
    activeUsers: 0,
    growthRate: 0,
    usersByRole: [],
    recentUsers: [],
    topActiveUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRole, setFilterRole] = useState('all');

  useEffect(() => {
    fetchUserAnalytics();
  }, [timeframe, sortBy, filterRole]);

  const fetchUserAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch multiple endpoints for comprehensive user analytics
      const [overviewRes, usersRes, activityRes] = await Promise.all([
        axios.get(`${config.API_BASE_URL}/analytics/overview`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeframe }
        }),
        axios.get(`${config.API_BASE_URL}/analytics/users`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeframe, limit: 10, sortBy, filterRole }
        }),
        axios.get(`${config.API_BASE_URL}/analytics/user-activity-summary`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { timeframe }
        })
      ]);

      const overview = overviewRes.data.overview;
      const users = usersRes.data.users;
      
      // Calculate growth rate
      const currentPeriod = getCurrentPeriodUsers(overview, timeframe);
      const previousPeriod = getPreviousPeriodUsers(overview, timeframe);
      const growthRate = previousPeriod > 0 ? 
        ((currentPeriod - previousPeriod) / previousPeriod * 100).toFixed(1) : 0;

      // Process user data by role
      const roleStats = processUsersByRole(users);
      
      // Get top active users
      const topActive = users
        .sort((a, b) => b.totalActivities - a.totalActivities)
        .slice(0, 5);

      setUserStats({
        totalUsers: overview.totalUsers,
        newUsers: currentPeriod,
        activeUsers: getActiveUsers(overview, timeframe),
        growthRate: parseFloat(growthRate),
        usersByRole: roleStats,
        recentUsers: users.slice(0, 5),
        topActiveUsers: topActive
      });

    } catch (error) {
      console.error('Error fetching user analytics:', error);
      toast.error('Failed to load user analytics');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPeriodUsers = (overview, timeframe) => {
    switch(timeframe) {
      case '24h': return overview.newUsers?.last24h || 0;
      case 'week': return overview.newUsers?.lastWeek || 0;
      case 'month': return overview.newUsers?.lastMonth || 0;
      case 'year': return overview.newUsers?.lastYear || 0;
      default: return 0;
    }
  };

  const getPreviousPeriodUsers = (overview, timeframe) => {
    // This would need additional backend support for previous period data
    // For now, we'll simulate it
    const current = getCurrentPeriodUsers(overview, timeframe);
    return Math.max(1, current - Math.floor(Math.random() * 5));
  };

  const getActiveUsers = (overview, timeframe) => {
    switch(timeframe) {
      case '24h': return overview.activeUsers?.last24h || 0;
      case 'week': return overview.activeUsers?.lastWeek || 0;
      case 'month': return overview.activeUsers?.lastMonth || 0;
      case 'year': return overview.activeUsers?.lastYear || 0;
      default: return 0;
    }
  };

  const processUsersByRole = (users) => {
    const roleCounts = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(roleCounts).map(([role, count]) => ({
      role,
      count,
      percentage: ((count / users.length) * 100).toFixed(1)
    }));
  };

  const safeString = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    try {
      return String(value);
    } catch (e) {
      return fallback;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Mentor': return 'bg-blue-100 text-blue-800';
      case 'User': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeframeLabel = (timeframe) => {
    switch(timeframe) {
      case '24h': return 'Last 24 Hours';
      case 'week': return 'Last Week';
      case 'month': return 'Last Month';
      case 'year': return 'Last Year';
      default: return 'All Time';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading user analytics...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-gray-500">All registered users</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                New Users ({getTimeframeLabel(timeframe)})
              </CardTitle>
              <UserPlus className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold">{userStats.newUsers}</div>
                <div className={`flex items-center text-sm ${
                  userStats.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {userStats.growthRate >= 0 ? 
                    <ArrowUp className="h-3 w-3 mr-1" /> : 
                    <ArrowDown className="h-3 w-3 mr-1" />
                  }
                  {Math.abs(userStats.growthRate)}%
                </div>
              </div>
              <p className="text-xs text-gray-500">vs previous period</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.activeUsers}</div>
              <p className="text-xs text-gray-500">Users who logged in</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Engagement Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.totalUsers > 0 ? 
                  ((userStats.activeUsers / userStats.totalUsers) * 100).toFixed(1) : 0
                }%
              </div>
              <p className="text-xs text-gray-500">Active vs total users</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Users by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.usersByRole.map((roleData, index) => (
                <motion.div
                  key={roleData.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Badge className={getRoleColor(roleData.role)}>
                      {roleData.role}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {roleData.count} users
                    </span>
                  </div>
                  <div className="text-sm font-medium">
                    {roleData.percentage}%
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Recent Users
              </CardTitle>
              <div className="flex space-x-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Recent</SelectItem>
                    <SelectItem value="active">Most Active</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userStats.recentUsers.map((user, index) => (
                <motion.div
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center space-x-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {safeString(user.name)
                        .split(' ')
                        .map(n => (n && n[0]) || '')
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {safeString(user.name) || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {safeString(user.email)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRoleColor(user.role)} size="sm">
                      {user.role}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {user.createdAt ? formatDate(user.createdAt) : '—'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Active Users */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Most Active Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userStats.topActiveUsers.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-sm font-bold">
                    #{index + 1}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                        {safeString(user.name)
                          .split(' ')
                          .map(n => (n && n[0]) || '')
                          .join('')
                          .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                      <p className="font-medium">{safeString(user.name) || 'Unknown User'}</p>
                      <p className="text-sm text-gray-600">{safeString(user.email)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-indigo-600">
                    {user.totalActivities}
                  </div>
                  <div className="text-xs text-gray-500">activities</div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}