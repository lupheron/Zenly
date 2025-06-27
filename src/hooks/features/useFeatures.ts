'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'

const fetchFeatures = async (post_id: number): Promise<any[]> => {
    const res = await fetch(`http://zenlyserver.test/api/features/${post_id}`)
    const responseData = await res.json()

    if (!res.ok) {
        AlertDefault.error("Imkoniyatlarni olishda xatolik yuz berdi.")
        throw new Error("Failed to fetch features.")
    }

    return responseData.data
}

const createFeature = async (data: any) => {
    const res = await fetch(`http://zenlyserver.test/api/features`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        AlertDefault.error("Imkoniyat yaratishda xatolik yuz berdi.")
        throw new Error('Failed to create feature')
    }

    return res.json()
}

const deleteFeature = async (featureId: number) => {
    const res = await fetch(`http://zenlyserver.test/api/features/${featureId}`, {
        method: 'DELETE',
    })

    if (!res.ok) {
        AlertDefault.error("Imkoniyatni o'chirishda xatolik yuz berdi.")
        throw new Error('Failed to delete feature')
    }

    return res.json()
}

export const useFeatures = (post_id: number) => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['features', post_id],
        queryFn: () => fetchFeatures(post_id),
        staleTime: 60 * 1000,
        enabled: !!post_id,
        retry: false,
    })

    const mutation = useMutation({
        mutationFn: createFeature,
        onMutate: async (newFeature) => {
            await queryClient.cancelQueries({ queryKey: ['features', post_id] })

            const previousFeatures = queryClient.getQueryData<any[]>(['features', post_id])

            queryClient.setQueryData(['features', post_id], (old = []) => [...old, { id: Date.now(), ...newFeature }])

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


    const deleteMutation = useMutation({
        mutationFn: deleteFeature,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['features', post_id] })
            AlertDefault.success('Imkoniyat o‘chirildi.')
        },
    })

    return { ...query, createFeature: mutation, deleteFeature: deleteMutation }
}