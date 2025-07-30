import { create } from "zustand";
import api from "../axios";

const useLoginStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,

    setFormData: (data) => set({ formData: data }),

    clearError: () => set({ error: null }),

    getAdmin: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get('/admin/me');
            if (res.data.success && res.data.data) {
                set({ 
                    user: res.data.data, 
                    isAuthenticated: true,
                    loading: false 
                });
                return res.data.data;
            } else {
                set({ 
                    error: res.data.message || 'Failed to get admin data',
                    loading: false 
                });
                return null;
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to get admin data';
            set({ 
                error: errorMessage,
                loading: false,
                isAuthenticated: false 
            });
            return null;
        }
    },

    handleLogin: async (values) => {
        set({ loading: true, error: null });
        try {
            const res = await api.post('/admin/login', values);
            if (res.data.success && res.data.data?.token) {
                // Store token
                localStorage.setItem('remember_token', res.data.data.token);
                localStorage.setItem('admin_id', res.data.data.admin.id);
                
                // Set user data
                set({ 
                    user: res.data.data.admin,
                    isAuthenticated: true,
                    loading: false,
                    error: null
                });
                
                return { success: true, data: res.data.data };
            } else {
                set({ 
                    error: res.data.message || 'Login failed',
                    loading: false 
                });
                return { success: false, error: res.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
            set({ 
                error: errorMessage,
                loading: false 
            });
            return { success: false, error: errorMessage };
        }
    },

    logout: async () => {
        set({ loading: true });
        try {
            await api.post('/admin/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local storage
            localStorage.removeItem('remember_token');
            localStorage.removeItem('admin_id');
            
            // Reset state
            set({ 
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null
            });
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('remember_token');
        if (!token) {
            set({ isAuthenticated: false });
            return false;
        }
        
        return await get().getAdmin();
    }
}));

export default useLoginStore;