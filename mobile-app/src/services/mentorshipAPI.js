// Mentorship API endpoints - Fixed to match backend routes
import api from './api';

export const mentorshipAPI = {
    // ========================================
    // MENTOR ROUTES (under /api/mentors)
    // ========================================

    // Get all mentors (public list)
    getMentors: async (params = {}) => {
        // Use /all-mentors endpoint which returns all verified mentors
        const response = await api.get('/all-mentors', { params });
        return response.data;
    },

    // Get mentor by ID
    getMentorById: async (mentorId) => {
        const response = await api.get(`/mentors/${mentorId}`);
        return response.data;
    },

    // ========================================
    // BOOKING ROUTES (under /api/bookings)
    // ========================================

    // Book a session - POST /api/bookings/book
    bookSession: async (bookingData) => {
        // bookingData should include: mentorProfileId, scheduledAt, duration, remark, topics
        const response = await api.post('/bookings/book', bookingData);
        return response.data;
    },

    // Get user's bookings - GET /api/bookings/my-bookings
    getMyBookings: async (params = {}) => {
        const response = await api.get('/bookings/my-bookings', { params });
        return response.data;
    },

    // Get booking details - GET /api/bookings/:bookingId
    getBookingById: async (bookingId) => {
        const response = await api.get(`/bookings/${bookingId}`);
        return response.data;
    },

    // Cancel booking - PUT /api/bookings/:bookingId/cancel
    cancelBooking: async (bookingId, reason = '') => {
        const response = await api.put(`/bookings/${bookingId}/cancel`, { reason });
        return response.data;
    },

    // Submit rating - POST /api/bookings/:bookingId/rate
    submitRating: async (bookingId, score, comment = '') => {
        const response = await api.post(`/bookings/${bookingId}/rate`, { score, comment });
        return response.data;
    },

    // ========================================
    // MENTOR PROFILE ROUTES
    // ========================================

    // Get mentor's sessions (for mentors)
    getMentorSessions: async (params = {}) => {
        const response = await api.get('/bookings/mentor/sessions', { params });
        return response.data;
    },

    // Submit mentor application
    submitMentorApplication: async (applicationData) => {
        const response = await api.post('/mentor-application', applicationData);
        return response.data;
    },

    // Get application status
    getApplicationStatus: async () => {
        const response = await api.get('/mentor-application/status');
        return response.data;
    },

    // Submit feedback
    submitFeedback: async (feedbackData) => {
        const response = await api.post('/mentor-feedback', feedbackData);
        return response.data;
    },

    // ========================================
    // ADMIN ROUTES
    // ========================================

    // Get mentor applications (admin)
    getMentorApplications: async () => {
        const response = await api.get('/admin/mentor-applications');
        return response.data;
    },

    // Approve/Reject application (admin)
    updateApplicationStatus: async (applicationId, status, reason) => {
        const response = await api.put(`/admin/mentor-applications/${applicationId}`, { status, reason });
        return response.data;
    },

    // Get system settings (for checking if mentorship is free)
    getSystemSettings: async () => {
        const response = await api.get('/bookings/admin/settings');
        return response.data;
    },
};

export default mentorshipAPI;
