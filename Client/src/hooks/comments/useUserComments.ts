'use client'

import api from '@/src/utils/axios'
import { PostComment } from '@/src/utils/Comment'
import { useQuery } from '@tanstack/react-query'

interface Comment {
    post_id: number
    user_id: number
    name: string
    text: string
}

const fetchUserComments = async (user_id: string): Promise<Comment[]> => {
    const res = await api.get(`/post-comments/${user_id}`)
    return res.data
}

export const createPostComments = async (data: PostComment): Promise<{ success: boolean }> => {
    await api.post('/post-comments', data)
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
