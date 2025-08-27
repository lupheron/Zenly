import { useBasicUserInfo } from '@/src/hooks/users/useBasicUserInfo'
import Image from 'next/image'
import React from 'react'

interface ProfileCartProps {
    user_id: number
}

const ProfileCart: React.FC<ProfileCartProps> = ({ user_id }) => {
    const { data } = useBasicUserInfo(user_id)

    if (!data) return null

    return (
        <div className='flex items-center gap-5'>
            <Image
                width={80}
                height={80}
                src={data.img}
                alt='User profile image'
                className='rounded-[50%]'
            />

            <div className='grid grid-cols-1 gap-y-3'>
                <div>
                    <h2 className='text-lg font-bold tracking-[1px]'>{data.fullname}</h2>
                    <p className='text-gray-500'>{data.username}</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileCart
