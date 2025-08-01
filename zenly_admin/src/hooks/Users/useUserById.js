import { create } from "zustand";
import api from "../axios";

export const useUserByIdStore = create((set, get) => ({
    user: null,
    loading: false,
    error: null,

    getUserById: (id) => {
        set({ loading: true, error: null });
        
        api.get(`/admin/users/${id}`)
            .then((response) => {
                if (response.data.success && response.data.data) {
                    set({ 
                        user: response.data.data,
                        loading: false,
                        error: null
                    });
                } else {
                    set({ 
                        error: response.data.message || 'Failed to fetch user',
                        loading: false
                    });
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Failed to fetch user';
                set({ 
                    error: errorMessage,
                    loading: false
                });
            });
    },

    clearUser: () => {
        set({ user: null, loading: false, error: null });
    },

    deleteUser: (id) => {
        api.delete(`/admin/users/${id}`)
            .then((response) => {
                console.log(response);
            });
    }
})); 