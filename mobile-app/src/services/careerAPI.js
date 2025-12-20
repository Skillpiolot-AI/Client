// Career Tools API endpoints
import api from './api';

export const careerAPI = {
    // Career Quiz
    submitQuiz: async (quizData) => {
        const response = await api.post('/career-quiz', quizData);
        return response.data;
    },

    // Get quiz results
    getQuizResults: async () => {
        const response = await api.get('/career-quiz/results');
        return response.data;
    },

    // Get recommendations
    getRecommendations: async () => {
        const response = await api.get('/recommendations');
        return response.data;
    },

    // Get job titles
    getJobTitles: async (searchTerm = '') => {
        const response = await api.get('/job-titles', { params: { search: searchTerm } });
        return response.data;
    },

    // Get job details
    getJobDetails: async (jobTitle) => {
        const response = await api.get(`/job-details/${encodeURIComponent(jobTitle)}`);
        return response.data;
    },

    // Get roadmap
    getRoadmap: async (career) => {
        const response = await api.get(`/roadmap/${career}`);
        return response.data;
    },

    // Career form submission
    submitCareerForm: async (formData) => {
        const response = await api.post('/career-form', formData);
        return response.data;
    },

    // Get career prediction
    getCareerPrediction: async (data) => {
        const response = await api.post('/career-prediction', data);
        return response.data;
    },
};

export default careerAPI;
