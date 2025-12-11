// services/api.js
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ----------------------------
// Request Interceptor
// ----------------------------
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------
// Response Interceptor
// ----------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Unauthorized: clear user and redirect to login
    if (status === 401) {
      localStorage.removeItem('user');
      toast.error('Session expired. Please log in again.');
      window.location.href = '/login';
    }

    // Optional: handle other status codes globally
    else if (status >= 400 && status < 500) {
      const msg = error.response?.data?.error || 'Client Error';
      toast.error(msg);
    } else if (status >= 500) {
      toast.error('Server error. Please try again later.');
    }

    return Promise.reject(error);
  }
);

export default api;
