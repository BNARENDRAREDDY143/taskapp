import axios from 'axios';

// Automatically detect backend URL with production fallback to your Render server
const DEFAULT_URL = import.meta.env.DEV
  ? 'http://localhost:5000/api'
  : 'https://taskapp-2-m430.onrender.com/api';

const RAW_URL = import.meta.env.VITE_API_URL || DEFAULT_URL;
const API_URL = RAW_URL.endsWith('/api') ? RAW_URL : `${RAW_URL.replace(/\/+$/, '')}/api`;

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add JWT Bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taskflow_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated sessions
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on 401 if not logging in
      if (!error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        localStorage.removeItem('taskflow_token');
        localStorage.removeItem('taskflow_user');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
