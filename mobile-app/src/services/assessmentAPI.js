// Assessment API endpoints
import api from './api';

export const assessmentAPI = {
    // Get available assessments
    getAssessments: async () => {
        const response = await api.get('/assessments');
        return response.data;
    },

    // Get assessment by ID
    getAssessmentById: async (assessmentId) => {
        const response = await api.get(`/assessments/${assessmentId}`);
        return response.data;
    },

    // Start assessment
    startAssessment: async (assessmentId) => {
        const response = await api.post(`/assessments/${assessmentId}/start`);
        return response.data;
    },

    // Submit assessment answers
    submitAssessment: async (assessmentId, answers) => {
        const response = await api.post(`/assessments/${assessmentId}/submit`, { answers });
        return response.data;
    },

    // Get assessment results
    getAssessmentResults: async (assessmentId) => {
        const response = await api.get(`/assessments/${assessmentId}/results`);
        return response.data;
    },

    // Get user's assessment history
    getAssessmentHistory: async () => {
        const response = await api.get('/assessments/history');
        return response.data;
    },
};

export default assessmentAPI;
