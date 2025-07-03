import { useUserById } from '@/src/hooks/users/useUser'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface ProfileCartProps {
    user_id: number
}

const ProfileCart: React.FC<ProfileCartProps> = ({ user_id }) => {
    const { data } = useUserById(user_id)

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

            <div className='grid grid-cols-2 gap-y-3 gap-x-7'>
                <div>
                    <h2 className='text-lg font-bold tracking-[1px]'>{data.fullname}</h2>
                    <p className='text-gray-500'>{data.username}</p>
                </div>

                <div>
                    <Link href={`tel:${data.phone}`} className='text-blue-700'>{data.phone}</Link>
                    <h2>{data.address}</h2>
                </div>
            </div>
        </div>
    )
}

export default ProfileCart
