'use client'

import api from '@/src/utils/axios'
import { useMutation } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'
import { AxiosError } from 'axios'

interface BookingRequestInput {
    post_id: number
}

const createBookingRequest = async (data: BookingRequestInput) => {
    try {
        const user_id = Number(localStorage.getItem('user_id'))
        if (!user_id) throw new Error('Foydalanuvchi aniqlanmadi (user_id yo\'q)')
        const payload = {
            user_id,
            post_id: data.post_id,
            status: 'pending',
        }
        const res = await api.post('/booking-requests', payload)
        return res.data
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        AlertDefault.error(axiosError.response?.data?.message || 'Bron qilishda xatolik yuz berdi.')
        throw new Error(axiosError.response?.data?.message || 'Failed to submit booking request.')
    }
}

export const useCreateBookingRequest = () => {
    return useMutation({
        mutationFn: createBookingRequest,
        onSuccess: () => {
            AlertDefault.success('Bron qilish so\'rovi yuborildi!')
        },
    })
}
