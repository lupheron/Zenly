'use client'

import { useQuery } from '@tanstack/react-query'

interface Comment {
    id: number
    name: string
    text: string
    postTitle: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_API_URL

const fetchUserComments = async (user_id: string): Promise<Comment[]> => {
    const res = await fetch(`${API_BASE_URL}/post-comments/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!res.ok) {
        throw new Error('Failed to fetch comments')
    }

    return res.json()
}

export const useUserComments = (user_id: string | null) => {
    return useQuery({
        queryKey: ['user-comments', user_id],
        queryFn: () => fetchUserComments(user_id!),
        enabled: !!user_id,
        retry: false
    })
}
