'use client'

import { useQuery } from '@tanstack/react-query'
import api from '@/src/utils/axios'

interface GalleryImage {
    id: number
    post_id: number
    img: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_BASE_API_URL

const fetchGalleryByPostId = async (postId: number): Promise<GalleryImage[]> => {
    const res = await api.get(`/gallery/${postId}`)
    return res.data.data.map((img: GalleryImage) => ({
        ...img,
        img: img.img.startsWith('http') ? img.img : `${API_BASE_URL}${img.img}`
    }))
}

export const useGalleryByPostId = (postId: number) => {
    return useQuery({
        queryKey: ['gallery', postId],
        queryFn: () => fetchGalleryByPostId(postId),
        enabled: !!postId,
        staleTime: 60 * 1000,
        retry: 3,
    })
}
