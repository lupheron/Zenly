import Image from 'next/image'
import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'
import Rating from '../Rating/Rating'

interface UsersPostsProps {
    src: string;
    title: string;
    description: string;
    location: string;
    rating: number;
    price: number;
    onClick: () => void;
    customClasses?: string;
    postOwnerId?: string;
    postId?: number;
}

const UsersPosts: React.FC<UsersPostsProps> = ({
    src, title, description, location, rating, price,
    onClick, customClasses = '', postId
}) => {

    const handleReadMoreClick = () => {
        const loggedInUserId = localStorage.getItem('user_id');

        if (!loggedInUserId && postId) {
            fetch(`http://zenlyserver.test/api/posts/${postId}/increase-interest`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ increaseClicked: true })
            });
        }

        onClick();
    };


    return (
        <div className={`w-100 flex flex-col justify-between bg-white rounded-xl shadow p-4 ${customClasses}`}>
            <Image
                width={350}
                height={450}
                src={src}
                alt=''
                className='w-full h-60 rounded-xl'
            />
            <div className='flex flex-col justify-between gap-2 mt-5 px-4'>
                <h2 className='text-xl font-bold'>{title}</h2>
                <p className='text-sm text-gray-700'>{description}</p>
                <p className='text-sm text-gray-600'>{location}</p>
                <div className='flex items-center gap-2'>
                    <Rating postId={rating} />
                </div>
            </div>
            <div className='flex flex-col gap-10 bg-blue-50 rounded-lg px-4 py-3 mt-5'>
                <div>
                    <p className='text-sm text-gray-500'>From</p>
                    <h2 className='text-2xl font-bold text-blue-800'>${price}</h2>
                </div>
                <div className='mt-3'>
                    <ButtonDefault
                        label="Batafsil"
                        onClick={handleReadMoreClick}
                        customClasses='w-full tracking-[2px]'
                    />
                </div>
            </div>
        </div>
    );
};

export default UsersPosts;