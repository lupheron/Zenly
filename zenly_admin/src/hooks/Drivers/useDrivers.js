import { create } from "zustand";
import api from "../axios";

export const useDriversStore = create((set, get) => ({
    drivers: [],
    loading: false,
    error: null,

    getDrivers: () => {
        set({ loading: true, error: null });

        api.get("/admin/drivers")
            .then((response) => {
                if (response.data.status === 200 && response.data.data) {
                    set({
                        drivers: response.data.data,
                        loading: false,
                        error: null
                    });
                } else {
                    set({
                        error: response.data.message || 'Failed to fetch drivers',
                        loading: false
                    });
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Failed to fetch drivers';
                set({
                    error: errorMessage,
                    loading: false
                });
            });
    },

    createDriver: async (driverData) => {
        set({ loading: true, error: null });

        try {
            const response = await api.post("/admin/drivers", driverData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.status === 200) {
                get().getDrivers();
                return { success: true, data: response.data.data };
            } else {
                set({
                    error: response.data.message || 'Failed to create driver',
                    loading: false
                });
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create driver';
            set({
                error: errorMessage,
                loading: false
            });
            return { success: false, error: errorMessage };
        }
    },

    updateDriver: async (driverId, driverData) => {
        set({ loading: true, error: null });
    
        try {
            const response = await api.post(`/admin/drivers/${driverId}?_method=PUT`, driverData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
    
            if (response.data.status === 200) {
                get().getDrivers();
                return { success: true, data: response.data.data };
            } else {
                set({
                    error: response.data.message || 'Failed to update driver',
                    loading: false
                });
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to update driver';
            console.error('Update driver error details:', {
                message: errorMessage,
                errors: error.response?.data?.errors,
                validation_data: error.response?.data?.validation_data,
                status: error.response?.status
            });
            set({
                error: errorMessage,
                loading: false
            });
            return { success: false, error: errorMessage };
        }
    },

    deleteDriver: async (driverId) => {
        set({ loading: true, error: null });

        try {
            const response = await api.delete(`/admin/drivers/${driverId}`);
            if (response.data.status === 200) {
                get().getDrivers();
                return { success: true };
            } else {
                set({
                    error: response.data.message || 'Failed to delete driver',
                    loading: false
                });
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete driver';
            set({
                error: errorMessage,
                loading: false
            });
            return { success: false, error: errorMessage };
        }
    },

    deleteDrivers: async (driverIds) => {
        set({ loading: true, error: null });

        try {
            const deletePromises = driverIds.map(id => api.delete(`/admin/drivers/${id}`));
            const responses = await Promise.all(deletePromises);

            const allSuccessful = responses.every(response => response.data.status === 200);

            if (allSuccessful) {
                get().getDrivers();
                return { success: true };
            } else {
                set({
                    error: 'Some drivers could not be deleted',
                    loading: false
                });
                return { success: false, error: 'Some drivers could not be deleted' };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete drivers';
            set({
                error: errorMessage,
                loading: false
            });
            return { success: false, error: errorMessage };
        }
    }
}));
