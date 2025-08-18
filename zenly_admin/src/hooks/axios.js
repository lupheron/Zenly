import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
    timeout: 10000,
    headers: {
        'Accept': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('remember_token');
        const adminId = localStorage.getItem('admin_id');
        
        if (token && adminId) {
            config.headers.Authorization = `Bearer ${token}`;
            // Add admin identifier if needed
            config.headers['X-Admin-ID'] = adminId;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Clear invalid tokens
            localStorage.removeItem('remember_token');
            localStorage.removeItem('admin_id');
            // Redirect to login if needed
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
