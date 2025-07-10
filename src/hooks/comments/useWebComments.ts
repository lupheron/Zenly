'use client'

import api from '@/src/utils/axios'
import { WebComment } from '@/src/utils/Comment'
import { AxiosError } from 'axios'

interface CommentResponse {
    message: string
    status?: number
    data?: number
}

interface CustomError {
    status: number
    message: string
}

export const useWebComment = () => {
    const submitComment = async (data: WebComment): Promise<CommentResponse> => {
        try {
            const response = await api.post<CommentResponse>('/comments', data)
            return response.data
        } catch (error) {
            const axiosError = error as AxiosError<{ message: string }>
            const status = axiosError.response?.status ?? 500
            const message = axiosError.response?.data?.message ?? 'An unexpected error occurred'

            throw { status, message } satisfies CustomError
        }
    }

    return { submitComment }
}
