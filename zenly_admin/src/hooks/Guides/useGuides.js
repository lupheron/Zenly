import { create } from "zustand";
import api from "../axios";

export const useGuidesStore = create((set, get) => ({
    guides: [],
    loading: false,
    error: null,

    getGuides: () => {
        set({ loading: true, error: null });
        
        api.get("/admin/guides")
            .then((response) => {
                if (response.data.status === 200 && response.data.data) {
                    set({ 
                        guides: response.data.data,
                        loading: false,
                        error: null
                    });
                } else {
                    set({ 
                        error: response.data.message || 'Failed to fetch guides',
                        loading: false
                    });
                }
            })
            .catch((error) => {
                const errorMessage = error.response?.data?.message || 'Failed to fetch guides';
                set({ 
                    error: errorMessage,
                    loading: false
                });
            });
    },

    createGuide: async (guideData) => {
        set({ loading: true, error: null });
        
        try {
            const response = await api.post("/admin/guides", guideData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.status === 200) {
                get().getGuides();
                return { success: true, data: response.data.data };
            } else {
                set({ 
                    error: response.data.message || 'Failed to create guide',
                    loading: false
                });
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to create guide';
            set({ 
                error: errorMessage,
                loading: false
            });
            return { success: false, error: errorMessage };
        }
    },

    deleteGuide: async (guideId) => {
        set({ loading: true, error: null });
        
        try {
            const response = await api.delete(`/admin/guides/${guideId}`);
            if (response.data.status === 200) {
                get().getGuides();
                return { success: true };
            } else {
                set({ 
                    error: response.data.message || 'Failed to delete guide',
                    loading: false
                });
                return { success: false, error: response.data.message };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete guide';
            set({ 
                error: errorMessage,
                loading: false
            });
            return { success: false, error: errorMessage };
        }
    },

    deleteGuides: async (guideIds) => {
        set({ loading: true, error: null });
        
        try {
            const deletePromises = guideIds.map(id => api.delete(`/admin/guides/${id}`));
            const responses = await Promise.all(deletePromises);
            
            const allSuccessful = responses.every(response => response.data.status === 200);
            
            if (allSuccessful) {
                get().getGuides();
                return { success: true };
            } else {
                set({ 
                    error: 'Some guides could not be deleted',
                    loading: false
                });
                return { success: false, error: 'Some guides could not be deleted' };
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to delete guides';
            set({ 
                error: errorMessage,
                loading: false
            });
            return { success: false, error: errorMessage };
        }
    }
}));
