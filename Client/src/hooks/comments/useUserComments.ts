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

const fetchUserComments = async (user_id: string, dateFilter?: { startDate?: string; endDate?: string }): Promise<Comment[]> => {
    const params: Record<string, string> = {};
    if (dateFilter?.startDate) params.start_date = dateFilter.startDate;
    if (dateFilter?.endDate) params.end_date = dateFilter.endDate;
    const res = await api.get(`/post-comments/${user_id}`, { params });
    return res.data;
}

export const createPostComments = async (data: PostComment): Promise<{ success: boolean }> => {
    await api.post('/post-comments', data)
    return { success: true }
}

export const useUserComments = (user_id: string | null, dateFilter?: { startDate?: string; endDate?: string }) => {
    return useQuery({
        queryKey: ['user-comments', user_id, dateFilter?.startDate, dateFilter?.endDate],
        queryFn: () => fetchUserComments(user_id!, dateFilter),
        enabled: !!user_id,
        retry: 3,
    })
}
