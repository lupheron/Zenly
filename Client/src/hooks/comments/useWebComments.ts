'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'
import api from '@/src/utils/axios'
import { WebComment } from '@/src/utils/Comment'
import { AxiosError } from 'axios'

interface CommentResponse {
    message: string
    status?: number
    data?: number
}

class CommentError extends Error {
    status: number
    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const fetchWebComments = async (): Promise<WebComment[]> => {
    try {
        const res = await api.get<{ data: WebComment[] }>('/comments')
        return res.data.data
    } catch (error) {
        AlertDefault.error("Kommentlarni olishda xatolik yuz berdi.")
        throw new Error((error as Error).message || "Failed to fetch comments")
    }
}

const submitWebComment = async (data: WebComment): Promise<CommentResponse> => {
    try {
        const response = await api.post<CommentResponse>('/comments', data)
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>
        const status = axiosError.response?.status ?? 500
        const message = axiosError.response?.data?.message ?? 'An unexpected error occurred'
        throw new CommentError(message, status)
    }
}

export const useWebComments = () => {
    const query = useQuery({
        queryKey: ['webComments'],
        queryFn: fetchWebComments,
        retry: false,
    })

    const mutation = useMutation({
        mutationFn: submitWebComment,
    })

    return {
        ...query,
        submitComment: mutation.mutateAsync,
        submitCommentStatus: mutation.status,
    }
}
