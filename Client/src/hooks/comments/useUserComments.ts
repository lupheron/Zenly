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

const fetchPostComments = async (post_id: string, dateFilter?: { startDate?: string; endDate?: string }): Promise<Comment[]> => {
    const params: Record<string, string> = {};
    if (dateFilter?.startDate) params.start_date = dateFilter.startDate;
    if (dateFilter?.endDate) params.end_date = dateFilter.endDate;
    const res = await api.get(`/post-comments/${post_id}`, { params });
    // Extract data from the API response format
    return res.data.data || res.data;
}

export const createPostComments = async (data: PostComment): Promise<{ success: boolean }> => {
    await api.post('/post-comments', data)
    return { success: true }
}

export const usePostComments = (post_id: string | null, dateFilter?: { startDate?: string; endDate?: string }) => {
    return useQuery({
        queryKey: ['post-comments', post_id, dateFilter?.startDate, dateFilter?.endDate],
        queryFn: () => fetchPostComments(post_id!, dateFilter),
        enabled: !!post_id,
        retry: 3,
    })
}

// Keep the old hook name for backward compatibility
export const useUserComments = usePostComments;
