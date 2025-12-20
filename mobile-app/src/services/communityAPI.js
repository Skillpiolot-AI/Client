// Community API endpoints
import api from './api';

export const communityAPI = {
    // Get community posts
    getPosts: async (params = {}) => {
        const response = await api.get('/community/posts', { params });
        return response.data;
    },

    // Create post
    createPost: async (postData) => {
        const response = await api.post('/community/posts', postData);
        return response.data;
    },

    // Like post
    likePost: async (postId) => {
        const response = await api.post(`/community/posts/${postId}/like`);
        return response.data;
    },

    // Comment on post
    addComment: async (postId, comment) => {
        const response = await api.post(`/community/posts/${postId}/comments`, { content: comment });
        return response.data;
    },

    // Delete post
    deletePost: async (postId) => {
        const response = await api.delete(`/community/posts/${postId}`);
        return response.data;
    },
};

export default communityAPI;
