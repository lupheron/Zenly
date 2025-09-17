'use client'

import React, { useEffect, useState } from 'react'
import LabelDefault from '../FormElements/label/LabelDefault'
import InputDefault from '../FormElements/Input/InputDefault'
import AlertDefault from '../Alert/AlertDefault'
import { useRouter } from 'next/navigation'
import { useUser } from '@/src/hooks/users/useUser'
import ProfileImageUpload from '../FormElements/Uploads/ProfileImgUpload'
import ButtonDefault from '../Button/ButtonDefault'

const EditUserForm = () => {
    const [form, setForm] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        img: '',
    })

    const router = useRouter()
    const { data, isLoading, updateUser } = useUser()
    const { mutate, isPending, isSuccess, isError, error } = updateUser

    useEffect(() => {
        if (data) {
            setForm({
                fullname: data.fullname || '',
                username: data.username || '',
                phone: data.phone || '',
                address: data.address || '',
                img: data.img || '',
            })
        }
    }, [data])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleImageChange = (imgData: string) => {
        setForm((prev) => ({ ...prev, img: imgData }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            fullname: form.fullname,
            username: form.username,
            phone: form.phone,
            address: form.address,
            img: form.img,
        }
        mutate(payload)
    }

    useEffect(() => {
        if (isSuccess) {
            AlertDefault.success("Ma'lumotlar muvaffaqiyatli yangilandi!")
            router.push('/user/profile')
        }
        if (isError && error) {
            if (error.message === "USERNAME_CONFLICT") {
                AlertDefault.error("Bu username allaqachon ishlatilgan!")
            } else {
                AlertDefault.error("Taxrirlashda xatolik yuz berdi!")
            }
        }
    }, [isSuccess, isError, error, router])

    if (isLoading) return <p>Yuklanmoqda...</p>

    return (
        <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-6 lg:gap-10 items-start">
            <div className="w-full lg:w-auto flex justify-center lg:justify-start">
                <ProfileImageUpload value={form.img} onChange={handleImageChange} />
            </div>

            <div className="space-y-3 sm:space-y-4 flex-1 w-full">
                <div>
                    <LabelDefault 
                        label="F.I.SH:" 
                        htmlFor="fullname" 
                        customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                    />
                    <InputDefault
                        name="fullname"
                        type="text"
                        value={form.fullname}
                        onChange={handleChange}
                        required
                        placeholder="To'liq ism va familiya"
                        customClasses="w-full"
                    />
                </div>

                <div>
                    <LabelDefault 
                        label="Username:" 
                        htmlFor="username" 
                        customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                    />
                    <InputDefault
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        required
                        placeholder="Username kiriting"
                        customClasses="w-full"
                    />
                </div>

                <div>
                    <LabelDefault 
                        label="Telefon Raqamingiz:" 
                        htmlFor="phone" 
                        customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                    />
                    <InputDefault
                        name="phone"
                        type="text"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="+998 XX XXX XX XX"
                        customClasses="w-full"
                    />
                </div>

                <div>
                    <LabelDefault 
                        label="Manzilingiz:" 
                        htmlFor="address" 
                        customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                    />
                    <InputDefault
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        required
                        placeholder="Manzilingizni kiriting"
                        customClasses="w-full"
                    />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 pt-2">
                    <ButtonDefault
                        label={isPending ? 'Saqlanmoqda...' : 'Yangilash'}
                        type="submit"
                        isDisabled={isPending}
                        customClasses='w-full tracking-[1px]'
                    />

                    <ButtonDefault
                        label="Bekor qilish"
                        onClick={() => { window.history.back() }}
                        isDisabled={isPending}
                        customClasses='w-full !bg-gray-300 !text-black tracking-[1px]'
                    />
                </div>
            </div>
        </form>
    )
}

export default EditUserForm
