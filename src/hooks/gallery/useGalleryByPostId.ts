'use client'

import { useQuery } from '@tanstack/react-query'

interface GalleryImage {
    id: number
    post_id: number
    img: string
}

const fetchGalleryByPostId = async (postId: number): Promise<GalleryImage[]> => {
    const res = await fetch(`http://zenlyserver.test/api/gallery/${postId}`)
    const responseData = await res.json()

    if (!res.ok) {
        throw new Error("Failed to fetch gallery.")
    }

    return responseData.data.map((img: GalleryImage) => ({
        ...img,
        img: img.img.startsWith('http') ? img.img : `http://zenlyserver.test${img.img}`
    }))
}

export const useGalleryByPostId = (postId: number) => {
    return useQuery({
        queryKey: ['gallery', postId],
        queryFn: () => fetchGalleryByPostId(postId),
        enabled: !!postId,
        staleTime: 60 * 1000, 
        retry: false,
    })
}