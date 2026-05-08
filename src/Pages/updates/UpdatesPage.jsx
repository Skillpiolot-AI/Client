import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../AuthContext';
import config from '../../config';
import {
  Clock,
  Users,
  ExternalLink,
  AlertCircle,
  Star,
  Search,
  RefreshCw,
  Lock,
  CheckCircle,
  Bug,
  Zap,
  Shield,
  Palette,
  Plus,
  X,
  ChevronRight,
} from 'lucide-react';

// ─── Detail Modal ────────────────────────────────────────────────────────────
const UpdateDetailModal = ({ update, user, onClose, getTypeColor, getPriorityColor, getUpdateIcon, formatDate }) => {
  const canAccess = update.allowedRoles.includes(user?.role);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 24 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`p-3 rounded-xl flex-shrink-0 ${getTypeColor(update.updateType)}`}>
                {getUpdateIcon(update.updateType)}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">{update.title}</h2>
                <span className="text-sm text-gray-500">v{update.version}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-5">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(update.updateType)}`}>
                {update.updateType}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(update.priority)}`}>
                {update.priority} Priority
              </span>
            </div>

            {/* Full Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-gray-700 text-base leading-relaxed">{update.description}</p>
            </div>

            {/* Issue / Context */}
            {update.issueDescription && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">Issue / Context</p>
                    <p className="text-sm text-amber-800 leading-relaxed">{update.issueDescription}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Roles */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Available To</h3>
              <div className="flex gap-2 flex-wrap">
                {update.allowedRoles.map((role) => (
                  <span
                    key={role}
                    className={`px-3 py-1 rounded-full text-sm ${
                      role === user?.role
                        ? 'bg-blue-100 text-blue-700 border border-blue-200 font-semibold'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Released on {formatDate(update.createdAt)}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 pb-6 flex items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            {canAccess ? (
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                href={update.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Page
              </motion.a>
            ) : (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Lock className="w-4 h-4" />
                Access Restricted
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
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
  const [selectedUpdate, setSelectedUpdate] = useState(null);

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

      const queryParams = new URLSearchParams({ page: currentPage.toString(), limit: '10' });
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterType) queryParams.append('updateType', filterType);
      if (filterPriority) queryParams.append('priority', filterPriority);

      const endpoint =
        user?.role === 'Admin'
          ? `${config.API_BASE_URL}/updates/admin?${queryParams}`
          : `${config.API_BASE_URL}/updates?${queryParams}`;

      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
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

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'Feature':     return <Star className="w-5 h-5" />;
      case 'Bug Fix':     return <Bug className="w-5 h-5" />;
      case 'Enhancement': return <Zap className="w-5 h-5" />;
      case 'Security':    return <Shield className="w-5 h-5" />;
      case 'UI/UX':       return <Palette className="w-5 h-5" />;
      default:            return <CheckCircle className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High':     return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium':   return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Low':      return 'text-green-600 bg-green-50 border-green-200';
      default:         return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Feature':     return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Bug Fix':     return 'text-red-600 bg-red-50 border-red-200';
      case 'Enhancement': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Security':    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'UI/UX':       return 'text-pink-600 bg-pink-50 border-pink-200';
      default:            return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const sharedModalProps = { user, getTypeColor, getPriorityColor, getUpdateIcon, formatDate };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Detail Modal */}
      {selectedUpdate && (
        <UpdateDetailModal
          update={selectedUpdate}
          onClose={() => setSelectedUpdate(null)}
          {...sharedModalProps}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Latest Updates</h1>
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

            <div className="flex gap-4 flex-wrap">
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
                  onClick={() => (window.location.href = '/admin/updates')}
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
              const canAccess = update.allowedRoles.includes(user?.role);

              return (
                <motion.div
                  key={update._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl cursor-pointer group ${
                    !canAccess ? 'opacity-75' : ''
                  }`}
                  onClick={() => setSelectedUpdate(update)}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getTypeColor(update.updateType)}`}>
                        {getUpdateIcon(update.updateType)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {update.title}
                        </h3>
                        <p className="text-sm text-gray-500">v{update.version}</p>
                      </div>
                    </div>
                    {!canAccess && <Lock className="w-5 h-5 text-gray-400 flex-shrink-0" />}
                  </div>

                  {/* Description — truncated, click to expand */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{update.description}</p>

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
                    <div className="flex gap-1 flex-wrap">
                      {update.allowedRoles.map((role) => (
                        <span
                          key={role}
                          className={`px-2 py-1 rounded-full text-xs ${
                            role === user?.role
                              ? 'bg-blue-100 text-blue-700 border border-blue-200'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Issue Description indicator */}
                  {update.issueDescription && (
                    <div className="flex items-center gap-1 text-amber-600 text-xs mb-3">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Includes issue context</span>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {formatDate(update.createdAt)}
                    </div>

                    <div className="flex items-center gap-1 text-blue-600 text-sm font-medium group-hover:gap-2 transition-all">
                      <span>Read more</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {updates.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Updates Found</h3>
            <p className="text-gray-600">
              {searchTerm || filterType || filterPriority
                ? 'Try adjusting your search or filter criteria'
                : 'No updates are available at the moment'}
            </p>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-8">
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

        {pagination && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-4 text-sm text-gray-500">
            Showing {(currentPage - 1) * 10 + 1} to{' '}
            {Math.min(currentPage * 10, pagination.totalUpdates)} of {pagination.totalUpdates} updates
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UpdatesPage;