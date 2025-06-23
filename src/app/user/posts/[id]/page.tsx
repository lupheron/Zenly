'use client'

import { useParams } from 'next/navigation'
import Image from 'next/image'
import Rating from '@/src/components/Rating/Rating'
import React from 'react'
import { usePostById } from '@/src/hooks/posts/usePostsById'

const UserPostInfo = () => {
    const { id } = useParams()
    const { data: post, isLoading, error } = usePostById(Number(id))

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !post) return <p>Xatolik yuz berdi yoki post topilmadi</p>

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6 mt-10">
            <Image
                src={post.image || '/intro/intro1.jpg'}
                alt="Post Image"
                width={800}
                height={500}
                className="w-full h-[400px] object-cover rounded-lg"
            />

            <h1 className="text-3xl font-bold mt-5">{post.title}</h1>

            <p className="text-gray-700 text-lg mt-3">{post.description}</p>

            <div className="flex items-center justify-between mt-5">
                <div className="flex items-center gap-2">
                    <span className="text-gray-600 font-medium">Reyting:</span>
                    <Rating postId={post.id} />
                </div>
                <div>
                    <span className="text-gray-600 text-sm">Narxi:</span>
                    <h2 className="text-2xl font-bold text-blue-700">${post.price_daily}</h2>
                </div>
            </div>
        </div>
    )
}

export default UserPostInfo
