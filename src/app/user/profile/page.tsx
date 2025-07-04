"use client"
import React, { useState } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ButtonDefault from '@/src/components/Button/ButtonDefault';
import Image from 'next/image';
import UserComments from '@/src/components/Comments/UserComments';
import PostsRatingCart from '@/src/components/Cart/PostsRatingCart';
import { useUser } from '@/src/hooks/users/useUser';
import { useRouter } from 'next/navigation';
import DeleteModal from '@/src/components/Modal/DeleteModal';
import AlertDefault from '@/src/components/Alert/AlertDefault';

const Profile = () => {
    const { data, deleteUser } = useUser()
    const router = useRouter()
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleDelete = () => {
        deleteUser.mutate(undefined, {
            onSuccess: () => {
                AlertDefault.success("Foydalanuvchi muvaffaqiyatli o'chirildi!");
                localStorage.removeItem("token");
                localStorage.removeItem("user_id");
                router.push('/');
                window.location.reload();
            },
            onError: () => {
                AlertDefault.error("Foydalanuvchini o'chirishda xatolik yuz berdi.");
            }
        })
    }

    return (
        <div className='flex flex-row items-center gap-20 h-full'>
            <div className='p-10 w-fit h-fit mx-auto bg-white shadow-xl rounded-2xl'>
                <div className='flex flex-col items-center '>
                    <Image
                        width={250}
                        height={250}
                        src={data?.img}
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

                <div className='flex gap-x-5 mt-5'>
                    <ButtonDefault
                        label='Tahrirlash'
                        onClick={() => router.push('/user/profile/edit')}
                        customClasses='w-full mt-10 cursor-pointer'
                    />
                    <ButtonDefault
                        label="O'chirish"
                        onClick={() => setDeleteModalOpen(true)}
                        customClasses='w-full mt-10 cursor-pointer !bg-red-700'
                    />
                </div>
            </div>
            <div className='flex flex-col gap-10'>
                <UserComments />
                <PostsRatingCart />
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

export default Profile