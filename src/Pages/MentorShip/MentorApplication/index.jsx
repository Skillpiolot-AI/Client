import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Search,
    Filter,
    RefreshCw,
    Users,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    ChevronDown
} from 'lucide-react';
import config from '../../../config';
import ApplicationCard from './ApplicationCard';
import ApplicationDetailModal from './ApplicationDetailModal';
import './styles.css';

const MentorApplicationPage = () => {
    // State
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [stats, setStats] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('submittedAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState(null);

    const STATUS_OPTIONS = [
        { value: 'all', label: 'All Status', icon: BarChart3, color: 'text-gray-600' },
        { value: 'Pending', label: 'Pending', icon: Clock, color: 'text-yellow-600' },
        { value: 'Under Review', label: 'Under Review', icon: AlertCircle, color: 'text-blue-600' },
        { value: 'Approved', label: 'Approved', icon: CheckCircle, color: 'text-green-600' },
        { value: 'Rejected', label: 'Rejected', icon: XCircle, color: 'text-red-600' },
        { value: 'More Info Requested', label: 'More Info', icon: AlertCircle, color: 'text-purple-600' }
    ];

    useEffect(() => {
        fetchApplications();
        fetchStats();
    }, [statusFilter, sortBy, sortOrder, currentPage]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: currentPage,
                limit: 12,
                sortBy,
                sortOrder
            });

            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const response = await axios.get(
                `${config.API_BASE_URL}/applications/admin/applications?${params}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            setApplications(response.data.applications || response.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');

            // Fallback to old API if admin endpoint fails
            try {
                const fallbackResponse = await axios.get(`${config.API_BASE_URL}/applications`);
                setApplications(fallbackResponse.data);
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axios.get(
                `${config.API_BASE_URL}/applications/admin/stats`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setStats(response.data.applications);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleCardClick = async (application) => {
        try {
            // Fetch full application details
            const response = await axios.get(
                `${config.API_BASE_URL}/applications/admin/applications/${application._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setSelectedApplication(response.data);
        } catch (error) {
            // Use existing data if detailed fetch fails
            setSelectedApplication(application);
        }
        setIsModalOpen(true);
    };

    const handleApprove = async (applicationId, adminNotes) => {
        try {
            setIsProcessing(true);
            await axios.put(
                `${config.API_BASE_URL}/applications/admin/applications/${applicationId}/approve`,
                { adminNotes },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            toast.success('Application approved successfully!');
            setIsModalOpen(false);
            fetchApplications();
            fetchStats();
        } catch (error) {
            console.error('Error approving application:', error);
            toast.error(error.response?.data?.error || 'Failed to approve application');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (applicationId, rejectionReason, adminNotes) => {
        try {
            setIsProcessing(true);
            await axios.put(
                `${config.API_BASE_URL}/applications/admin/applications/${applicationId}/reject`,
                { rejectionReason, adminNotes },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            toast.success('Application rejected');
            setIsModalOpen(false);
            fetchApplications();
            fetchStats();
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error(error.response?.data?.error || 'Failed to reject application');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRequestInfo = async (applicationId, requestDetails) => {
        try {
            setIsProcessing(true);
            await axios.put(
                `${config.API_BASE_URL}/applications/admin/applications/${applicationId}/request-info`,
                { requestDetails },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            toast.success('Information request sent to applicant');
            setIsModalOpen(false);
            fetchApplications();
            fetchStats();
        } catch (error) {
            console.error('Error requesting info:', error);
            toast.error(error.response?.data?.error || 'Failed to send request');
        } finally {
            setIsProcessing(false);
        }
    };

    // Filter applications by search term (client-side)
    const filteredApplications = applications.filter(app => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            app.name?.toLowerCase().includes(term) ||
            app.email?.toLowerCase().includes(term) ||
            app.jobTitle?.toLowerCase().includes(term) ||
            app.trackingId?.toLowerCase().includes(term)
        );
    });

    // Stats Card Component
    const StatCard = ({ icon: Icon, label, value, color, bgColor }) => (
        <div className={`${bgColor} rounded-2xl p-5 border border-white/50 shadow-sm 
      hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${color} bg-white/80 
          flex items-center justify-center shadow-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <div className="text-2xl font-bold text-gray-800">{value}</div>
                    <div className="text-sm text-gray-600">{label}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
            {/* Header */}
            <div className="bg-white/70 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Mentor Applications
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Review and manage mentor applications
                            </p>
                        </div>
                        <button
                            onClick={() => { fetchApplications(); fetchStats(); }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 text-indigo-600 
                rounded-xl hover:bg-indigo-100 transition-colors font-medium self-start lg:self-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            icon={Users}
                            label="Total Applications"
                            value={stats.total || 0}
                            color="text-indigo-600"
                            bgColor="bg-gradient-to-br from-indigo-50 to-indigo-100/50"
                        />
                        <StatCard
                            icon={Clock}
                            label="Pending"
                            value={stats.pending || 0}
                            color="text-yellow-600"
                            bgColor="bg-gradient-to-br from-yellow-50 to-amber-100/50"
                        />
                        <StatCard
                            icon={CheckCircle}
                            label="Approved"
                            value={stats.approved || 0}
                            color="text-green-600"
                            bgColor="bg-gradient-to-br from-green-50 to-emerald-100/50"
                        />
                        <StatCard
                            icon={XCircle}
                            label="Rejected"
                            value={stats.rejected || 0}
                            color="text-red-600"
                            bgColor="bg-gradient-to-br from-red-50 to-rose-100/50"
                        />
                    </div>
                )}

                {/* Filters Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4 items-center">
                        {/* Search */}
                        <div className="relative flex-1 w-full lg:max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, role, or tracking ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl 
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  placeholder:text-gray-400"
                            />
                        </div>

                        {/* Status Filter */}
                        <div className="relative w-full lg:w-auto">
                            <select
                                value={statusFilter}
                                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                                className="w-full lg:w-48 px-4 py-3 border border-gray-200 rounded-xl 
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  appearance-none bg-white pr-10 font-medium text-gray-700"
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>

                        {/* Sort */}
                        <div className="relative w-full lg:w-auto">
                            <select
                                value={`${sortBy}-${sortOrder}`}
                                onChange={(e) => {
                                    const [field, order] = e.target.value.split('-');
                                    setSortBy(field);
                                    setSortOrder(order);
                                }}
                                className="w-full lg:w-48 px-4 py-3 border border-gray-200 rounded-xl 
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  appearance-none bg-white pr-10 font-medium text-gray-700"
                            >
                                <option value="submittedAt-desc">Newest First</option>
                                <option value="submittedAt-asc">Oldest First</option>
                                <option value="name-asc">Name A-Z</option>
                                <option value="name-desc">Name Z-A</option>
                                <option value="experience-desc">Most Experienced</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 
                text-gray-400 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                <div className="h-24 skeleton" />
                                <div className="p-5 space-y-3">
                                    <div className="w-20 h-20 rounded-2xl skeleton -mt-16 ml-0" />
                                    <div className="h-6 skeleton rounded w-3/4 mt-4" />
                                    <div className="h-4 skeleton rounded w-1/2" />
                                    <div className="flex gap-2 mt-4">
                                        <div className="h-6 skeleton rounded-full w-16" />
                                        <div className="h-6 skeleton rounded-full w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No applications found</h3>
                        <p className="text-gray-600">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'No mentor applications have been submitted yet'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Showing <span className="font-semibold text-gray-900">{filteredApplications.length}</span> application{filteredApplications.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Applications Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredApplications.map((application) => (
                                <ApplicationCard
                                    key={application._id}
                                    application={application}
                                    onClick={() => handleCardClick(application)}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.pages > 1 && (
                            <div className="flex justify-center items-center gap-2 mt-8">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 
                    disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-gray-600">
                                    Page {currentPage} of {pagination.pages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
                                    disabled={currentPage === pagination.pages}
                                    className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 
                    disabled:opacity-50 disabled:cursor-not-allowed font-medium text-gray-700"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Detail Modal */}
            {isModalOpen && selectedApplication && (
                <ApplicationDetailModal
                    application={selectedApplication}
                    onClose={() => { setIsModalOpen(false); setSelectedApplication(null); }}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onRequestInfo={handleRequestInfo}
                    isProcessing={isProcessing}
                />
            )}

            <ToastContainer
                position="bottom-right"
                autoClose={4000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    );
};

export default MentorApplicationPage;
