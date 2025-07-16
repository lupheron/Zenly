'use client'

import api from '@/src/utils/axios'
import { useQuery } from '@tanstack/react-query'

export interface Post {
    id: number
    title: string
    user_id: number
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
