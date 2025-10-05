import axios from 'axios';

const API_URL = import.meta.env.PROD 
  ? '/api'  // Same domain in production
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// User APIs
export const userAPI = {
  updateProfile: (data) => api.put('/user/profile', data),
  getProfile: () => api.get('/user/profile'),
  addProgress: (data) => api.post('/user/progress', data),
  getProgress: () => api.get('/user/progress'),
  getStats: () => api.get('/user/progress/stats')
};

// Workout APIs
export const workoutAPI = {
  generate: (data) => api.post('/workout/generate', data),
  getHistory: () => api.get('/workout/history'),
  complete: (id, data) => api.put(`/workout/complete/${id}`, data)
};

// Diet APIs
export const dietAPI = {
  generate: (data) => api.post('/diet/generate', data),
  getHistory: () => api.get('/diet/history'),
  logMeal: (data) => api.post('/diet/log', data)
};

export default api;