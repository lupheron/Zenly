import { create } from "zustand";
import api from "../axios";
import React from "react";

export const usePosts = create((set, get) => ({
    posts: [],
    userPosts: [],
    post: null,
    loading: false,
    error: null,

    // Fetch single post by ID - FIXED ENDPOINT
    getPostById: async (postId) => {
        set({ loading: true, error: null });
        try {
            console.log('Fetching post with ID:', postId); // Debug log
            const response = await api.get(`admin/posts/${postId}`); // Fixed endpoint
            console.log('Detailed post response:', response.data);

            if (response.data.status === 200 && response.data.data) {
                set({ post: response.data.data, loading: false });
            } else {
                set({ error: 'Failed to fetch post', loading: false });
            }
        } catch (error) {
            console.error('Error fetching post:', error);
            set({ error: error.message || 'An error occurred', loading: false });
        }
    },

    // Update post
    updatePost: async (postId, postData) => {
        set({ loading: true, error: null });
        try {
            const response = await api.put(`admin/posts/${postId}`, postData);
            if (response.data.status === 200) {
                // Refresh the post data
                await get().getPostById(postId);
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            set({ error: error.message || 'An error occurred', loading: false });
            throw error;
        }
    },

    getAllPosts: async () => {
        set({ loading: true, error: null });
        try {
            const res = await api.get("/admin/posts");
            if (res.data.status === 200 && res.data.data) {
                set({ posts: res.data.data, loading: false });
            } else {
                set({ posts: [], loading: false });
            }
        } catch (error) {
            set({ error: error.message || "Error fetching posts", loading: false });
        }
    },

    // Clear single post
    clearPost: () => {
        set({ post: null, error: null });
    },

    // Get user posts
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

    // Delete post - FIXED to accept postId parameter
    deletePost: async (postId) => {
        try {
            console.log('Deleting post with ID:', postId); // Debug log
            const response = await api.delete(`/admin/posts/${postId}`);

            if (response.data.status === 200) {
                set({ post: null });
                return response.data;
            } else {
                throw new Error(response.data.message || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Delete error:', error);
            throw error;
        }
    },

    clearUserPosts: () => {
        set({ userPosts: [], error: null });
    },
}));

// Fixed hook to pass postId to deletePost
export const usePostByIdHook = (postId) => {
    const { post, loading, error, getPostById, updatePost, deletePost: storeDeletePost, clearPost } = usePosts();

    // Create a wrapper function that passes the postId
    const deletePost = async () => {
        if (!postId) {
            throw new Error('Post ID is required for deletion');
        }
        return await storeDeletePost(postId);
    };

    // Create a wrapper function that passes the postId
    const updatePostById = async (postData) => {
        if (!postId) {
            throw new Error('Post ID is required for update');
        }
        return await updatePost(postId, postData);
    };

    React.useEffect(() => {
        if (postId) {
            getPostById(postId);
        }
        return () => clearPost();
    }, [postId, getPostById, clearPost]);

    return { post, loading, error, getPostById, updatePost: updatePostById, deletePost };
};