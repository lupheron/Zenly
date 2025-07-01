'use client'

import { useUserComments } from '@/src/hooks/comments/useUserComments'
import React, { useEffect, useState } from 'react'
import AlertDefault from '../Alert/AlertDefault'
import CommentCart from '../Cart/CommentCart'
import SwiperDefault from '../Swiper/SwiperDefault'

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
        <div className="bg-white p-6 rounded-xl shadow-xl w-150 h-75">
            <h1 className="text-2xl font-bold mb-4">Mijozlar Fikri</h1>
            <div className="space-y-4">
                <SwiperDefault
                    slidesPerView={1}
                    spaceBetween={30}
                    className='w-full'
                    autoplay={{ delay: 8000 }}
                    pagination={false}
                >
                    {data?.length === 0 ? (
                        <p>Sizda komentlar mavjud emas!</p>
                    ) : (
                        data?.map((comment, index) => (
                            <CommentCart
                                key={index}
                                comTitle={comment.postTitle}
                                comment={comment.text}
                                nameTitle={comment.name}
                            />
                        ))
                    )}
                </SwiperDefault>
            </div>
        </div>
    )
}

export default UserComments
