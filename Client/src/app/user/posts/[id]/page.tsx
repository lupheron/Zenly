'use client'

import { useParams, useRouter } from 'next/navigation'
import Gallery from '@/src/components/gallery/Gallery'
import Rating from '@/src/components/Rating/Rating'
import React, { useState } from 'react'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import Features from '@/src/components/Features/Features'
import DeleteModal from '@/src/components/Modal/DeleteModal'
import { usePostById } from '@/src/hooks/posts/usePostsById'
import { usePostViews } from '@/src/hooks/postViews/usePostViews'
import LargeContainer from '@/src/components/Containers/LargeContainer'

const UserPostInfo = () => {
    const params = useParams()
    const router = useRouter()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const postId = Number(params?.id) || 0

    const banners = [
        { id: 1, title: 'Plyajdagi dam olish' },
        { id: 2, title: 'Wellness maskanlari' },
        { id: 3, title: 'Kabina zonalari' },
        { id: 4, title: 'Eko sayohatlar' },
    ]

    const { data: post, isLoading, error, deleteMutation } = usePostById(postId)
    const resolvedPostId = post?.id

    const { data: totalViews = 0 } = usePostViews(resolvedPostId ?? 0)

    const handleDelete = () => {
        deleteMutation.mutate(undefined, {
            onSuccess: () => {
                setDeleteModalOpen(false)
                router.push('/user/posts')
            },
            onError: () => {
                alert("O'chirishda xatolik yuz berdi.")
            }
        })
    }

    if (!postId) return null
    if (isLoading) return <p className="text-center py-10">Yuklanmoqda...</p>
    if (error || !post) return <p className="text-center py-10 text-red-500">Xatolik yuz berdi yoki post topilmadi</p>

    const areaTitle = banners.find(b => b.id === post.area_id)?.title ?? 'Nomaʼlum tur'

    return (
        <>
            <div className='w-full mx-auto mt-8 md:mt-12 lg:mt-16'>
                <div className='rounded-lg md:rounded-xl px-4 py-6 md:px-6 lg:px-8 xl:px-10 md:py-8 bg-light-gray'>
                    <LargeContainer className="flex items-start flex-col xl:items-center xl:flex-row gap-6 md:gap-8 lg:gap-10 mx-auto">
                        <div className='w-full xl:w-[35%] flex flex-col gap-y-4 md:gap-y-6'>
                            <Gallery postId={post.id} mainImg={post.img} />
                        </div>

                        <div className="w-full xl:w-[65%] mt-4 md:mt-6 lg:mt-0">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl text-dark-green font-bold">{post.title}</h1>
                            <p className="text-gray-700 text-sm md:text-base mt-2 md:mt-3">{post.small_description}</p>
                            <p className='text-gray-700 text-base md:text-lg font-bold tracking-[0.5px] md:tracking-[1px] mt-4 md:mt-5'>{post.description}</p>

                            <div className='mt-4 md:mt-6'>
                                <h1 className='text-lg md:text-xl text-light-green font-bold tracking-[0.5px] md:tracking-[1px] mb-2'>Mavjud Bo&apos;lgan Imkoniyatlar:</h1>
                                <Features postId={post.id} />
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8 lg:mt-10'>
                                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                                    <span className="font-medium text-sm md:text-base">Reyting:</span>
                                    <Rating postId={post.id} />
                                </div>
                                <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                                    <span className='font-medium text-sm md:text-base'>Narxi:</span>
                                    <span className="text-gray-500 text-sm md:text-base">${post.price_daily}</span>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                                    <span className='font-medium text-sm md:text-base'>Manzil:</span>
                                    <span className="text-gray-500 text-sm md:text-base">{post.location}</span>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                                    <span className='font-medium text-sm md:text-base'>Odam Soni:</span>
                                    <span className="text-gray-500 text-sm md:text-base">{post.members}</span>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                                    <span className='font-medium text-sm md:text-base'>Maskan turi:</span>
                                    <span className="text-gray-500 text-sm md:text-base">{areaTitle}</span>
                                </div>
                                <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                                    <span className='font-medium text-sm md:text-base'>Ko&apos;rilgan Soni:</span>
                                    <span className="text-gray-500 text-sm md:text-base">{totalViews}</span>
                                </div>
                            </div>

                            <ButtonDefault
                                label="Komentlarni ko'rish"
                                customClasses='h-10 sm:h-12 !bg-orange-500 !rounded-lg !cursor-auto !text-xs sm:!text-sm mt-6 md:mt-8 w-full'
                            />

                            <div className='flex flex-col sm:flex-row gap-3 md:gap-5 mt-4 md:mt-5'>
                                <ButtonDefault
                                    label='Tahrirlash'
                                    onClick={() => router.push(`/user/posts/${post.id}/edit`)}
                                    customClasses='h-10 sm:h-12 w-full tracking-[0.5px] md:tracking-[1px] text-sm md:text-base !rounded-lg'
                                />
                                <ButtonDefault
                                    label="O'chirish"
                                    onClick={() => setDeleteModalOpen(true)}
                                    customClasses='h-10 sm:h-12 w-full tracking-[0.5px] md:tracking-[1px] text-sm md:text-base bg-red-500 hover:bg-red-600 text-white !rounded-lg'
                                />
                            </div>
                        </div>
                    </LargeContainer>
                </div>
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                text={"Haqiqatan ham ushbu postni o'chirmoqchimisiz?"}
            />
        </>
    )
}

export default UserPostInfo