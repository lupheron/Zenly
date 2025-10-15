import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://api.zenly.uz/api',
    timeout: 15000,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Don't add auth headers to login/register requests
        const isAuthEndpoint = config.url?.includes('/login') || config.url?.includes('/register');
        
        if (!isAuthEndpoint) {
            const token = localStorage.getItem('remember_token');
            const adminId = localStorage.getItem('admin_id');
            
            if (token && adminId) {
                config.headers.Authorization = `Bearer ${token}`;
                config.headers['X-Admin-ID'] = adminId;
            }
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
        // Only handle 401/403 errors for protected routes
        if (error.response?.status === 401 || error.response?.status === 403) {
            const isLoginPage = window.location.pathname === '/login';
            const isLoginRequest = error.config?.url?.includes('/login');
            
            // Don't redirect if we're already on login page or this is a login request
            if (!isLoginPage && !isLoginRequest) {
                // Clear invalid tokens
                localStorage.removeItem('remember_token');
                localStorage.removeItem('admin_id');
                // Redirect to login
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
