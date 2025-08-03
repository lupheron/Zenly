import { create } from "zustand";
import api from "../axios";
import React from "react";

export const useGalleryByPostIdStore = create((set, get) => ({
    galleryImages: [],
    loading: false,
    error: null,

    getGalleryByPostId: async (postId) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get(`/admin/gallery/${postId}`);
            if (response.data.status === 200 && response.data.data) {
                set({ galleryImages: response.data.data, loading: false });
            } else {
                set({ galleryImages: [], loading: false });
            }
        } catch (error) {
            set({ error: error.message || 'An error occurred', loading: false, galleryImages: [] });
        }
    },

    clearGallery: () => {
        set({ galleryImages: [], error: null });
    }
}));

export const useGalleryByPostId = (postId) => {
    const { galleryImages, loading, error, getGalleryByPostId, clearGallery } = useGalleryByPostIdStore();

    React.useEffect(() => {
        if (postId) {
            getGalleryByPostId(postId);
        }
        return () => clearGallery();
    }, [postId, getGalleryByPostId, clearGallery]);

    return { galleryImages, loading, error };
};