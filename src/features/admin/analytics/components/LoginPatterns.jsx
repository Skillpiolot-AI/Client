
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import config from '../../../../config/config';

export default function LoginPatterns({ timeframe, detailed = false }) {
  const [loginPatterns, setLoginPatterns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoginPatterns();
  }, [timeframe]);

  const fetchLoginPatterns = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${config.API_BASE_URL}/analytics/login-patterns`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { timeframe }
      });
      
      setLoginPatterns(response.data.loginPatterns);
    } catch (error) {
      console.error('Error fetching login patterns:', error);
      toast.error('Failed to load login patterns');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (timeframe === '24h') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (timeframe === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getHourlyStats = () => {
    const hourlyData = {};
    loginPatterns.forEach(pattern => {
      const hour = new Date(pattern.date).getHours();
      if (!hourlyData[hour]) {
        hourlyData[hour] = { count: 0, uniqueUsers: 0 };
      }
      hourlyData[hour].count += pattern.count;
      hourlyData[hour].uniqueUsers += pattern.uniqueUsers;
    });
    return hourlyData;
  };

  const getDailyStats = () => {
    const dailyData = {};
    loginPatterns.forEach(pattern => {
      const day = new Date(pattern.date).toLocaleDateString();
      if (!dailyData[day]) {
        dailyData[day] = { count: 0, uniqueUsers: 0 };
      }
      dailyData[day].count += pattern.count;
      dailyData[day].uniqueUsers += pattern.uniqueUsers;
    });
    return dailyData;
  };

  if (loading) {
    return (
      <Card className={detailed ? 'col-span-full' : ''}>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading login patterns...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={detailed ? 'col-span-full' : ''}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Login Patterns
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loginPatterns.length === 0 ? (
          <p className="text-gray-500 text-center">No login data available for this timeframe</p>
        ) : (
          <div className="space-y-4">
            {/* Simple Chart Representation */}
            <div className="space-y-2">
              {loginPatterns.slice(0, detailed ? undefined : 10).map((pattern, index) => {
                const maxCount = Math.max(...loginPatterns.map(p => p.count));
                const width = (pattern.count / maxCount) * 100;
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">{formatDate(pattern.date)}</span>
                      <span className="font-medium">{pattern.count} logins</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${width}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {pattern.uniqueUsers} unique users
                    </div>
                  </div>
                );
              })}
            </div>

            {detailed && (
              <>
                {/* Hourly Breakdown */}
                {timeframe === '24h' && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">Hourly Breakdown</h4>
                    <div className="grid grid-cols-6 gap-2">
                      {Array.from({ length: 24 }, (_, hour) => {
                        const hourlyStats = getHourlyStats();
                        const data = hourlyStats[hour] || { count: 0, uniqueUsers: 0 };
                        return (
                          <div key={hour} className="text-center p-2 bg-gray-50 rounded">
                            <div className="text-xs text-gray-600">{hour}:00</div>
                            <div className="font-bold">{data.count}</div>
                            <div className="text-xs text-gray-500">{data.uniqueUsers} users</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Peak Hours */}
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Peak Activity</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-800">
                        {loginPatterns.length > 0 && (
                          <>
                            Peak time: {formatDate(loginPatterns[0]?.date)} with {loginPatterns[0]?.count} logins
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
