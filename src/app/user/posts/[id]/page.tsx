'use client'

import { useParams, useRouter } from 'next/navigation'
import Gallery from '@/src/components/gallery/Gallery'
import Rating from '@/src/components/Rating/Rating'
import React, { useState } from 'react'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import Features from '@/src/components/Features/Features'
import DeleteModal from '@/src/components/Modal/DeleteModal'
import { usePostById } from '@/src/hooks/posts/usePostsById'

const UserPostInfo = () => {
    const params = useParams()
    const router = useRouter()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    const banners = [
        { id: 1, title: 'Plyajdagi dam olish' },
        { id: 2, title: 'Wellness maskanlari' },
        { id: 3, title: 'Kabina zonalari' },
        { id: 4, title: 'Eko sayohatlar' },
    ]

    if (!params?.id) return null

    const { data: post, isLoading, error, deleteMutation } = usePostById(Number(params.id))

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

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !post) return <p>Xatolik yuz berdi yoki post topilmadi</p>

    const areaTitle = banners.find(b => b.id === post.area_id)?.title ?? 'Nomaʼlum tur'

    return (
        <>
            <div className="flex gap-10 mx-auto bg-white rounded-xl shadow-xl p-6 mt-10">
                <div className='w-150'>
                    <Gallery postId={post.id} mainImg={post.img} />
                </div>

                <div className="mt-5">
                    <h1 className="text-4xl text-dark-green font-bold mt-5">{post.title}</h1>
                    <p className="text-gray-700 text-sm mt-3">{post.small_description}</p>
                    <p className='text-gray-700 text-lg font-bold tracking-[1px] mt-5'>{post.description}</p>
                    <div className='mt-5'>
                        <h1 className='text-xl text-light-green font-bold tracking-[1px] mb-2'>Mavjud Bo'lgan Imkoniyatlar:</h1>
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
                            <span>Korilgan Soni:</span>
                            <h2 className="text-gray-500 mt-1">{post.members}</h2>
                        </div>
                    </div>
                    <ButtonDefault
                        label="Komentlarni ko'rish"
                        customClasses='!bg-orange-500 !rounded-lg !cursor-auto !text-sm mt-5 w-full'
                    />
                    <div className='flex gap-3 mt-10'>
                        <ButtonDefault
                            label='Tahrirlash'
                            onClick={() => router.push(`/user/posts/${post.id}/edit`)}
                            customClasses='w-full tracking-[1px] text-lg'
                        />
                        <ButtonDefault
                            label="O'chirish"
                            onClick={() => setDeleteModalOpen(true)}
                            customClasses='w-full tracking-[1px] text-lg bg-red-500 hover:bg-red-600 text-white'
                        />
                    </div>
                </div>
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
            />
        </>
    )
}


export default UserPostInfo
