import { create } from "zustand";
import api from "../axios";
import React from "react";

// hooks/Comments/useComments.js
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
            const response = await api.get(`/admin/comments/${postId}`);

            if (response.data.status === 200 && response.data.data) {
                set({ comments: response.data.data, loading: false });
            } else if (Array.isArray(response.data)) {
                set({ comments: response.data, loading: false });
            } else {
                set({ comments: [], loading: false });
            }
        } catch (error) {
            set({ error: error.message || 'An error occurred', loading: false, comments: [] });
        }
    },

    deleteComment: async (id) => {
        try {
            const res = await api.delete(`/admin/comments/${id}`);
            if (res.status === 200) {
                set((state) => ({
                    comments: state.comments.filter((c) => c.id !== id)
                }));
                return res.data;
            } else {
                throw new Error(res.data.message || "Failed to delete comment");
            }
        } catch (error) {
            console.error("Delete comment error:", error);
            throw error;
        }
    },

    clearComments: () => {
        set({ comments: [], error: null });
    }
}));
