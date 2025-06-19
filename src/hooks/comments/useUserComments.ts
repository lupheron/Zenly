'use client'

import { useQuery } from '@tanstack/react-query'

interface Comment {
    id: number
    name: string
    text: string
    postTitle: string
}

const fetchUserComments = async (user_id: string): Promise<Comment[]> => {
    const res = await fetch(`http://zenlyserver.test/api/comments/${user_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (!res.ok) {
        throw new Error('Failed to fetch comments')
    }

    return res.json()
}

export const useUserComments = (user_id: string | null) => {
    return useQuery({
        queryKey: ['user-comments', user_id],
        queryFn: () => fetchUserComments(user_id!),
        enabled: !!user_id,
        retry: false
    })
}
