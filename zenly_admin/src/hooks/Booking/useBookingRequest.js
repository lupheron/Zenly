// src/hooks/useBookingRequest.js
import { create } from "zustand";
import api from "../axios";

export const useBookingRequest = create((set) => ({
    bookingRequests: [],
    loading: false,
    error: null,

    getBookingRequestsByUser: async (userId) => {
        set({ loading: true, error: null });
        try {
            const res = await api.get(`/admin/booking-requests/user/${userId}`);
            if (res.data.status === 200 && res.data.data) {
                set({ bookingRequests: res.data.data, loading: false });
            } else {
                set({ error: "Failed to fetch booking requests", loading: false });
            }
        } catch (err) {
            set({ error: err.message || "An error occurred", loading: false });
        }
    },

    clearBookingRequests: () => {
        set({ bookingRequests: [], error: null });
    }
}));
