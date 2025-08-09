// hooks/Rating/useRating.js
import { create } from "zustand";
import api from "../axios";

export const useRatingStore = create((set, get) => ({
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
                set({ rating: [], loading: false });
            }
        } catch (error) {
            set({ error: error.message || "An error occurred", loading: false });
        }
    },

    deleteRating: async (id) => {
        try {
            const res = await api.delete(`/admin/rating/${id}`);
            if (res.status === 200) {
                set((state) => ({
                    rating: state.rating.filter((r) => r.id !== id)
                }));
                return res.data;
            } else {
                throw new Error(res.data.message || "Failed to delete rating");
            }
        } catch (error) {
            console.error("Delete rating error:", error);
            throw error;
        }
    },

    clearRatings: () => set({ rating: [], error: null })
}));

export const useRating = () => useRatingStore();
