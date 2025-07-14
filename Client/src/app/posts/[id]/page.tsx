'use client'

import { useParams } from 'next/navigation'
import Gallery from '@/src/components/gallery/Gallery'
import Rating from '@/src/components/Rating/Rating'
import React, { useState } from 'react'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import Features from '@/src/components/Features/Features'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { usePostById } from '@/src/hooks/posts/usePostsById'
import { useUserComments } from '@/src/hooks/comments/useUserComments'
import ProfileCart from '@/src/components/Cart/Profile/ProfileCart'
import LargeContainer from '@/src/components/Containers/LargeContainer'
import ReusableModal from '@/src/components/Modal/ReusableModal'
import PostComments from '@/src/components/Forms/Comments/PostComments'
import SwiperDefault from '@/src/components/Swiper/SwiperDefault'
import CommentCart from '@/src/components/Cart/CommentCart'
import { usePostViews } from '@/src/hooks/postViews/usePostViews'

const PostInfo = () => {
    const params = useParams()
    const postId = Number(params?.id)
    const [openModal, setOpenModal] = useState(false)
    const [openCommentModal, setOpenCommentModal] = useState(false)

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
    const { data: comments, isLoading: commentsLoading } = useUserComments(postId.toString())
    const resolvedPostId = post?.id

    const { data: totalViews = 0 } = usePostViews(resolvedPostId ?? 0)

    if (!postId) return null
    if (isLoading) return <p className="text-center py-10">Yuklanmoqda...</p>
    if (error || !post) return <p className="text-center py-10 text-red-500">Xatolik yuz berdi yoki post topilmadi</p>

    const areaTitle = banners.find(b => b.id === post.area_id)?.title ?? 'Nomaʼlum tur'

    return (
        <div className='w-full md:w-[90%] lg:w-[85%] xl:w-[80%] mx-auto mt-8 md:mt-12 lg:mt-16 px-4 sm:px-6'>
            <div className='cursor-pointer flex items-center mb-4 md:mb-6' onClick={handleBack}>
                <ArrowBackIcon className="text-lg md:text-xl" />
                <ButtonDefault
                    label='Qaytish'
                    onClick={() => { }}
                    customClasses='bg-transparent !text-black tracking-[1px] text-base md:text-xl mb-0 hover:bg-transparent !px-0 !py-0 ml-2 mt-0'
                />
            </div>

            <div className='rounded-lg md:rounded-xl px-4 py-6 md:px-6 lg:px-8 xl:px-10 md:py-8 bg-light-gray'>
                <LargeContainer className="flex items-start flex-col xl:items-center xl:flex-row gap-6 md:gap-8 lg:gap-10 mx-auto">
                    <div className='w-full xl:w-[35%] flex flex-col gap-y-4 md:gap-y-6'>
                        <ProfileCart user_id={post.user_id} />
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

                        <div className='flex flex-col sm:flex-row items-center gap-3 md:gap-5 mt-6 md:mt-8'>
                            <ButtonDefault
                                label="Bron qilish"
                                customClasses='h-10 sm:h-12 !rounded-lg !cursor-pointer !text-xs sm:!text-sm mt-0 w-full'
                            />
                            <ButtonDefault
                                label="Komentlarni ko'rish"
                                customClasses='h-10 sm:h-12 !bg-orange-500 !rounded-lg !cursor-pointer !text-xs sm:!text-sm mt-0 w-full'
                                onClick={() => setOpenCommentModal(true)}
                            />
                        </div>
                        <ButtonDefault
                            label="Fikr qoldirish"
                            customClasses='w-full h-10 sm:h-12 mt-4 md:mt-5 !rounded-lg !cursor-pointer bg-purple-500 !text-xs sm:!text-sm'
                            onClick={() => setOpenModal(true)}
                        />
                    </div>
                </LargeContainer>
            </div>

            <ReusableModal
                open={openCommentModal}
                onClose={() => setOpenCommentModal(false)}
                title='Foydalanuvchilar fikri'
            >
                {commentsLoading ? (
                    <p className="text-center text-lg">Yuklanmoqda...</p>
                ) : (
                    <SwiperDefault
                        slidesPerView={1}
                        spaceBetween={30}
                        className='w-full mt-10'
                        autoplay={{}}
                        pagination={false}
                    >
                        {Array.isArray(comments) && comments.length > 0 ? (
                            comments.map((comment, index) => (
                                <CommentCart
                                    key={index}
                                    comment={comment.text}
                                    nameTitle={comment.name}
                                />
                            ))
                        ) : (
                            <p className="text-center text-lg">Hozircha hech qanday fikr mavjud emas.</p>
                        )}
                    </SwiperDefault>
                )}
            </ReusableModal>

            <ReusableModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title='Manzil haqida fikringiz'
            >
                <PostComments post_id={post.id} onClose={() => setOpenModal(false)} />
            </ReusableModal>
        </div>
    )
}

export default PostInfo
