'use client'

import api from '@/src/utils/axios'
import { useMutation, useQuery } from '@tanstack/react-query'

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
    const res = await api.get(`/user/${user_id}`)
    return res.data as User
}

const editUser = async (data: Partial<User>) => {
    const id = Number(localStorage.getItem('user_id'))
    const res = await api.put(`/users/${id}`, data)
    return res.data as User
}

const deleteUser = async () => {
    const id = Number(localStorage.getItem('user_id'))
    const res = await api.delete(`/users/${id}`)
    return res.data
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
        retry: 3,
    })
}
