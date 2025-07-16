'use client'

import { useMutation } from '@tanstack/react-query'
import AlertDefault from '../components/Alert/AlertDefault'
import { AxiosError } from 'axios'
import api from '../utils/axios'

interface LoginInput {
    username: string
    password: string
}

interface LoginResponse {
    id: number
    remember_token: string
    message: string
    user: {
        id: number
        fullname: string
        username: string
        // add more fields if needed
    }
}

const loginUser = async (data: LoginInput): Promise<LoginResponse> => {
    try {
        const res = await api.post<LoginResponse>('/login', data)
        return res.data
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        throw new Error(axiosError.response?.data?.message || 'Login failed')
    }
}

export const useLoginUser = () => {
    return useMutation<LoginResponse, Error, LoginInput>({
        mutationFn: loginUser,
        onError: (error: Error) => {
            AlertDefault.error(error.message || 'Login qilishda xatolik yuz berdi.')
        },
        retry: 3
    })
}
