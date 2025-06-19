'use client'

import { useMutation } from '@tanstack/react-query'
import AlertDefault from '../components/Alert/AlertDefault';

const loginUser = async (data: { username: string; password: string }) => {
    const res = await fetch('http://zenlyserver.test/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    const responseData = await res.json()

    if (!res.ok) {
        throw new Error(responseData.message || 'Login failed')
    }

    return responseData
}

export const useLoginUser = () => {
    return useMutation({
        mutationFn: loginUser,
        onError: (error: Error) => {
            AlertDefault.error(error.message || "Login qilishda xatolik yuz berdi.")
        }
    })
}