'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'

const API_BASE_URL = 'http://zenlyserver.test/api'

const fetchUsersPosts = async (user_id: number): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/posts/user/${user_id}`)
    const responseData = await res.json()

    if (!res.ok) {
        AlertDefault.error("Foydalanuvchi postlarini olishda xatolik yuz berdi.")
        throw new Error("Failed to fetch user's posts.")
    }

    return responseData.data
}

const createPost = async (data: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        AlertDefault.error("Post yaratishda xatolik yuz berdi.")
        throw new Error('Failed to create post')
    }

    return res.json()
}

export const useUsersPosts = (user_id: number) => {
    const query = useQuery({
        queryKey: ['user-posts', user_id],
        queryFn: () => fetchUsersPosts(user_id),
        enabled: !!user_id,
        retry: false
    })

    const createMutation = useMutation({
        mutationFn: createPost,
    })

    return {
        ...query,
        createPost: createMutation,
    }
}