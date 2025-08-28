'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'
import api from '@/src/utils/axios'

export interface Feature {
    id: number
    name: string
}

interface FeaturePayload {
    post_id: number
    user_id: number
    name: string
}

const fetchFeatures = async (post_id: number): Promise<Feature[]> => {
    const res = await api.get(`/features/${post_id}`)
    return res.data.data
}

const createFeature = async (data: FeaturePayload): Promise<Feature> => {
    const res = await api.post('/features', data)
    return res.data
}

const createMultipleFeatures = async (features: FeaturePayload[]): Promise<Feature[]> => {
    const promises = features.map(feature => createFeature(feature))
    return Promise.all(promises)
}

const deleteFeature = async (featureId: number) => {
    const res = await api.delete(`/features/${featureId}`)
    return res.data
}

export const useFeatures = (post_id?: number) => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['features', post_id],
        queryFn: () => fetchFeatures(post_id!),
        enabled: !!post_id,
        retry: 3,
    })

    const mutation = useMutation({
        mutationFn: createFeature,
        onMutate: async (newFeature: FeaturePayload) => {
            await queryClient.cancelQueries({ queryKey: ['features', post_id] })

            const previousFeatures = queryClient.getQueryData<Feature[]>(['features', post_id])

            queryClient.setQueryData<Feature[]>(['features', post_id], (old = []) => [
                ...old,
                { id: Date.now(), ...newFeature }
            ])

            return { previousFeatures }
        },
        onError: (_err, _newFeature, context) => {
            if (context?.previousFeatures) {
                queryClient.setQueryData(['features', post_id], context.previousFeatures)
            }
            AlertDefault.error('Xatolik yuz berdi.')
        },
        onSuccess: () => {
            AlertDefault.success('Imkoniyat yaratildi.')
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['features', post_id] })
        }
    })

    const batchMutation = useMutation({
        mutationFn: createMultipleFeatures,
        onMutate: async (newFeatures: FeaturePayload[]) => {
            await queryClient.cancelQueries({ queryKey: ['features', post_id] })

            const previousFeatures = queryClient.getQueryData<Feature[]>(['features', post_id])

            queryClient.setQueryData<Feature[]>(['features', post_id], (old = []) => [
                ...old,
                ...newFeatures.map(feature => ({ id: Date.now() + Math.random(), ...feature }))
            ])

            return { previousFeatures }
        },
        onError: (_err, _newFeatures, context) => {
            if (context?.previousFeatures) {
                queryClient.setQueryData(['features', post_id], context.previousFeatures)
            }
            AlertDefault.error('Xatolik yuz berdi.')
        },
        onSuccess: () => {
            AlertDefault.success('Imkoniyatlar muvaffaqiyatli yaratildi.')
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['features', post_id] })
        }
    })

    const deleteMutation = useMutation({
        mutationFn: deleteFeature,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['features', post_id] })
            AlertDefault.success('Imkoniyat o\'chirildi.')
        },
    })

    return { 
        ...query, 
        createFeature: mutation, 
        createMultipleFeatures: batchMutation,
        deleteFeature: deleteMutation 
    }
}
