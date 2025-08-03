import { create } from "zustand";
import api from "../axios";
import React from "react";

export const usePosts = create((set, get) => ({
    posts: [],
    userPosts: [],
    post: null,
    loading: false,
    error: null,

    // Fetch single post by ID
    getPostById: async (postId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`admin/posts/users/${postId}`);
            console.log('Detailed post response:', response.data); // 👈 Add this for debugging
            if (response.data.status === 200 && response.data.data) {
                set({ post: response.data.data, loading: false });
            } else {
                set({ error: 'Failed to fetch post', loading: false });
            }
        } catch (error) {
            set({ error: error.message || 'An error occurred', loading: false });
        }
    },

    // Clear single post
    clearPost: () => {
        set({ post: null, error: null });
    },

    // Existing methods
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

    deletePost: async (postId) => {
        try {
            const response = await api.delete(`/admin/posts/${postId}`);
            if (response.data.status === 200) {
                set({ post: null });
                return response.data;
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            throw error;
        }
    },

    clearUserPosts: () => {
        set({ userPosts: [], error: null });
    },
}));


export const usePostByIdHook = (postId) => {
    const { post, loading, error, getPostById, deletePost, clearPost } = usePosts();

    React.useEffect(() => {
        if (postId) {
            getPostById(postId);
        }
        return () => clearPost();
    }, [postId, getPostById, clearPost]);

    return { post, loading, error, deletePost };
};