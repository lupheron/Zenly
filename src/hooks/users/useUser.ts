'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import AlertDefault from '@/src/components/Alert/AlertDefault'

export interface User {
    id: number
    fullname: string
    username: string
    phone: string
    address: string
    img: string
    type: number
    vip_status: string
}

export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const fetchUserById = async (user_id: number): Promise<User> => {
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

    return responseData as User
}

const editUser = async (data: Partial<User>) => {
    const id = Number(localStorage.getItem('user_id'))
    const res = await fetch(`http://zenlyserver.test/api/users/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (res.status === 409) {
        throw new ApiError("USERNAME_CONFLICT", 409)
    }

    if (!res.ok) {
        throw new ApiError("GENERAL_ERROR", res.status)
    }

    return res.json() as Promise<User>
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