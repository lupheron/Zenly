'use client'

import { useQuery } from '@tanstack/react-query'

const fetchPostById = async (id: number): Promise<any> => {
    const res = await fetch(`http://zenlyserver.test/api/post/${id}`)
    const responseData = await res.json()

    if (!res.ok) {
        throw new Error("Failed to fetch post.")
    }

    // Ensure image URL is properly formatted
    if (responseData.data?.img) {
        responseData.data.img = responseData.data.img.startsWith('http')
            ? responseData.data.img
            : `http://zenlyserver.test${responseData.data.img}`
    }

    return responseData.data
}

export const usePostById = (id: number) => {
    return useQuery({
        queryKey: ['post', id],
        queryFn: () => fetchPostById(id),
        enabled: !!id,
        staleTime: 60 * 1000,
        retry: false,
    })
}