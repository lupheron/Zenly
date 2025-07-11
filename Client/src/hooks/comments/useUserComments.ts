'use client'

import { PostComment } from '@/src/utils/Comment'
import { useQuery } from '@tanstack/react-query'

interface Comment {
    post_id: number
    user_id: number
    name: string
    text: string
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

export const createPostComments = async (data: PostComment): Promise<{ success: boolean }> => {
    const res = await fetch(`${API_BASE_URL}/post-comments`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        const errorText = await res.text() 
        const error = new Error(errorText || "Failed to leave a comment") as Error & { status?: number }
        error.status = res.status
        throw error
    }

    return { success: true }
}


export const useUserComments = (user_id: string | null) => {
    return useQuery({
        queryKey: ['user-comments', user_id],
        queryFn: () => fetchUserComments(user_id!),
        enabled: !!user_id,
        retry: false,
    })
}
