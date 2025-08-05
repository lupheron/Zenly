import { create } from "zustand";
import api from "../axios";

export const useRating = create((set) => ({
    rating: [],
    loading: false,
    error: null,

    getRatingsByUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/admin/rating/user/${userId}`);
            if (res.data.status === 200 && res.data.data) {
                set({ rating: res.data.data, loading: false });
            } else {
                set({ error: "Failed to fetch ratings", loading: false });
            }
        } catch (err) {
            set({ error: err.message || "An error occurred", loading: false });
        }
    },

    clearRatings: () => {
        set({ rating: [], error: null });
    }
}));