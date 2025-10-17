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
                // Refresh the guides list
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
    }
}));
