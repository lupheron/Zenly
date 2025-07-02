'use client'

import { useParams } from 'next/navigation'
import Gallery from '@/src/components/gallery/Gallery'
import Rating from '@/src/components/Rating/Rating'
import React from 'react'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import Features from '@/src/components/Features/Features'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { usePostById } from '@/src/hooks/posts/usePostsById'

const PostInfo = () => {
    const params = useParams()
    const postId = Number(params?.id)

    const banners = [
        { id: 1, title: 'Plyajdagi dam olish' },
        { id: 2, title: 'Wellness maskanlari' },
        { id: 3, title: 'Kabina zonalari' },
        { id: 4, title: 'Eko sayohatlar' },
    ]

    const handleBack = () => {
        window.history.back()
    }

    const { data: post, isLoading, error } = usePostById(postId)

    if (!postId) return null
    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !post) return <p>Xatolik yuz berdi yoki post topilmadi</p>

    const areaTitle = banners.find(b => b.id === post.area_id)?.title ?? 'Nomaʼlum tur'

    return (
        <div className='w-[80%] mx-auto mt-45'>
            <div className='cursor-pointer flex items-center' onClick={handleBack}>
                <ArrowBackIcon />
                <ButtonDefault
                    label='Qaytish'
                    onClick={() => { }}
                    customClasses='bg-transparent !text-black tracking-[1px] text-xl mb-5 hover:bg-transparent !px-0 !py-0 ml-2 mt-5'
                />
            </div>
            <div className='rounded-xl px-10 py-10 bg-light-gray'>
                <div className="flex gap-10 mx-auto bg-white rounded-xl shadow-xl p-6">
                    <div className='w-150'>
                        <Gallery postId={post.id} mainImg={post.img} />
                    </div>
                    <div className="mt-5">
                        <h1 className="text-4xl text-dark-green font-bold mt-5">{post.title}</h1>
                        <p className="text-gray-700 text-sm mt-3">{post.small_description}</p>
                        <p className='text-gray-700 text-lg font-bold tracking-[1px] mt-5'>{post.description}</p>
                        <div className='mt-5'>
                            <h1 className='text-xl text-light-green font-bold tracking-[1px] mb-2'>Mavjud Bo&apos;lgan Imkoniyatlar:</h1>
                            <Features postId={post.id} />
                        </div>
                        <div className='grid grid-cols-2 gap-x-20 gap-y-3 mt-10 text-xl'>
                            <div className="flex gap-3 items-center">
                                <span className=" font-medium">Reyting:</span>
                                <Rating postId={post.id} />
                            </div>
                            <div className='flex gap-3 items-center'>
                                <span>Narxi:</span>
                                <h2 className="text-gray-500 mt-1">${post.price_daily}</h2>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <span>Manzil:</span>
                                <h2 className="text-gray-500 mt-1">{post.location}</h2>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <span>Odam Soni:</span>
                                <h2 className="text-gray-500 mt-1">{post.members}</h2>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <span>Maskan turi:</span>
                                <h2 className="text-gray-500 mt-1">{areaTitle}</h2>
                            </div>
                            <div className='flex gap-3 items-center'>
                                <span>Ko&apos;rilgan Soni:</span>
                                <h2 className="text-gray-500 mt-1">{post.clicked}</h2>
                            </div>
                        </div>
                        <ButtonDefault
                            label="Komentlarni ko'rish"
                            customClasses='!bg-orange-500 !rounded-lg !cursor-auto !text-sm mt-5 w-full'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostInfo
