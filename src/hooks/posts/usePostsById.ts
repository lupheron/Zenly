'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const fetchPostById = async (id: number): Promise<any> => {
    const res = await fetch(`http://zenlyserver.test/api/post/${id}`)
    const responseData = await res.json()

    if (!res.ok) {
        throw new Error("Failed to fetch post.")
    }

    if (responseData.data?.img) {
        responseData.data.img = responseData.data.img.startsWith('http')
            ? responseData.data.img
            : `http://zenlyserver.test/${responseData.data.img.replace(/^\//, '')}`
    }

    return responseData.data
}

const deletePostById = async (id: number) => {
    const res = await fetch(`http://zenlyserver.test/api/posts/${id}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        throw new Error("Failed to delete post.")
    }

    return res.json()
}

export const usePostById = (id: number) => {
    const queryClient = useQueryClient()

    const postQuery = useQuery({
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
        },
    })

    return { ...postQuery, deleteMutation }
}