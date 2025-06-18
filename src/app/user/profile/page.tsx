"use client"
import React from 'react'
import PersonIcon from '@mui/icons-material/Person';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ButtonDefault from '@/src/components/Button/ButtonDefault';

const Profile = () => {
    return (
        <div>
            <div className='p-10 bg-light-gray w-fit rounded-2xl'>
                <div className='flex flex-col gap-2 text-xl'>
                    <h1><PersonIcon className='text-black' /> Suxrob Nuriddinov</h1>
                    <h2><InsertEmoticonIcon className='text-black' /> lupheron</h2>
                    <p><LocalPhoneIcon className='text-black' /> 50 883 99 11</p>
                    <p><LocationOnIcon className='text-black' /> Samarqand, O'zbekiston</p>
                    <p><VerifiedIcon className='text-black' /> Status: VIP</p>
                </div>
                <ButtonDefault
                    label='Edit'
                    onClick={() => console.log("Clicked")}
                    customClasses='w-full mt-10'
                />
            </div>
        </div>
    )
}

export default Profile