import { create } from "zustand";
import api from "../axios";

export const usePosts = create((set, get) => ({
    posts: [],
    userPosts: [],
    loading: false,
    error: null,

    // Get posts for a specific user (new method)
    getUserPosts: async (userId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/admin/posts/user/${userId}`);
            if (response.data.status === 200 && response.data.data) {
                set({ userPosts: response.data.data, loading: false });
            } else {
                set({ error: 'Failed to fetch user posts', loading: false });
                console.error('Failed to fetch user posts:', response.data.message);
            }
        } catch (error) {
            set({ error: error.message || 'An error occurred', loading: false });
            console.error('Error fetching user posts:', error);
        }
    },

    // Clear user posts
    clearUserPosts: () => {
        set({ userPosts: [], error: null });
    },

}));