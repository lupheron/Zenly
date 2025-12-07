'use client'

import api from '@/src/utils/axios'
import { useQuery } from '@tanstack/react-query'

export interface Guide {
    id: number
    first_name: string
    last_name: string
    gender: string
    date_of_birth: string
    phone: string
    email: string
    languages: string
    experience_years: number
    specialization: string
    rating: number | null
    location: string
    available: string
    profile_photo: string | null
    bio: string
    created_at: string
}

const fetchGuides = async (): Promise<Guide[]> => {
    const res = await api.get('/guides');
    return res.data.data;
}

const fetchGuideById = async (id: string): Promise<Guide> => {
    const res = await api.get(`/guides/${id}`);
    return res.data.data;
}

export const useGuides = () => {
    return useQuery({
        queryKey: ['guides'],
        queryFn: fetchGuides,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
    });
}

export const useGuide = (id: string) => {
    return useQuery({
        queryKey: ['guide', id],
        queryFn: () => fetchGuideById(id),
        staleTime: 5 * 60 * 1000,
        retry: 3,
        enabled: !!id, // Only run if id exists
    });
}
