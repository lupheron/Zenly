'use client'

import { useMutation } from '@tanstack/react-query'

interface RegisterData {
    fullname: string;
    username: string;
    phone: string;
    address: string;
    password: string;
    type: number;
}

const registerUser = async (data: RegisterData) => {
    const res = await fetch('http://zenlyserver.test/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error('Failed to register user')
    }

    return res.json()
}

export const useRegisterUser = () => {
    return useMutation({ mutationFn: registerUser })
}
