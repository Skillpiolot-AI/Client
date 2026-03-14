// Resources & Education API endpoints
import api from './api';

export const resourcesAPI = {
    // Videos
    getVideos: async (params = {}) => {
        const response = await api.get('/videos', { params });
        return response.data;
    },

    getVideoById: async (videoId) => {
        const response = await api.get(`/videos/${videoId}`);
        return response.data;
    },

    addVideo: async (videoData) => {
        const response = await api.post('/videos', videoData);
        return response.data;
    },

    // Resources/Books
    getResources: async (params = {}) => {
        const response = await api.get('/resources', { params });
        return response.data;
    },

    addResource: async (resourceData) => {
        const response = await api.post('/resources', resourceData);
        return response.data;
    },

    // Workshops
    getWorkshops: async () => {
        const response = await api.get('/workshops');
        return response.data;
    },

    getWorkshopById: async (workshopId) => {
        const response = await api.get(`/workshops/${workshopId}`);
        return response.data;
    },

    registerForWorkshop: async (workshopId) => {
        const response = await api.post(`/workshops/${workshopId}/register`);
        return response.data;
    },

    addWorkshop: async (workshopData) => {
        const response = await api.post('/workshops', workshopData);
        return response.data;
    },

    // Colleges
    getColleges: async (params = {}) => {
        const response = await api.get('/colleges', { params });
        return response.data;
    },

    getCollegeById: async (collegeId) => {
        const response = await api.get(`/colleges/${collegeId}`);
        return response.data;
    },
};

export default resourcesAPI;
