'use client'

import { useQuery } from '@tanstack/react-query'

export interface Post {
    id: number
    title: string
    user_id: number
}


const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_API_URL

const fetchPosts = async (): Promise<Post[]> => {
    const res = await fetch(`${API_BASE_URL}/posts`)

    const responseData = await res.json()

    if (!res.ok) {
        throw new Error(responseData.message || 'Postlarni olishda xatolik yuz berdi.')
    }

    return responseData.data
}

export const usePosts = () => {
    return useQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
    })
}
