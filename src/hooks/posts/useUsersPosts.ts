'use client'

import AlertDefault from '@/src/components/Alert/AlertDefault'
import { useQuery } from '@tanstack/react-query'

const fetchUsersPosts = async (user_id: number): Promise<any[]> => {
    const res = await fetch(`http://zenlyserver.test/api/posts/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const responseData = await res.json()

    if (!res.ok) {
        AlertDefault.error("Foydalanuvchi postlarini olishda xatolik yuz berdi.")
    }

    return responseData.data
}

export const useUsersPosts = () => {
    const id = typeof window !== 'undefined' ? Number(localStorage.getItem('user_id')) : null

    return useQuery({
        queryKey: ['user-posts', id],
        queryFn: () => fetchUsersPosts(id!),
        enabled: !!id,
        retry: false,
    })
}
