'use client'

import { useUserComments } from '@/src/hooks/comments/useUserComments'
import React, { useEffect, useState } from 'react'
import AlertDefault from '../Alert/AlertDefault'

const UserComments = () => {
    const [userId, setUserId] = useState<string | null>(null)

    useEffect(() => {
        const id = localStorage.getItem('user_id')
        setUserId(id)
    }, [])

    const { data, isLoading, error } = useUserComments(userId)

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error) {
        AlertDefault.error("Fikrlarni yuklashda xatolik yuz berdi.")
        return <p>Xatolik mavjud.</p>
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-4">Mijozlar Fikri</h1>
            <div className="space-y-4">
                {data?.map((comment) => (
                    <div key={comment.id} className="border p-4 rounded">
                        <h2 className="font-semibold">{comment.postTitle}</h2>
                        <p className="italic">“{comment.text}”</p>
                        <p className="text-sm text-blue-600">Post: {comment.postTitle}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserComments
