import Image from 'next/image'
import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'
import Rating from '../Rating/Rating'

interface PostsCartProps {
    src: string,
    title: string,
    small_description: string,
    location: string,
    rating: number,
    price_daily: number,
    onClick: () => void,
    customClasses?: string
}

const PostsCart: React.FC<PostsCartProps> = ({
    src,
    title,
    small_description,
    location,
    rating,
    price_daily,
    onClick,
    customClasses = ''
}) => {
    const formatImageUrl = (imgPath: string | null | undefined): string => {
        if (!imgPath) return '/no-image.jpg';
        if (imgPath.startsWith('http')) return imgPath;
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        return `http://zenlyserver.test/${cleanPath}`;
    };

    const formattedSrc = formatImageUrl(src);

    return (
        <div className={`w-100 bg-white rounded-xl shadow p-4 ${customClasses}`}>
            <Image
                width={350}
                height={450}
                src={formattedSrc}
                alt='Post Image'
                className='w-full h-60 rounded-xl object-cover'
                unoptimized={process.env.NODE_ENV !== 'production'}
            />

            <div className='flex flex-col gap-2 mt-5 px-4'>
                <h2 className='text-xl font-bold'>{title}</h2>
                <p className='text-sm text-gray-700'>{small_description}</p>
                <p className='text-sm text-gray-600'>{location}</p>
                <div className='flex items-center gap-2'>
                    <Rating postId={rating} />
                    <span className='text-sm text-gray-600'>Ratings:</span>
                </div>
            </div>

            <div className='flex flex-col gap-10 bg-blue-50 rounded-lg px-4 py-3 mt-5'>
                <div>
                    <p className='text-sm text-gray-500'>From</p>
                    <h2 className='text-2xl font-bold text-blue-800'>${price_daily}</h2>
                </div>
                <div className='mt-3'>
                    <ButtonDefault
                        label="Batafsil"
                        onClick={onClick}
                        customClasses='w-full tracking-[2px]'
                    />
                </div>
            </div>
        </div>
    )
}

export default PostsCart