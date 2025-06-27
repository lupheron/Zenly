'use client'

import AlertDefault from '@/src/components/Alert/AlertDefault'
import { useMutation, useQuery } from '@tanstack/react-query'

const fetchUsersPosts = async (user_id: number): Promise<any[]> => {
    const res = await fetch(`http://zenlyserver.test/api/posts/user/${user_id}`)
    const responseData = await res.json()

    if (!res.ok) {
        AlertDefault.error("Foydalanuvchi postlarini olishda xatolik yuz berdi.")
        throw new Error("Failed to fetch user's posts.")
    }

    return responseData.data
}

const editPost = async (post_id: number, data: any) => {
    const res = await fetch(`http://zenlyserver.test/api/posts/${post_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        AlertDefault.error("Postni yangilashda xatolik yuz berdi.")
        throw new Error('Failed to edit post')
    }

    return res.json()
}

export const useUsersPosts = (user_id: number) => {
    const query = useQuery({
        queryKey: ['user-posts', user_id],
        queryFn: () => fetchUsersPosts(user_id),
        enabled: !!user_id,
    })

    const mutation = useMutation({
        mutationFn: ({ postId, data }: { postId: number; data: FormData }) => editPost(postId, data),
    })

    return { ...query, editPost: mutation }
}