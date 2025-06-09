import Image from 'next/image'
import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'

interface PostsCartProps {
    src: string,
    title: string,
    about: string,
    location: string,
    rating: number,
    rateNumber: number,
    price: number,
    onClick: () => void
}

const PostsCart: React.FC<PostsCartProps> = ({ src, title, about, location, rating, rateNumber, price, onClick }) => {
    return (
        <div className='flex items-center justify-between bg-white rounded-xl shadow p-4 w-full'>
            <Image
                width={250}
                height={350}
                src={src}
                alt=''
                className='h-50'
            />

            <div className='flex flex-col gap-3 w-[45%] px-4'>
                <h2 className='text-lg font-bold'>{title}</h2>
                <p className='text-sm text-gray-700'>{about}</p>
                <p className='text-sm text-gray-600'>{location}</p>
                <div className='flex items-center gap-2'>
                    <span className='bg-gray-200 px-2 py-1 rounded-md text-sm font-medium'>{rating}</span>
                    <span className='text-sm text-gray-600'>({rateNumber} ratings)</span>
                </div>
            </div>

            <div className='flex flex-col gap-10 bg-blue-50 rounded-lg px-4 py-3 w-[320px]'>
                <div>
                    <p className='text-sm text-gray-500'>From</p>
                    <h2 className='text-2xl font-bold text-blue-800'>${price}</h2>
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
