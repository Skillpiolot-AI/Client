// Admin API endpoints
import api from './api';

export const adminAPI = {
    // Dashboard stats
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    // Analytics
    getAnalytics: async (params = {}) => {
        const response = await api.get('/admin/analytics', { params });
        return response.data;
    },

    // User management
    getUsers: async (params = {}) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    updateUserRole: async (userId, role) => {
        const response = await api.put(`/admin/users/${userId}/role`, { role });
        return response.data;
    },

    deleteUser: async (userId) => {
        const response = await api.delete(`/admin/users/${userId}`);
        return response.data;
    },

    // Job titles management
    addJobTitle: async (jobData) => {
        const response = await api.post('/admin/job-titles', jobData);
        return response.data;
    },

    updateJobTitle: async (jobId, jobData) => {
        const response = await api.put(`/admin/job-titles/${jobId}`, jobData);
        return response.data;
    },

    deleteJobTitle: async (jobId) => {
        const response = await api.delete(`/admin/job-titles/${jobId}`);
        return response.data;
    },

    // Companies management
    getCompanies: async () => {
        const response = await api.get('/admin/companies');
        return response.data;
    },

    addCompany: async (companyData) => {
        const response = await api.post('/admin/companies', companyData);
        return response.data;
    },

    // Skills management
    getSkills: async () => {
        const response = await api.get('/admin/skills');
        return response.data;
    },

    addSkill: async (skillData) => {
        const response = await api.post('/admin/skills', skillData);
        return response.data;
    },

    // Colleges management
    getColleges: async () => {
        const response = await api.get('/admin/colleges');
        return response.data;
    },

    addCollege: async (collegeData) => {
        const response = await api.post('/admin/colleges', collegeData);
        return response.data;
    },

    // System settings
    getSystemSettings: async () => {
        const response = await api.get('/admin/settings');
        return response.data;
    },

    updateSystemSettings: async (settings) => {
        const response = await api.put('/admin/settings', settings);
        return response.data;
    },

    // Updates management
    getUpdates: async () => {
        const response = await api.get('/updates');
        return response.data;
    },

    createUpdate: async (updateData) => {
        const response = await api.post('/admin/updates', updateData);
        return response.data;
    },

    deleteUpdate: async (updateId) => {
        const response = await api.delete(`/admin/updates/${updateId}`);
        return response.data;
    },
};

export default adminAPI;
