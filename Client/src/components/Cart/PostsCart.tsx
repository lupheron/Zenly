import Image from 'next/image'
import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'
import Rating from '../Rating/Rating'
import api from '@/src/utils/axios'

interface PostsCartProps {
    src: string
    title: string
    small_description: string
    location: string
    rating: number
    price_daily: number
    onClick: () => void
    customClasses?: string
    postId?: number
}

const PostsCart: React.FC<PostsCartProps> = ({
    src,
    title,
    small_description,
    location,
    rating,
    price_daily,
    onClick,
    customClasses = '',
    postId,
}) => {
    const formatImageUrl = (imgPath: string | null | undefined): string => {
        if (!imgPath) return '/no-image.jpg'
        if (imgPath.startsWith('http')) return imgPath
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
        return `http://zenlyserver.test/${cleanPath}`
    }

    const formattedSrc = formatImageUrl(src)

    const handleReadMoreClick = async () => {
        try {
            if (postId) {
                await api.put(`/posts/${postId}/increase-interest`)
            }
        } catch (error) {
            console.error("Post ko'rishlarini oshirishda xatolik:", error)
        } finally {
            onClick()
        }
    }

    return (
        <div className={`w-full bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ${customClasses}`}>
            <div className="relative w-full aspect-[4/3]">
                <Image
                    src={formattedSrc}
                    alt='Post Image'
                    fill
                    className='rounded-t-xl object-cover'
                    unoptimized={process.env.NODE_ENV !== 'production'}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>

            <div className='p-4 sm:p-5'>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-lg sm:text-xl font-bold line-clamp-2'>{title}</h2>
                    <p className='text-xs sm:text-sm text-gray-600 line-clamp-2'>{small_description}</p>
                    <p className='text-xs sm:text-sm text-gray-500 flex items-center gap-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                    </p>
                    <div className='flex items-center gap-2 mt-1'>
                        <Rating postId={rating} />
                    </div>
                </div>

                <div className='flex flex-col gap-4 bg-blue-50 rounded-lg px-4 py-3 mt-4'>
                    <div>
                        <p className='text-xs sm:text-sm text-gray-500'>Narxdan</p>
                        <h2 className='text-xl sm:text-2xl font-bold text-blue-800'>${price_daily}</h2>
                    </div>
                    <ButtonDefault
                        label="Batafsil"
                        onClick={handleReadMoreClick}
                        customClasses='w-full tracking-[1px] text-sm sm:text-base py-2 sm:py-2.5'
                    />
                </div>
            </div>
        </div>
    )
}

export default PostsCart