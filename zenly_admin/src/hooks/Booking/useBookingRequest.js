// src/hooks/Booking/useBookingRequest.js
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

    deleteBookingRequest: async (id) => {
        try {
            const res = await api.delete(`/admin/booking-requests/${id}`);
            if (res.status === 200) {
                set((state) => ({
                    bookingRequests: state.bookingRequests.filter((br) => br.id !== id)
                }));
                return res.data;
            } else {
                throw new Error(res.data.message || "Failed to delete booking request");
            }
        } catch (error) {
            console.error("Delete booking request error:", error);
            throw error;
        }
    },

    clearBookingRequests: () => {
        set({ bookingRequests: [], error: null });
    }
}));
