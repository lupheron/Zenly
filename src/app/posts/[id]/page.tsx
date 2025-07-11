'use client'

import { useParams } from 'next/navigation'
import Gallery from '@/src/components/gallery/Gallery'
import Rating from '@/src/components/Rating/Rating'
import React, { useState } from 'react'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import Features from '@/src/components/Features/Features'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { usePostById } from '@/src/hooks/posts/usePostsById'
import ProfileCart from '@/src/components/Cart/Profile/ProfileCart'
import LargeContainer from '@/src/components/Containers/LargeContainer'
import ReusableModal from '@/src/components/Modal/ReusableModal'
import PostComments from '@/src/components/Forms/Comments/PostComments'

const PostInfo = () => {
    const params = useParams()
    const postId = Number(params?.id)
    const [openModal, setOpenModal] = useState(false)

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
        <div className='w-[90%] xl:w-[80%] mx-auto mt-45'>
            <div className='cursor-pointer flex items-center' onClick={handleBack}>
                <ArrowBackIcon />
                <ButtonDefault
                    label='Qaytish'
                    onClick={() => { }}
                    customClasses='bg-transparent !text-black tracking-[1px] text-xl mb-5 hover:bg-transparent !px-0 !py-0 ml-2 mt-5'
                />
            </div>
            <div className='rounded-xl px-2 xl:px-10 py-10 bg-light-gray'>
                <LargeContainer className="flex items-center flex-col xl:flex-row gap-10 mx-auto">
                    <div className='xl:w-150 flex flex-col gap-y-5'>
                        <ProfileCart user_id={post.user_id} />
                        <Gallery postId={post.id} mainImg={post.img} />
                    </div>
                    <div className="mt-5 w-200">
                        <h1 className="text-4xl text-dark-green font-bold mt-5">{post.title}</h1>
                        <p className="text-gray-700 text-sm mt-3">{post.small_description}</p>
                        <p className='text-gray-700 text-md xl:text-lg font-bold tracking-[1px] mt-5'>{post.description}</p>
                        <div className='mt-5'>
                            <h1 className='text-xl text-light-green font-bold tracking-[1px] mb-2'>Mavjud Bo&apos;lgan Imkoniyatlar:</h1>
                            <Features postId={post.id} />
                        </div>
                        <div className='grid grid-cols-2 gap-x-20 gap-y-3 mt-10 text-md xl:text-xl'>
                            <div className="flex flex-col xl:flex-row lg:flex-row xl:items-center lg:items-center gap-3">
                                <span className="font-medium">Reyting:</span>
                                <Rating postId={post.id} />
                            </div>
                            <div className='flex flex-col xl:flex-row lg:flex-row xl:items-center lg:items-center gap-3'>
                                <span className='text-bold tracking-[1px]'>Narxi:</span>
                                <h2 className="text-gray-500 mt-1">${post.price_daily}</h2>
                            </div>
                            <div className='flex flex-col xl:flex-row lg:flex-row xl:items-center lg:items-center gap-3'>
                                <span className='text-bold tracking-[1px]'>Manzil:</span>
                                <h2 className="text-gray-500 mt-1">{post.location}</h2>
                            </div>
                            <div className='flex flex-col xl:flex-row lg:flex-row xl:items-center lg:items-center gap-3'>
                                <span className='text-bold tracking-[1px]'>Odam Soni:</span>
                                <h2 className="text-gray-500 mt-1">{post.members}</h2>
                            </div>
                            <div className='flex flex-col xl:flex-row lg:flex-row xl:items-center lg:items-center gap-3'>
                                <span className='text-bold tracking-[1px]'>Maskan turi:</span>
                                <h2 className="text-gray-500 mt-1">{areaTitle}</h2>
                            </div>
                            <div className='flex flex-col xl:flex-row lg:flex-row xl:items-center lg:items-center gap-3'>
                                <span className='text-bold tracking-[1px]'>Ko&apos;rilgan Soni:</span>
                                <h2 className="text-gray-500 mt-1">{post.clicked}</h2>
                            </div>
                        </div>
                        <div className='flex items-center gap-5'>
                            <ButtonDefault
                                label="Bron qilish"
                                customClasses='h-12 !rounded-lg !cursor-pointer !text-sm mt-5 w-full'
                            />
                            <ButtonDefault
                                label="Komentlarni ko'rish"
                                customClasses='h-12 !bg-orange-500 !rounded-lg !cursor-pointer !text-sm mt-5 w-full'
                            />
                        </div>
                        <ButtonDefault
                            label="Fikr qoldirish"
                            customClasses='w-full h-12 mt-5 !rounded-lg !cursor-pointer bg-purple-500'
                            onClick={() => setOpenModal(true)}
                        />
                    </div>
                </LargeContainer>
            </div>

            <ReusableModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title='Manzil haqida fikringiz'
            >
                <PostComments post_id={post.id} onClose={() => setOpenModal(false)} />
            </ReusableModal>
        </div >
    )
}

export default PostInfo
