// Assessment API endpoints
import api from './api';

export const assessmentAPI = {
    // Get available assessments list
    getAssessments: async () => {
        const response = await api.get('/assessments');
        return response.data;
    },

    // Get assessment by ID
    getAssessmentById: async (assessmentId) => {
        const response = await api.get(`/assessments/${assessmentId}`);
        return response.data;
    },

    // Submit RIASEC Holland assessment answers → POST /assessments
    // answers: { R1: 3, R2: 5, I1: 4, ... }
    submitRiasec: async (userId, answers) => {
        const response = await api.post('/assessments', { userId, answers });
        return response.data;
    },

    // Get authenticated user's RIASEC history with trends → GET /assessments/me/history
    getMyHistory: async () => {
        const response = await api.get('/assessments/me/history');
        return response.data;
    },

    // Legacy: get by userId string
    getUserAssessments: async (userId) => {
        const response = await api.get(`/assessments/user/${userId}`);
        return response.data;
    },
};

export default assessmentAPI;
