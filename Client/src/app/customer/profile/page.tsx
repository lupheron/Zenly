"use client"
import React, { useState } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ButtonDefault from '@/src/components/Button/ButtonDefault';
import Image from 'next/image';
import { useUser } from '@/src/hooks/users/useUser';
import { useRouter } from 'next/navigation';
import DeleteModal from '@/src/components/Modal/DeleteModal';
import AlertDefault from '@/src/components/Alert/AlertDefault';
import Loader from '@/src/components/Loader/Loader';

const CustomerProfile = () => {
    const { data, deleteUser } = useUser()
    const router = useRouter()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        deleteUser.mutate(undefined, {
            onSuccess: () => {
                AlertDefault.success("Foydalanuvchi muvaffaqiyatli o'chirildi!");
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                router.push('/login');
            },
            onError: () => {
                AlertDefault.error("Foydalanuvchini o'chirishda xatolik yuz berdi.");
            }
        })
    }

    if (!data) {
        return <Loader />
    }

    return (
        <div className='flex flex-col 2xl:flex-row items-center justify-center gap-6 lg:gap-8 xl:gap-20 h-full mt-20'>
            {/* Profile Card */}
            <div className='w-full lg:w-156 xl:w-[700px] p-4 sm:p-6 lg:p-10 bg-white shadow-xl rounded-xl lg:rounded-2xl'>
                <div className='flex flex-col items-center'>
                    <Image
                        width={200}
                        height={200}
                        src={data?.img && data.img.trim() !== "" ? data.img : "/logo/profile-default.png"}
                        alt='Profile Picture'
                        className='rounded-full w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 mt-2 sm:mt-5 mb-6 sm:mb-10'
                    />
                </div>
                <div className='flex flex-col gap-2 sm:gap-3 text-center'>
                    <h1 className='text-gray-600 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-[1px]'>{data?.fullname}</h1>
                    <p className='text-sm sm:text-base lg:text-lg flex items-center justify-center gap-1'>
                        <LocationOnIcon className='text-black text-lg sm:text-xl' />
                        {data?.address || "Joy ko'rsatilmagan"}
                    </p>
                    <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-6 lg:gap-15 text-sm sm:text-base lg:text-xl mt-6 sm:mt-10 lg:mt-15 justify-center'>
                        <h2 className='flex items-center gap-1'>
                            <InsertEmoticonIcon className='text-black text-lg sm:text-xl' />
                            {data?.username}
                        </h2>
                        <p className='flex items-center gap-1'>
                            <LocalPhoneIcon className='text-black text-lg sm:text-xl' />
                            {data?.phone || "Telefon mavjud emas"}
                        </p>
                        <p className='flex items-center gap-1'>
                            <VerifiedIcon className='text-black text-lg sm:text-xl' />
                            {data.vip_status || "Noma'lum"}
                        </p>
                    </div>
                </div>

                <div className='flex flex-col justify-center items-center sm:flex-row gap-3 sm:gap-5 mt-6 sm:mt-8 lg:mt-10'>
                    <ButtonDefault
                        label='Tahrirlash'
                        onClick={() => router.push('/customer/profile/edit')}
                        customClasses='w-full sm:w-full cursor-pointer'
                    />
                    <ButtonDefault
                        label="O'chirish"
                        onClick={() => setDeleteModalOpen(true)}
                        customClasses='w-full sm:w-full cursor-pointer !bg-red-700'
                    />
                </div>
            </div>

            <DeleteModal
                open={deleteModalOpen}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                text={"Siz haqiqatdan ham ushbu foydalanuvchini o'chirmoqchimisiz?"}
            />
        </div>
    )
}

export default CustomerProfile