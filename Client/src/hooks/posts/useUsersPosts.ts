'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'
import { CreatePostPayload, CreatePostResponse, Post, UpdatePostPayload } from '@/src/utils/UsersPosts'
import { AxiosError } from 'axios'
import api from '@/src/utils/axios'

const fetchUsersPosts = async (user_id: number): Promise<Post[]> => {
    try {
        const res = await api.get<{ data: Post[] }>(`/posts/user/${user_id}`)
        return res.data.data
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        if (axiosError.response?.status === 404) return []

        AlertDefault.error(
            axiosError.response?.data?.message ?? "Foydalanuvchi postlarini olishda xatolik yuz berdi."
        )
        throw new Error(axiosError.response?.data?.message || "Foydalanuvchi postlarini olishda xatolik yuz berdi.")
    }
}

const createPost = async (data: CreatePostPayload): Promise<CreatePostResponse> => {
    try {
        const res = await api.post<CreatePostResponse>('/posts', data)
        return res.data
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        AlertDefault.error(axiosError.response?.data?.message || "Post yaratishda xatolik yuz berdi.")
        throw new Error(axiosError.response?.data?.message || "Post yaratishda xatolik yuz berdi.")
    }
}

const updatePost = async ({
    postId,
    data,
}: {
    postId: number
    data: UpdatePostPayload
}): Promise<Post> => {
    try {
        const res = await api.put<Post>(`/posts/${postId}`, data)
        return res.data
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        AlertDefault.error(axiosError.response?.data?.message || "Postni yangilashda xatolik yuz berdi.")
        throw new Error(axiosError.response?.data?.message || "Postni yangilashda xatolik yuz berdi.")
    }
}

export const useUsersPosts = (user_id: number, fetchOnMount: boolean = true) => {
    const queryClient = useQueryClient()

    const query = useQuery<Post[]>({
        queryKey: ['user-posts', user_id],
        queryFn: () => fetchUsersPosts(user_id),
        enabled: !!user_id && fetchOnMount,
        retry: 3,
    })

    const createMutation = useMutation<CreatePostResponse, Error, CreatePostPayload>({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-posts', user_id] })
            AlertDefault.success("Post yaratildi.")
        },
    })

    const updateMutation = useMutation<Post, Error, { postId: number; data: UpdatePostPayload }>({
        mutationFn: updatePost,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['user-posts', user_id] })
            queryClient.invalidateQueries({ queryKey: ['posts'] })
            queryClient.invalidateQueries({ queryKey: ['post', variables.postId] })
            AlertDefault.success("Post yangilandi.")
        },
    })

    return {
        ...query,
        createPost: createMutation,
        editPost: updateMutation,
    }
}
