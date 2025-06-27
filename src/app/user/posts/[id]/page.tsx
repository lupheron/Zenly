'use client'

import { useParams, useRouter } from 'next/navigation'
import Gallery from '@/src/components/gallery/Gallery'
import Rating from '@/src/components/Rating/Rating'
import React from 'react'
import { usePostById } from '@/src/hooks/posts/usePostsById'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import Features from '@/src/components/Features/Features'

const UserPostInfo = () => {
    const params = useParams()
    const router = useRouter()

    if (!params?.id) return null

    const { data: post, isLoading, error } = usePostById(Number(params.id))

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !post) return <p>Xatolik yuz berdi yoki post topilmadi</p>

    return (
        <div className="flex gap-20 mx-auto bg-white rounded-xl shadow-xl p-6 mt-10">
            <Gallery postId={post.id} mainImg={post.img} />

            <div className="mt-5">
                <h1 className="text-4xl text-dark-green font-bold mt-5">{post.title}</h1>
                <p className="text-gray-700 text-sm mt-3">{post.description}</p>
                <p className='text-gray-700 text-lg font-bold tracking-[1px] mt-5'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut tempora culpa repellat neque, fugit minus, ipsam quos tenetur laborum nulla illo. Iure ullam blanditiis neque consectetur nemo mollitia doloribus vero.</p>
                <div className='mt-5'>
                    <h1 className='text-xl text-light-green font-bold tracking-[1px] mb-2'>Mavjud Bo'lgan Imkoniyatlar:</h1>
                    <Features postId={post.id} />
                </div>
                <div className='flex gap-10 mt-10 text-2xl'>
                    <div className="flex gap-3 items-center">
                        <span className="text-gray-600 font-medium">Reyting:</span>
                        <Rating postId={post.id} />
                    </div>
                    <div className='flex gap-3 items-center'>
                        <span className="text-gray-600">Narxi:</span>
                        <h2 className="font-bold text-blue-700 mt-1">${post.price_daily}</h2>
                    </div>
                </div>
                <div className='flex gap-3 mt-10'>
                    <ButtonDefault
                        label='Tahrirlash'
                        onClick={() => router.push(`/user/posts/${post.id}/edit`)}
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
