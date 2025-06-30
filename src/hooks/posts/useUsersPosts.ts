'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'

const API_BASE_URL = 'http://zenlyserver.test/api'

const fetchUsersPosts = async (user_id: number): Promise<any[]> => {
    const res = await fetch(`${API_BASE_URL}/posts/user/${user_id}`)

    const text = await res.text()

    try {
        const json = JSON.parse(text)
        if (!res.ok) {
            AlertDefault.error(json.message || "Foydalanuvchi postlarini olishda xatolik yuz berdi.")
            throw new Error(json.message || "Failed to fetch user's posts.")
        }
        return json.data
    } catch {
        AlertDefault.error("Serverdan noto'g'ri ma'lumot keldi.")
        throw new Error("Unexpected server response.")
    }
}

const createPost = async (data: any): Promise<any> => {
    const res = await fetch(`${API_BASE_URL}/posts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const text = await res.text()

    try {
        const json = JSON.parse(text)
        if (!res.ok) {
            AlertDefault.error(json.message || "Post yaratishda xatolik yuz berdi.")
            throw new Error(json.message || "Failed to create post.")
        }
        return json
    } catch {
        AlertDefault.error("Serverdan noto'g'ri ma'lumot keldi.")
        throw new Error("Unexpected server response.")
    }
}

export const useUsersPosts = (user_id: number) => {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ['user-posts', user_id],
        queryFn: () => fetchUsersPosts(user_id),
        enabled: !!user_id,
        retry: false,
    })

    const createMutation = useMutation({
        mutationFn: createPost,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-posts', user_id] })
            AlertDefault.success("Post yaratildi.")
        },
        onError: () => {
            AlertDefault.error("Post yaratishda xatolik yuz berdi.")
        }
    })

    return {
        ...query,
        createPost: createMutation,
    }
}
