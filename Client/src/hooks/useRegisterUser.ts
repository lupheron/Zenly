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

export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.status = status
    }
}

const registerUser = async (data: RegisterData) => {
    const res = await fetch('http://zenlyserver.test/api/register', {
        method: 'POST',
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

    return res.json()
}

export const useRegisterUser = () => {
    return useMutation({ mutationFn: registerUser })
}
