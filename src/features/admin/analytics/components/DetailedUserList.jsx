
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Users,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Calendar,
  Activity,
  Clock
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from 'react-hot-toast';
import config from '../../../../config/config';

export default function DetailedUserList({ timeframe }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [timeframe, currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${config.API_BASE_URL}/analytics/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          timeframe,
          page: currentPage,
          limit: 20
        }
      });
      
      setUsers(response.data.users);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const safeString = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback;
    try {
      return String(value);
    } catch (e) {
      return fallback;
    }
  };

  const safeLower = (value) => safeString(value).toLowerCase();

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Mentor': return 'bg-blue-100 text-blue-800';
      case 'User': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const normalizedSearch = (searchTerm || '').toLowerCase().trim();
  const filteredUsers = users.filter(user => {
    if (!normalizedSearch) return true;
    return (
      safeLower(user.name).includes(normalizedSearch) ||
      safeLower(user.email).includes(normalizedSearch) ||
      safeLower(user.username).includes(normalizedSearch)
    );
  });

  const UserActivityModal = ({ user, onClose }) => {
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);

    useEffect(() => {
      fetchUserActivity();
    }, []);

    const fetchUserActivity = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${config.API_BASE_URL}/analytics/users/${user._id}/activity`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { timeframe, limit: 50 }
          }
        );
        setActivities(response.data.activities);
      } catch (error) {
        console.error('Error fetching user activity:', error);
        toast.error('Failed to load user activity');
      } finally {
        setActivityLoading(false);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">User Activity Details</h3>
                <p className="text-gray-600">{safeString(user.name)} ({safeString(user.email)})</p>
              </div>
              <Button onClick={onClose} variant="outline">
                Close
              </Button>
            </div>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-96">
            {activityLoading ? (
              <div className="text-center">Loading activities...</div>
            ) : (
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-200 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium capitalize">
                          {activity.activityType ? activity.activityType.replace('_', ' ') : 'Activity'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activity.page && `Page: ${activity.page}`}
                        </p>
                        {activity.details && Object.keys(activity.details).length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            {JSON.stringify(activity.details, null, 2)}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                {activities.length === 0 && (
                  <p className="text-gray-500 text-center">No activities found for this timeframe</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading users...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Analytics ({pagination.totalUsers} users)
            </CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Last Login</th>
                  <th className="text-left py-3 px-4">Activities</th>
                  <th className="text-left py-3 px-4">Sessions</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
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
                          <p className="text-xs text-gray-500">@{safeString(user.username)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(user.lastLogin)}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center text-sm">
                        <Activity className="h-4 w-4 mr-1 text-blue-600" />
                        {user.totalActivities}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600">
                        {user.totalSessions}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        onClick={() => setSelectedUser(user)}
                        size="sm"
                        variant="outline"
                        className="flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <p className="text-sm text-gray-600">
              Showing {((currentPage - 1) * pagination.limit) + 1} to{' '}
              {Math.min(currentPage * pagination.limit, pagination.totalUsers)} of{' '}
              {pagination.totalUsers} users
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                disabled={currentPage === pagination.totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Activity Modal */}
      {selectedUser && (
        <UserActivityModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
        />
      )}
    </>
  );
}
