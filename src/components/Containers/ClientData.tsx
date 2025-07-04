import Image from 'next/image'
import React, { useState } from 'react'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ButtonDefault from '../Button/ButtonDefault';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/hooks/users/useUser';
import AlertDefault from '../Alert/AlertDefault';
import DeleteModal from '../Modal/DeleteModal';

const ClientData = ({ openEditForm }) => {
    const { data, deleteUser } = useUser();
    const router = useRouter();
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
        <div>
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
                        onClick={openEditForm}
                        customClasses='w-full cursor-pointer'
                    />
                    <ButtonDefault
                        label="O'chirish"
                        onClick={() => setDeleteModalOpen(true)}
                        customClasses='w-full cursor-pointer !bg-red-700'
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
    );
};


export default ClientData