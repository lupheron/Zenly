import { create } from "zustand";
import api from "../axios";

// hooks/PostViews/usePostViews.js
export const usePostViewsStore = create((set, get) => ({
    totalViews: 0,
    loading: false,
    error: null,
    views: [],

    getViewsByUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/admin/views/user/${userId}`);
            if (res.data.status === 200 && res.data.data) {
                set({ views: res.data.data, loading: false });
            } else {
                set({ error: "Failed to fetch views", loading: false });
            }
        } catch (err) {
            set({ error: err.message || "An error occurred", loading: false });
        }
    },

    clearViews: () => {
        set({ views: [], error: null });
    },

    deleteView: async (id) => {
        try {
            const res = await api.delete(`/admin/views/${id}`);
            if (res.status === 200) {
                set((state) => ({
                    views: state.views.filter((v) => v.id !== id)
                }));
                return res.data;
            } else {
                throw new Error(res.data.message || "Failed to delete view");
            }
        } catch (error) {
            console.error("Delete view error:", error);
            throw error;
        }
    },

    updateView: async (id, data) => {
        try {
            const res = await api.put(`/admin/views/${id}`, data);
            if (res.status === 200) {
                set((state) => ({
                    views: state.views.map(r =>
                        r.id === id ? { ...r, ...data } : r
                    )
                }));
                return res.data;
            } else {
                throw new Error(res.data.message || "Failed to update clicked");
            }
        } catch (error) {
            console.error("Update clicked error:", error);
            throw error;
        }
    },

    getPostViews: async (postId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/admin/post-views/${postId}`);
            if (response.data.status === 200) {
                set({ totalViews: response.data.data.total_views || 0, loading: false });
            } else {
                set({ totalViews: 0, loading: false });
            }
        } catch (error) {
            set({ error: error.message || 'An error occurred', loading: false, totalViews: 0 });
        }
    },

    incrementPostView: async (postId) => {
        try {
            await api.post(`/admin/post-views/${postId}`);
            get().getPostViews(postId);
        } catch (error) {
            console.error('Error incrementing post view:', error);
        }
    }
}));
