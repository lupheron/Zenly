'use client'

import { useQuery } from '@tanstack/react-query'

export interface Post {
    id: number
    title: string
}

const fetchPosts = async (): Promise<Post[]> => {
    const res = await fetch('http://zenlyserver.test/api/posts')

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
