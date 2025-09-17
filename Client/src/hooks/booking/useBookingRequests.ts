'use client'

import api from '@/src/utils/axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
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
        throw new Error(axiosError.response?.data?.message || 'Bron qilish so\'rovini yuborishda xatolik yuz berdi.')
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
  user_phone: string
  send_date: string
  status: string
  post_id: number
  post_owner_fullname: string
}

export const useUserBookingRequests = (user_id: number | null, dateFilter?: { startDate?: string; endDate?: string }) => {
  return useQuery<UserBookingRequest[]>({
    queryKey: ['user-booking-requests', user_id, dateFilter?.startDate, dateFilter?.endDate],
    queryFn: async () => {
      if (!user_id) return []
      const params: Record<string, string> = {};
      if (dateFilter?.startDate) params.start_date = dateFilter.startDate;
      if (dateFilter?.endDate) params.end_date = dateFilter.endDate;
      const res = await api.get(`/booking-requests/user/${user_id}`, { params });
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
  user_phone: string
  send_date: string
  status: string
}

export const useBookingRequestsForUserPosts = (user_id: number | null, dateFilter?: { startDate?: string; endDate?: string }) => {
  return useQuery<PostBookingRequest[]>({
    queryKey: ['booking-requests-for-user-posts', user_id, dateFilter?.startDate, dateFilter?.endDate],
    queryFn: async () => {
      if (!user_id) return []
      const params: Record<string, string> = {};
      if (dateFilter?.startDate) params.start_date = dateFilter.startDate;
      if (dateFilter?.endDate) params.end_date = dateFilter.endDate;
      const res = await api.get(`/booking-requests/for-user-posts/${user_id}`, { params });
      return res.data.data
    },
    enabled: !!user_id,
    retry: 2,
  })
}

export const useUpdateBookingRequestStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await api.put(`/booking-requests/${id}/status`, { status })
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking-requests-for-user-posts'] })
    }
  })
}

export const useCreateBookingChecking = () => {
  return useMutation({
    mutationFn: async (data: { request_id: number, user_id: number, post_id: number, start_date: string, end_date: string, price: number }) => {
      const res = await api.post('/booking-checking', data)
      return res.data
    }
  })
}

export interface BookingChecking {
  id: number;
  request_id: number;
  user_id: number;
  post_id: number;
  owner_confirmed: boolean;
  customer_confirmed: boolean;
  owner_data: string | null;
  customer_data: string | null;
  status: string;
  created_at: string;
}

export const useBookingCheckingByRequestId = (request_id: number | null) => {
  return useQuery<BookingChecking | null>({
    queryKey: ['booking-checking', request_id],
    queryFn: async () => {
      if (!request_id) return null
      const res = await api.get(`/booking-checking/by-request/${request_id}`)
      return res.data.data
    },
    enabled: !!request_id,
    retry: 2,
  })
}

export const useCustomerConfirmBookingChecking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, start_date, end_date, price }: { id: number, start_date: string, end_date: string, price: number }) => {
      const res = await api.post(`/booking-checking/${id}/customer-confirm`, { start_date, end_date, price })
      return res.data
    },
    onSuccess: () => {
      // Invalidate both booking requests and booking checking queries
      queryClient.invalidateQueries({ queryKey: ['user-booking-requests'] })
      queryClient.invalidateQueries({ queryKey: ['booking-checking'] })
      AlertDefault.success('Bron tasdiqlandi va faollashtirildi!')
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ message?: string }>
      if (axiosError?.response?.status === 422) {
        AlertDefault.error('Ma&apos;lumotlar mos emas!')
      } else {
        AlertDefault.error(axiosError.response?.data?.message || 'Bron tasdiqlashda xatolik yuz berdi.')
      }
    }
  })
}

export const useCustomerRejectBookingChecking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const res = await api.post(`/booking-requests/${id}/customer-reject`)
      return res.data
    },
    onSuccess: () => {
      // Invalidate both booking requests and booking checking queries
      queryClient.invalidateQueries({ queryKey: ['user-booking-requests'] })
      queryClient.invalidateQueries({ queryKey: ['booking-checking'] })
      AlertDefault.success('Bron bekor qilindi va joy qayta mavjud bo\'ldi.')
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ message?: string }>
      AlertDefault.error(axiosError.response?.data?.message || 'Bron bekor qilishda xatolik yuz berdi.')
    }
  })
}
