'use client'

import api from '@/src/utils/axios'
import { useQuery } from '@tanstack/react-query'


const fetchPostRating = async (post_id: number): Promise<number> => {
    const res = await api.get(`/rating/${post_id}`)
    return res.data.average_rating
}

export const usePostRating = (post_id: number) => {
    return useQuery({
        queryKey: ['post-rating', post_id],
        queryFn: () => fetchPostRating(post_id),
        enabled: !!post_id,
        retry: false,
    })
}
