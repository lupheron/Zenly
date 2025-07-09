import Image from 'next/image';
import React, { useState } from 'react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import VerifiedIcon from '@mui/icons-material/Verified';
import ButtonDefault from '../Button/ButtonDefault';
import { useRouter } from 'next/navigation';
import { useUser } from '@/src/hooks/users/useUser';
import AlertDefault from '../Alert/AlertDefault';
import DeleteModal from '../Modal/DeleteModal';

interface ClientDataProps {
    openEditForm: () => void;
}

const ClientData: React.FC<ClientDataProps> = ({ openEditForm }) => {
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
    };

    return (
        <div className='p-6 sm:p-10 max-w-[90%] md:max-w-xl lg:max-w-3xl mx-auto bg-white shadow-xl rounded-2xl'>
            <div className='flex flex-col items-center'>
                {data?.img && (
                    <Image
                        width={180}
                        height={180}
                        src={data.img}
                        alt='Profile Picture'
                        className='rounded-full mt-3 sm:mt-5 mb-6 sm:mb-10'
                    />
                )}
            </div>

            <div className='flex flex-col gap-2 text-center'>
                <h1 className='text-gray-600 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wide'>
                    {data?.fullname}
                </h1>
                <p className='text-base sm:text-lg'>
                    <LocationOnIcon className='text-black align-middle mr-1' />
                    {data?.address || "Joy ko'rsatilmagan"}
                </p>

                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 text-base sm:text-xl'>
                    <p><InsertEmoticonIcon className='text-black align-middle mr-1' /> {data?.username}</p>
                    <p><LocalPhoneIcon className='text-black align-middle mr-1' /> {data?.phone || "Telefon mavjud emas"}</p>
                    <p><VerifiedIcon className='text-black align-middle mr-1' /> Status: {data?.vip_status || "Standart"}</p>
                </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-3 sm:gap-x-5 mt-6'>
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

            <DeleteModal
                open={deleteModalOpen}
                onConfirm={handleDelete}
                onCancel={() => setDeleteModalOpen(false)}
                text="Siz aniq ushbu foydalanuvchini o'chirmoqchimisiz?"
            />
        </div>
    );
};

export default ClientData;
