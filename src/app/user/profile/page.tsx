"use client"
import React from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ButtonDefault from '@/src/components/Button/ButtonDefault';
import Image from 'next/image';
import UserComments from '@/src/components/Comments/UserComments';
import PostsRatingCart from '@/src/components/Cart/PostsRatingCart';
import { useUser } from '@/src/hooks/users/useUser';

const Profile = () => {
    const { data } = useUser()
    return (
        <div className='flex flex-row items-center gap-20 h-full'>
            <div className='p-10 w-fit h-full mx-auto bg-white shadow-xl rounded-2xl'>
                <div className='flex flex-col items-center '>
                    <Image
                        width={250}
                        height={250}
                        src={data?.profile_image || "/logo/black-logo-text.png"}
                        alt='Profile Picture'
                        className='rounded-full mt-5 mb-10'
                    />
                </div>
                <div className='flex flex-col gap-2 text-center'>
                    <h1 className='text-gray-600 text-5xl font-bold tracking-[1px]'>{data?.fullname}</h1>
                    <p className='text-lg'><LocationOnIcon className='text-black text-xl' /> {data?.address || "Joy ko'rsatilmagan"}</p>
                    <div className='flex items-center gap-15 text-xl mt-15 justify-center'>
                        <h2><InsertEmoticonIcon className='text-black text-xl' /> {data?.username}</h2>
                        <p><LocalPhoneIcon className='text-black text-xl' /> {data?.phone || "Telefon mavjud emas"}</p>
                        <p><VerifiedIcon className='text-black text-xl' /> Status: {data?.vip_status || "Standart"}</p>
                    </div>
                </div>
                <ButtonDefault
                    label='Tahrirlash'
                    onClick={() => console.log("Clicked")}
                    customClasses='w-full mt-10 cursor-pointer'
                />
            </div>
            <div className='flex flex-col gap-10'>
                <UserComments />
                <PostsRatingCart />
            </div>
        </div>
    )
}

export default Profile