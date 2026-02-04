import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

console.log('🔧 API Configuration:');
console.log('   Base URL:', API_BASE);
console.log('   Environment var VITE_API_URL:', import.meta.env.VITE_API_URL);

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
apiClient.interceptors.request.use((config) => {
  console.log('📤 API Request:', config.method?.toUpperCase(), config.url, {
    headers: config.headers,
    data: config.data
  });
  return config;
}, (error) => {
  console.error('❌ Request error:', error);
  return Promise.reject(error);
});

// Add response interceptor for logging
apiClient.interceptors.response.use((response) => {
  console.log('📥 API Response:', response.status, response.config.url, response.data);
  return response;
}, (error) => {
  console.error('❌ Response error:', error.config?.url, error.response?.status, error.message, error.response?.data);
  return Promise.reject(error);
});

// Set auth token from Clerk
export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔐 Auth token set');
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    console.log('🔓 Auth token cleared');
  }
};

// API endpoints
export const api = {
  // Posts
  getPosts: (page = 1) => apiClient.get(`/posts/?page=${page}`),
  getPost: (id: number) => apiClient.get(`/posts/${id}/`),
  createPost: (data: { title: string; content: string }) =>
    apiClient.post('/posts/', data),
  updatePost: (id: number, data: { title: string; content: string }) =>
    apiClient.put(`/posts/${id}/`, data),
  deletePost: (id: number) => apiClient.delete(`/posts/${id}/`),
  likePost: (id: number) => apiClient.post(`/posts/${id}/like/`),
  unlikePost: (id: number) => apiClient.post(`/posts/${id}/unlike/`),

  // Comments
  getComments: (page = 1) => apiClient.get(`/comments/?page=${page}`),
  getComment: (id: number) => apiClient.get(`/comments/${id}/`),
  createComment: (data: { post: number; content: string }) =>
    apiClient.post('/comments/', data),
  updateComment: (id: number, data: { content: string }) =>
    apiClient.put(`/comments/${id}/`, data),
  deleteComment: (id: number) => apiClient.delete(`/comments/${id}/`),
  likeComment: (id: number) => apiClient.post(`/comments/${id}/like/`),
  unlikeComment: (id: number) => apiClient.post(`/comments/${id}/unlike/`),

  // Users
  getUsers: (page = 1) => apiClient.get(`/users/?page=${page}`),
  getUser: (id: number) => apiClient.get(`/users/${id}/`),

  // Health check
  healthCheck: () => apiClient.get('/'),
};
