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

    updateBookingRequest: async (id, data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.put(`/admin/booking-requests/${id}`, data);
            if (res.data.status === 200 && res.data.data) {
                set((state) => ({
                    bookingRequests: state.bookingRequests.map((br) =>
                        br.id === id ? res.data.data : br
                    ),
                    loading: false
                }));
                return res.data;
            } else {
                throw new Error(res.data.message || "Failed to update booking request");
            }
        } catch (err) {
            set({ error: err.message || "An error occurred", loading: false });
            throw err;
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
