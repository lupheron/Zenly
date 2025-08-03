import { create } from "zustand";
import api from "../axios";
import React from "react";

export const useFeaturesStore = create((set, get) => ({
    features: [],
    loading: false,
    error: null,

    getFeatures: async (postId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/admin/features/${postId}`);
            if (response.data.status === 200 && response.data.data) {
                set({ features: response.data.data, loading: false });
            } else {
                set({ features: [], loading: false });
            }
        } catch (error) {
            const errorObj = {
                message: error.response?.data?.message || error.message || 'An error occurred',
                status: error.response?.status || 500
            };
            set({ error: errorObj, loading: false, features: [] });
        }
    },

    clearFeatures: () => {
        set({ features: [], error: null });
    }
}));

// Custom hook for component use
export const useFeatures = (postId) => {
    const { features, loading, error, getFeatures, clearFeatures } = useFeaturesStore();

    React.useEffect(() => {
        if (postId) {
            getFeatures(postId);
        }
        return () => clearFeatures();
    }, [postId, getFeatures, clearFeatures]);

    return { features, loading, error };
};