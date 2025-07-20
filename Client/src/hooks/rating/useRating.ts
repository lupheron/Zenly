'use client'

import api from '@/src/utils/axios'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'
import { AxiosError } from 'axios'

interface UserRatingResponse {
    has_rated: boolean
    user_rating: number | null
}

const fetchPostRating = async (post_id: number): Promise<number> => {
    const res = await api.get(`/rating/${post_id}`)
    return res.data.average_rating
}

const checkUserRating = async (post_id: number): Promise<UserRatingResponse> => {
    const res = await api.get(`/rating/${post_id}/check`)
    return res.data
}

const createRating = async (data: { post_id: number; rating: number }) => {
    try {
        const res = await api.post('/rating', data)
        return res.data
    } catch (error) {
        const axiosError = error as AxiosError<{ message?: string }>
        AlertDefault.error(axiosError.response?.data?.message || 'Reyting yuborishda xatolik yuz berdi.')
        throw new Error(axiosError.response?.data?.message || 'Failed to submit rating.')
    }
}

export const usePostRating = (post_id: number) => {
    return useQuery({
        queryKey: ['post-rating', post_id],
        queryFn: () => fetchPostRating(post_id),
        enabled: !!post_id,
        retry: 3,
    })
}

export const useUserRating = (post_id: number) => {
    return useQuery({
        queryKey: ['user-rating', post_id],
        queryFn: () => checkUserRating(post_id),
        enabled: !!post_id,
        retry: 3,
    })
}

export const useCreateRating = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createRating,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['post-rating', variables.post_id] })
            queryClient.invalidateQueries({ queryKey: ['user-rating', variables.post_id] })
            AlertDefault.success('Reyting yuborildi!')
        },
    })
}
