"use client"
import React, { useState } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ButtonDefault from '@/src/components/Button/ButtonDefault';
import Image from 'next/image';
import PostsRatingCart from '@/src/components/Cart/PostsRatingCart';
import { useUser } from '@/src/hooks/users/useUser';
import { useRouter } from 'next/navigation';
import DeleteModal from '@/src/components/Modal/DeleteModal';
import AlertDefault from '@/src/components/Alert/AlertDefault';
import Loader from '@/src/components/Loader/Loader';
import SubscriptionCart from '@/src/components/Cart/SubscriptionCart';
import { useLanguage } from '@/src/contexts/LanguageContext';

import { getImageUrl } from '@/src/utils/axios';

const Profile = () => {
    const { t } = useLanguage();
    const { data, deleteUser } = useUser()
    const router = useRouter()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        deleteUser.mutate(undefined, {
            onSuccess: () => {
                AlertDefault.success(t('user.userDeleted'));
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                router.push('/login');
            },
            onError: () => {
                AlertDefault.error(t('user.deleteError'));
            }
        })
    }

    if (!data) {
        return <Loader />
    }

    return (
        <div className='flex flex-col 2xl:flex-row items-center gap-6 lg:gap-8 xl:gap-20 h-full mt-20'>
            {/* Profile Card */}
            <div className='w-full lg:w-156 xl:w-[700px] p-4 sm:p-6 lg:p-10 bg-white shadow-xl rounded-xl lg:rounded-2xl'>
                <div className='flex flex-col items-center'>
                    <Image
                        width={200}
                        height={200}
                        src={getImageUrl(data?.img)}
                        alt='Profile Picture'
                        className='rounded-full w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 mt-2 sm:mt-5 mb-6 sm:mb-10'
                    />
                </div>
                <div className='flex flex-col gap-2 sm:gap-3 text-center'>
                    <h1 className='text-gray-600 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-[1px]'>{data?.fullname}</h1>
                    <p className='text-sm sm:text-base lg:text-lg flex items-center justify-center gap-1'>
                        <LocationOnIcon className='text-black text-lg sm:text-xl' />
                        {data?.address || t('user.noLocation')}
                    </p>
                    <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-6 lg:gap-15 text-sm sm:text-base lg:text-xl mt-6 sm:mt-10 lg:mt-15 justify-center'>
                        <h2 className='flex items-center gap-1'>
                            <InsertEmoticonIcon className='text-black text-lg sm:text-xl' />
                            {data?.username}
                        </h2>
                        <p className='flex items-center gap-1'>
                            <LocalPhoneIcon className='text-black text-lg sm:text-xl' />
                            {data?.phone || t('user.noPhone')}
                        </p>
                        <p className='flex items-center gap-1'>
                            <VerifiedIcon className='text-black text-lg sm:text-xl' />
                            {data.vip_status || t('user.unknown')}
                        </p>
                    </div>
                </div>

                <div className='flex flex-col justify-center items-center sm:flex-row gap-3 sm:gap-5 mt-6 sm:mt-8 lg:mt-10'>
                    <ButtonDefault
                        label={t('common.edit')}
                        onClick={() => router.push('/user/profile/edit')}
                        customClasses='w-full sm:w-full cursor-pointer'
                    />
                    <ButtonDefault
                        label={t('common.delete')}
                        onClick={() => setDeleteModalOpen(true)}
                        customClasses='w-full sm:w-full cursor-pointer !bg-red-700'
                    />
                </div>
                <div className='flex justify-center mt-4'>
                    <ButtonDefault
                        label={t('user.logout')}
                        onClick={() => {
                            localStorage.removeItem("token");
                            localStorage.removeItem("user_id");
                            router.push('/');
                        }}
                        customClasses='w-full cursor-pointer !bg-gray-600 hover:!bg-gray-700'
                    />
                </div>
            </div>

            {/* Comments and Ratings Section */}
            <div className='flex flex-col gap-6 lg:gap-8 xl:gap-10 w-full lg:w-156 xl:w-[700px]'>
                <SubscriptionCart />
                <PostsRatingCart />
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                text={t('user.confirmDeleteUser')}
            />
        </div>
    )
}

export default Profile