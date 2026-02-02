import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import config from '../../config';
import { 
  Clock, 
  Users, 
  ExternalLink, 
  AlertCircle, 
  Star, 
  Filter,
  Search,
  RefreshCw,
  Lock,
  CheckCircle,
  Bug,
  Zap,
  Shield,
  Palette,
  Plus
} from 'lucide-react';

const UpdatesPage = () => {
  const { user } = useAuth();
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchUpdates();
  }, [currentPage, searchTerm, filterType, filterPriority]);

  const fetchUpdates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please log in to view updates');
        return;
      }

      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10'
      });

      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterType) queryParams.append('updateType', filterType);
      if (filterPriority) queryParams.append('priority', filterPriority);

      const endpoint = user?.role === 'Admin' 
        ? `${config.API_BASE_URL}/updates/admin?${queryParams}`
        : `${config.API_BASE_URL}/updates?${queryParams}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setUpdates(data.data);
        setPagination(data.pagination);
      } else {
        setError(data.message || 'Failed to fetch updates');
      }
    } catch (err) {
      console.error('Error fetching updates:', err);
      setError('Failed to load updates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = (update) => {
    if (update.allowedRoles.includes(user.role)) {
      window.open(update.redirectUrl, '_blank');
    }
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'Feature': return <Star className="w-5 h-5" />;
      case 'Bug Fix': return <Bug className="w-5 h-5" />;
      case 'Enhancement': return <Zap className="w-5 h-5" />;
      case 'Security': return <Shield className="w-5 h-5" />;
      case 'UI/UX': return <Palette className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Feature': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Bug Fix': return 'text-red-600 bg-red-50 border-red-200';
      case 'Enhancement': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Security': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'UI/UX': return 'text-pink-600 bg-pink-50 border-pink-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Updates
          </h1>
          <p className="text-gray-600 text-lg">
            Stay informed about the latest features, improvements, and fixes
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search updates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="Feature">Feature</option>
                <option value="Bug Fix">Bug Fix</option>
                <option value="Enhancement">Enhancement</option>
                <option value="Security">Security</option>
                <option value="UI/UX">UI/UX</option>
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchUpdates}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </motion.button>

              {user?.role === 'Admin' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/admin/updates'}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Update
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
          >
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          </motion.div>
        )}

        {/* Updates Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {updates.map((update, index) => {
              const canAccess = update.allowedRoles.includes(user.role);
              
              return (
                <motion.div
                  key={update._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl ${
                    canAccess ? 'cursor-pointer' : 'opacity-75'
                  }`}
                  onClick={() => canAccess && handleRedirect(update)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(update.updateType)}`}>
                        {getUpdateIcon(update.updateType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {update.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          v{update.version}
                        </p>
                      </div>
                    </div>
                    
                    {!canAccess && (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {update.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(update.updateType)}`}>
                      {update.updateType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(update.priority)}`}>
                      {update.priority}
                    </span>
                  </div>

                  {/* Allowed Roles */}
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div className="flex gap-1">
                      {update.allowedRoles.map((role) => (
                        <span
                          key={role}
                          className={`px-2 py-1 rounded-full text-xs ${
                            role === user.role
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Issue Description */}
                  {update.issueDescription && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          {update.issueDescription}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDate(update.createdAt)}
                    </div>
                    
                    {canAccess ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Visit Page
                      </motion.div>
                    ) : (
                      <div className="flex items-center gap-1 text-gray-400 text-sm">
                        <Lock className="w-4 h-4" />
                        Access Restricted
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {updates.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Updates Found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterType || filterPriority
                ? 'Try adjusting your search or filter criteria'
                : 'No updates are available at the moment'}
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mt-8"
          >
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!pagination.hasPrev}
                onClick={() => setCurrentPage(currentPage - 1)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  pagination.hasPrev
                    ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Previous
              </motion.button>

              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  {page}
                </motion.button>
              ))}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!pagination.hasNext}
                onClick={() => setCurrentPage(currentPage + 1)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  pagination.hasNext
                    ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Updates Info */}
        {pagination && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-4 text-sm text-gray-500"
          >
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalUpdates)} of {pagination.totalUpdates} updates
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpdatesPage;