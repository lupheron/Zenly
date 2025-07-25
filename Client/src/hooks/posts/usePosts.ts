'use client'

import api from '@/src/utils/axios'
import { useQuery } from '@tanstack/react-query'

export interface Post {
    id: number
    title: string
    user_id: number
    area_id: number
    small_description: string
    img: string
}

const fetchPosts = async (dateFilter?: { startDate?: string; endDate?: string }): Promise<Post[]> => {
    const params: Record<string, string> = {};
    if (dateFilter?.startDate) params.start_date = dateFilter.startDate;
    if (dateFilter?.endDate) params.end_date = dateFilter.endDate;
    const res = await api.get('/posts', { params });
    return res.data.data;
}

export const usePosts = (dateFilter?: { startDate?: string; endDate?: string }) => {
    return useQuery({
        queryKey: ['posts', dateFilter?.startDate, dateFilter?.endDate],
        queryFn: () => fetchPosts(dateFilter),
        retry: 3,
    });
}

export const useTopRatedPosts = () => {
    return useQuery({
        queryKey: ['top-rated-posts'],
        queryFn: async () => {
            const res = await api.get('/posts/top-rated');
            return res.data.data;
        },
        staleTime: 2 * 24 * 60 * 60 * 1000, 
        retry: 3,
    });
}
