// hooks/useLoginUser.ts
'use client'

import { useMutation } from '@tanstack/react-query'

const loginUser = async (data: { username: string; password: string }) => {
    const res = await fetch('http://zenlyserver.test/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })

    if (!res.ok) {
        throw new Error('Login failed')
    }

    return res.json()
}

export const useLoginUser = () => {
    return useMutation({ mutationFn: loginUser })
}
