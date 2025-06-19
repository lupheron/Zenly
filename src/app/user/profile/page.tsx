"use client"
import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ButtonDefault from '@/src/components/Button/ButtonDefault';
import Image from 'next/image';
import UserComments from '@/src/components/Comments/UserComments';

const Profile = () => {
    return (
        <div>
            <div className='p-10 mt-25 bg-light-gray w-fit mx-auto rounded-2xl'>
                <div className='flex flex-col items-center '>
                    <Image
                        width={150}
                        height={150}
                        src={"/logo/black-logo-text.png"}
                        alt='Profile Picture'
                        className='rounded-full mt-5 mb-10'
                    />
                </div>
                <div className='flex flex-col gap-2 text-center'>
                    <h1 className='text-gray-600 text-5xl font-bold tracking-[1px]'>Suxrob Nuriddinov</h1>
                    <p className='text-lg'><LocationOnIcon className='text-black text-xl' /> Samarqand, O'zbekiston</p>
                    <div className='flex items-center gap-15 text-xl mt-15'>
                        <h2><InsertEmoticonIcon className='text-black text-xl' /> lupheron</h2>
                        <p><LocalPhoneIcon className='text-black text-xl' /> 50 883 99 11</p>
                        <p><VerifiedIcon className='text-black text-xl' /> Status: VIP</p>
                    </div>
                </div>
                <ButtonDefault
                    label='Tahrirlash'
                    onClick={() => console.log("Clicked")}
                    customClasses='w-full mt-10 cursor-pointer'
                />
            </div>
            <UserComments />
        </div>
    )
}

export default Profile