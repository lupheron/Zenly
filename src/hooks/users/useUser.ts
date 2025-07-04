'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'

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
        throw new Error('Failed to fetch user')
    }

    return responseData
}

const editUser = async (data: any) => {
    const id = Number(localStorage.getItem('user_id'))
    const res = await fetch(`http://zenlyserver.test/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error('Failed to edit user')
    }

    return res.json()
}

const deleteUser = async () => {
    const id = Number(localStorage.getItem('user_id'))
    const res = await fetch(`http://zenlyserver.test/api/users/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!res.ok) {
        AlertDefault.error("Foydalanuvchini o'chirishda xatolik yuz berdi.")
        throw new Error('Failed to delete user')
    }

    return res.json()
}


export const useUser = () => {
    const id = typeof window !== 'undefined' ? Number(localStorage.getItem('user_id')) : null

    const query = useQuery({
        queryKey: ['user', id],
        queryFn: () => fetchUserById(id!),
        enabled: !!id,
        retry: false,
    })

    const mutation = useMutation({ mutationFn: editUser })
    const deleteMutation = useMutation({ mutationFn: deleteUser })

    return { ...query, updateUser: mutation, deleteUser: deleteMutation }
}

export const useUserById = (user_id: number) => {
    return useQuery({
        queryKey: ['user', user_id],
        queryFn: () => fetchUserById(user_id),
        enabled: !!user_id,
        retry: false,
    })
}