'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface Post {
    id: number;
    user_id: number;
    area_id: number;
    title: string;
    img: string;
    small_description: string;
    description: string;
    price_daily: number;
    location: string;
    members: number;
    clicked: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_API_URL

const fetchPostById = async (id: number): Promise<Post> => {
    const res = await fetch(`${API_BASE_URL}/post/${id}`)
    const responseData = await res.json()

    if (!res.ok) {
        throw new Error("Failed to fetch post.")
    }

    if (responseData.data?.img) {
        responseData.data.img = responseData.data.img.startsWith('http')
            ? responseData.data.img
            : `${API_BASE_URL}/${responseData.data.img.replace(/^\//, '')}`
    }

    return responseData.data
}

const deletePostById = async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/posts/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        throw new Error("Failed to delete post.")
    }
}

export const usePostById = (id: number) => {
    const queryClient = useQueryClient()

    const postQuery = useQuery<Post>({
        queryKey: ['post', id],
        queryFn: () => fetchPostById(id),
        enabled: !!id,
        staleTime: 60 * 1000,
        retry: false,
    })

    const deleteMutation = useMutation({
        mutationFn: () => deletePostById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
            queryClient.invalidateQueries({ queryKey: ['post', id] })
        },
    })

    return { ...postQuery, deleteMutation }
}
