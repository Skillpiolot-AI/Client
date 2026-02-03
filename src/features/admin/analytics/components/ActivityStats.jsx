
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';
import config from '../../../../config/config';

export default function ActivityStats({ timeframe, detailed = false }) {
  const [activityStats, setActivityStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivityStats();
  }, [timeframe]);

  const fetchActivityStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${config.API_BASE_URL}/analytics/activity-stats`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeframe }
      });
      
      setActivityStats(response.data.activityStats);
    } catch (error) {
      console.error('Error fetching activity stats:', error);
      toast.error('Failed to load activity statistics');
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (activityType) => {
    const colors = {
      login: 'bg-green-100 text-green-800',
      logout: 'bg-red-100 text-red-800',
      page_visit: 'bg-blue-100 text-blue-800',
      quiz_taken: 'bg-purple-100 text-purple-800',
      career_recommendation_viewed: 'bg-orange-100 text-orange-800',
      profile_updated: 'bg-indigo-100 text-indigo-800',
      video_watched: 'bg-pink-100 text-pink-800',
      workshop_registered: 'bg-yellow-100 text-yellow-800',
      mentor_appointment: 'bg-cyan-100 text-cyan-800',
      resource_downloaded: 'bg-teal-100 text-teal-800',
      community_post: 'bg-lime-100 text-lime-800'
    };
    return colors[activityType] || 'bg-gray-100 text-gray-800';
  };

  const formatActivityType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <Card className={detailed ? 'col-span-full' : ''}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading activity stats...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={detailed ? 'col-span-full' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Activity Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityStats.length === 0 ? (
            <p className="text-gray-500 text-center">No activity data available for this timeframe</p>
          ) : (
            activityStats.map((stat, index) => (
              <div key={stat.activityType} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">{formatActivityType(stat.activityType)}</p>
                    <p className="text-sm text-gray-600">{stat.uniqueUsers} unique users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-sm text-gray-500">activities</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {detailed && activityStats.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activityStats.map((stat) => (
              <div key={stat.activityType} className="bg-white border rounded-lg p-4">
                <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mb-2 ${getActivityColor(stat.activityType)}`}>
                  {formatActivityType(stat.activityType)}
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.count}</p>
                  <p className="text-sm text-gray-600">{stat.uniqueUsers} users</p>
                  <p className="text-xs text-gray-500">
                    Avg: {(stat.count / stat.uniqueUsers).toFixed(1)} per user
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
