'use client'

import { useQuery } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'

const fetchPostById = async (id: number): Promise<any> => {
    const res = await fetch(`http://zenlyserver.test/api/post/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    const responseData = await res.json()

    if (!res.ok) {
        AlertDefault.error("Post ma'lumotlarini olishda xatolik yuz berdi.")
    }

    return responseData.data
}

export const usePostById = (id: number) => {
    return useQuery({
        queryKey: ['post', id],
        queryFn: () => fetchPostById(id),
        enabled: !!id,
        retry: false,
    })
}
