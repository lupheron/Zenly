'use client'

import { useMutation } from '@tanstack/react-query'

const registerUser = async (data: any) => {
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



// const registerClient = async (data: any) => {
//     const res = await fetch(`${API}/register`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })

//     if (!res.ok) {
//         throw new Error('Failed to register client')
//     }

//     return res.json()
// }

export const useRegisterUser = () => {
    return useMutation({ mutationFn: registerUser })
}

// export const useRegisterClient = () => {
//     return useMutation({ mutationFn: registerClient })
// }
