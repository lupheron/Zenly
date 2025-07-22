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

const fetchPosts = async (): Promise<Post[]> => {
    const res = await api.get('/posts')
    return res.data.data
}

export const usePosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        retry: 3,
    })
}

export const useTopRatedPosts = () => {
    return useQuery({
        queryKey: ['top-rated-posts'],
        queryFn: async () => {
            const res = await api.get('/posts/top-rated');
            return res.data.data;
        },
        staleTime: 2 * 24 * 60 * 60 * 1000, // 2 days
        retry: 3,
    });
}
