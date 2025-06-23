'use client'

import AlertDefault from '@/src/components/Alert/AlertDefault'
import { useQuery } from '@tanstack/react-query'

const fetchUserById = async (user_id: number): Promise<any> => {
    const res = await fetch(`http://zenlyserver.test/api/user/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const responseData = await res.json()

    if (!res.ok) {
        AlertDefault.error("Foydalanuvchini olishda xatolik yuz berdi.")
    }

    return responseData
}

export const useUser = () => {
    const id = typeof window !== 'undefined' ? Number(localStorage.getItem('user_id')) : null

    return useQuery({
        queryKey: ['user', id],
        queryFn: () => fetchUserById(id!),
        enabled: !!id,
        retry: false,
    })
}
