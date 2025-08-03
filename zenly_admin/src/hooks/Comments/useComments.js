import { create } from "zustand";
import api from "../axios";
import React from "react";

export const useCommentsStore = create((set, get) => ({
    comments: [],
    loading: false,
    error: null,

    getComments: async (postId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/admin/comments/${postId}`);
            if (response.data.status === 200 && response.data.data) {
                set({ comments: response.data.data, loading: false });
            } else {
                set({ comments: [], loading: false });
            }
        } catch (error) {
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