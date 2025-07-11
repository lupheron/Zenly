'use client'

import { useQuery } from '@tanstack/react-query'

const API = process.env.NEXT_PUBLIC_APP_BASE_API_URL

const fetchPostRating = async (post_id: number): Promise<number> => {
    const res = await fetch(`${API}/rating/${post_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const responseData = await res.json()

    if (!res.ok) {
        throw new Error(responseData.message || 'Reytingni olishda xatolik yuz berdi.')
    }

    return responseData.average_rating
}

export const usePostRating = (post_id: number) => {
    return useQuery({
        queryKey: ['post-rating', post_id],
        queryFn: () => fetchPostRating(post_id),
        enabled: !!post_id,
        retry: false,
    })
}
