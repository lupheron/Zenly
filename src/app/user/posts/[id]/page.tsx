'use client'

import { useParams } from 'next/navigation'
import Gallery from '@/src/components/gallery/Gallery'
import Rating from '@/src/components/Rating/Rating'
import React from 'react'
import { usePostById } from '@/src/hooks/posts/usePostsById'

const UserPostInfo = () => {
    const params = useParams()

    if (!params?.id) return null

    const { data: post, isLoading, error } = usePostById(Number(params.id))

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !post) return <p>Xatolik yuz berdi yoki post topilmadi</p>

    return (
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-6 mt-10">
            <Gallery postId={post.id} mainImg={post.img} />
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
