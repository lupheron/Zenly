'use client'

import api from '@/src/utils/axios';
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

const fetchPostById = async (id: number): Promise<Post> => {
    const res = await api.get(`/post/${id}`)
    const post = res.data.data

    if (post?.img && !post.img.startsWith('http')) {
        post.img = `${api.defaults.baseURL}/${post.img.replace(/^\//, '')}`
    }

    return post
}

const deletePostById = async (id: number): Promise<void> => {
    await api.delete(`/posts/${id}`)
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
