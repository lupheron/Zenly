import { create } from "zustand";
import api from "../axios";
import React from "react";

export const usePostViewsStore = create((set, get) => ({
    totalViews: 0,
    loading: false,
    error: null,

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
            // Refresh views count after incrementing
            get().getPostViews(postId);
        } catch (error) {
            console.error('Error incrementing post view:', error);
        }
    }
}));

// Custom hook for component use
export const usePostViews = (postId) => {
    const { totalViews, loading, error, getPostViews, incrementPostView } = usePostViewsStore();

    React.useEffect(() => {
        if (postId) {
            getPostViews(postId);
        }
    }, [postId, getPostViews]);

    return { totalViews, loading, error, incrementPostView };
};