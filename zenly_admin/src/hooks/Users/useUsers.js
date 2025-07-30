import { create } from "zustand";
import api from "../axios";

export const useUsersStore = create((set, get) => ({
    users: [],
    loading: false,
    error: null,

    getUsers: () => {
        set({ loading: true, error: null });
        
        api.get("/admin/users")
            .then((response) => {
                if (response.data.success && response.data.data) {
                    set({ 
                        users: response.data.data,
                        loading: false,
                        error: null
                    });
                } else {
                    set({ 
                        error: response.data.message || 'Failed to fetch users',
                        loading: false
                    });
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Failed to fetch users';
                set({ 
                    error: errorMessage,
                    loading: false
                });
            });
    }
}));