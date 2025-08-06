import { create } from "zustand";
import api from "../axios";
import React from "react";

export const useCommentsStore = create((set, get) => ({
    comments: [],
    loading: false,
    error: null,

    getCommentsByUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/admin/comments/user/${userId}`);
            if (res.data.status === 200 && res.data.data) {
                set({ comments: res.data.data, loading: false });
            } else {
                set({ error: "Failed to fetch comments", loading: false });
            }
        } catch (err) {
            set({ error: err.message || "An error occurred", loading: false });
        }
    },

    getComments: async (postId) => {
        set({ loading: true, error: null });
        try {
            console.log('Fetching comments for post:', postId); // Debug log
            const response = await api.get(`/admin/comments/${postId}`);
            console.log('Comments response:', response.data); // Debug log

            // Handle both response formats
            if (response.data.status === 200 && response.data.data) {
                // New format with wrapper
                set({ comments: response.data.data, loading: false });
            } else if (Array.isArray(response.data)) {
                // Old format - direct array
                set({ comments: response.data, loading: false });
            } else {
                set({ comments: [], loading: false });
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            set({ error: error.message || 'An error occurred', loading: false, comments: [] });
        }
    },

    clearComments: () => {
        set({ comments: [], error: null });
    }
}));

// Custom hook for component use
export const useComments = (postId) => {
    const { comments, loading: commentsLoading, error, getComments, clearComments } = useCommentsStore();

    React.useEffect(() => {
        if (postId) {
            getComments(postId);
        }
        return () => clearComments();
    }, [postId, getComments, clearComments]);

    return { comments, commentsLoading, error };
};