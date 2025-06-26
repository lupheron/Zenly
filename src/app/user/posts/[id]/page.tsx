'use client'

import { useParams } from 'next/navigation'
import Gallery from '@/src/components/gallery/Gallery'
import Rating from '@/src/components/Rating/Rating'
import React from 'react'
import { usePostById } from '@/src/hooks/posts/usePostsById'
import ButtonDefault from '@/src/components/Button/ButtonDefault'

const UserPostInfo = () => {
    const params = useParams()

    if (!params?.id) return null

    const { data: post, isLoading, error } = usePostById(Number(params.id))

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !post) return <p>Xatolik yuz berdi yoki post topilmadi</p>

    return (
        <div className="flex gap-20 mx-auto bg-white rounded-xl shadow-xl p-6 mt-10">
            <Gallery postId={post.id} mainImg={post.img} />

            <div className="mt-5">
                <h1 className="text-4xl font-bold mt-5">{post.title}</h1>
                <p className="text-gray-700 text-sm mt-3">{post.description}</p>
                <p className='text-gray-700 text-lg font-bold tracking-[1px] mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut tempora culpa repellat neque, fugit minus, ipsam quos tenetur laborum nulla illo. Iure ullam blanditiis neque consectetur nemo mollitia doloribus vero.</p>
                <div className="gap-2 mt-10">
                    <span className="text-gray-600 text-lg font-medium">Reyting:</span>
                    <Rating postId={post.id} />
                </div>
                <div className='mt-3'>
                    <span className="text-gray-600 text-lg">Narxi:</span>
                    <h2 className="text-3xl font-bold text-blue-700 mt-1">${post.price_daily}</h2>
                </div>
                <div className='flex gap-3 mt-10'>
                    <ButtonDefault
                        label='Tahrirlash'
                        onClick={() => console.log('Edit post clicked')}
                        customClasses='w-full tracking-[1px] text-lg'
                    />
                    <ButtonDefault 
                        label="O'chirish"
                        onClick={() => console.log('Delete post clicked')}
                        customClasses='w-full tracking-[1px] text-lg bg-red-500 hover:bg-red-600 text-white'
                    />
                </div>
            </div>
        </div>
    )
}

export default UserPostInfo
