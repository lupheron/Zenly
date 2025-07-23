'use client'

import api from '@/src/utils/axios'
import { useMutation, useQuery } from '@tanstack/react-query'
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

export interface UserBookingRequest {
  id: number
  post_title: string
  user_fullname: string
  send_date: string
  status: string
  post_id: number
  post_owner_fullname: string
}

export const useUserBookingRequests = (user_id: number | null) => {
  return useQuery<UserBookingRequest[]>({
    queryKey: ['user-booking-requests', user_id],
    queryFn: async () => {
      if (!user_id) return []
      const res = await api.get(`/booking-requests/user/${user_id}`)
      return res.data.data
    },
    enabled: !!user_id,
    retry: 2,
  })
}

export interface PostBookingRequest {
  id: number
  post_title: string
  post_id: number
  requester_fullname: string
  send_date: string
  status: string
}

export const useBookingRequestsForUserPosts = (user_id: number | null) => {
  return useQuery<PostBookingRequest[]>({
    queryKey: ['booking-requests-for-user-posts', user_id],
    queryFn: async () => {
      if (!user_id) return []
      const res = await api.get(`/booking-requests/for-user-posts/${user_id}`)
      return res.data.data
    },
    enabled: !!user_id,
    retry: 2,
  })
}
