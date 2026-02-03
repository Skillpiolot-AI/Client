import axios from 'axios';
import config from '../../config/config';

const API_URL = config.API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const questionAPI = {
  getAll: async () => {
    const response = await apiClient.get('/questions');
    return response.data;
  },
};

export const assessmentAPI = {
  create: async (data) => {
    const response = await apiClient.post('/assessments', data);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(`/assessments/${id}`);
    return response.data;
  },

  getUserAssessments: async (userId) => {
    const response = await apiClient.get(`/assessments/user/${userId}`);
    return response.data;
  },

  // Get authenticated user's assessment history with trends
  getMyHistory: async () => {
    const response = await apiClient.get('/assessments/me/history');
    return response.data;
  },
};

export const careerAPI = {
  getRecommendations: async (hollandCode, limit = 15) => {
    const response = await apiClient.get('/careers/recommendations', {
      params: { hollandCode, limit }
    });
    return response.data;
  },

  getAllClusters: async () => {
    const response = await apiClient.get('/careers/clusters');
    return response.data;
  },

  getByCluster: async (cluster, page = 1, limit = 20) => {
    const response = await apiClient.get(`/careers/cluster/${cluster}`, {
      params: { page, limit }
    });
    return response.data;
  },
};

export default apiClient;