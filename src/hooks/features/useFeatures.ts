'use client'

import { useQuery } from '@tanstack/react-query'

const fetchFeatures = async (postId: number): Promise<any[]> => {
    const res = await fetch(`http://zenlyserver.test/api/features/${postId}`)
    const responseData = await res.json()

    if (!res.ok) {
        throw new Error("Failed to fetch features.")
    }

    return responseData.data
}

export const useFeatures = (postId: number) => {
    return useQuery({
        queryKey: ['features', postId], // Unique cache per postId
        queryFn: () => fetchFeatures(postId),
        enabled: !!postId, // Only run if postId exists
        staleTime: 60 * 1000,
        retry: false,
    })
}
