import { create } from "zustand";
import api from "../axios";

export const useUserByIdStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,
    updateLoading: false,

    getUserById: (id) => {
        set({ loading: true, error: null });

        return api.get(`/admin/users/${id}`)
            .then((response) => {
                if (response.data.success && response.data.data) {
                    set({
                        user: response.data.data,
                        loading: false,
                        error: null
                    });
                    return response.data.data;
                } else {
                    set({
                        error: response.data.message || 'Failed to fetch user',
                        loading: false
                    });
                    throw new Error(response.data.message || 'Failed to fetch user');
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Failed to fetch user';
                set({
                    error: errorMessage,
                    loading: false
                });
                throw error;
            });
    },

    updateUser: (id, formData) => {
        set({ updateLoading: true, error: null });

        return api.put(`/admin/users/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then((response) => {
                if (response.data.status === 200) {
                    // Update the user data in store with the returned data
                    set(state => ({
                        user: response.data.data || { ...state.user, ...response.data },
                        updateLoading: false,
                        error: null
                    }));
                    return response.data;
                } else {
                    set({
                        error: response.data.message || 'Failed to update user',
                        updateLoading: false
                    });
                    throw new Error(response.data.message || 'Failed to update user');
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Failed to update user';
                set({
                    error: errorMessage,
                    updateLoading: false
                });
                throw error;
            });
    },

    deleteUser: (id) => {
        set({ loading: true, error: null });

        return api.delete(`/admin/users/${id}`)
            .then((response) => {
                if (response.data.status === 200) {
                    set({
                        user: null,
                        loading: false,
                        error: null
                    });
                    return response.data;
                } else {
                    set({
                        error: response.data.message || 'Failed to delete user',
                        loading: false
                    });
                    throw new Error(response.data.message || 'Failed to delete user');
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Failed to delete user';
                set({
                    error: errorMessage,
                    loading: false
                });
                throw error;
            });
    },

    clearUser: () => {
        set({ user: null, loading: false, error: null, updateLoading: false });
    }
}));