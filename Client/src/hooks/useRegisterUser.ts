'use client'

import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import api from '../utils/axios'

interface RegisterData {
    fullname: string
    username: string
    phone: string
    address: string
    password: string
    type: number
}

export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const registerUser = async (data: RegisterData): Promise<{ message: string }> => {
    try {
        const res = await api.post<{ message: string }>('/register', data)
        return res.data
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>

        if (axiosError.response?.status === 409) {
            throw new ApiError('USERNAME_CONFLICT', 409)
        }

        throw new ApiError(
            axiosError.response?.data?.message || 'GENERAL_ERROR',
            axiosError.response?.status || 500
        )
    }
}

export const useRegisterUser = () => {
    return useMutation<{ message: string }, ApiError, RegisterData>({
        mutationFn: registerUser,
    })
}
