'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@/src/hooks/users/useUser'
import AlertDefault from '../../Alert/AlertDefault'
import ProfileImageUpload from '../../FormElements/Uploads/ProfileImgUpload'
import LabelDefault from '../../FormElements/label/LabelDefault'
import InputDefault from '../../FormElements/Input/InputDefault'
import ButtonDefault from '../../Button/ButtonDefault'

interface EditClientFormProps {
    closeEditForm: () => void
}

const EditClientForm = ({ closeEditForm }: EditClientFormProps) => {
    const [form, setForm] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        img: '',
    })

    const { data, isLoading, updateUser } = useUser()
    const { mutate, isPending, isSuccess, isError } = updateUser

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
            AlertDefault.success("Ma'lumotlar muvaffaqiyatli yangilandi!");
            closeEditForm();
        }
        if (isError) {
            AlertDefault.error("Tahrirlashda xatolik yuz berdi!");
        }
    }, [isSuccess, isError, closeEditForm]);

    if (isLoading) return <p>Yuklanmoqda...</p>

    return (
        <form onSubmit={handleSubmit} className="flex gap-10 items-start">
            <ProfileImageUpload value={form.img} onChange={handleImageChange} />

            <div className="space-y-4 flex-1">
                <div>
                    <LabelDefault label="F.I.SH:" htmlFor="fullname" />
                    <InputDefault
                        name="fullname"
                        type="text"
                        value={form.fullname}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <LabelDefault label="Username:" htmlFor="username" />
                    <InputDefault
                        name="username"
                        type="text"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <LabelDefault label="Telefon Raqamingiz:" htmlFor="phone" />
                    <InputDefault
                        name="phone"
                        type="text"
                        value={form.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <LabelDefault label="Manzilingiz:" htmlFor="address" />
                    <InputDefault
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex items-center gap-5 pt-2">
                    <ButtonDefault
                        label={isPending ? 'Saqlanmoqda...' : 'Yangilash'}
                        type="submit"
                        isDisabled={isPending}
                        customClasses='w-full tracking-[1px]'
                    />

                    <ButtonDefault
                        label="Bekor qilish"
                        onClick={closeEditForm}
                        isDisabled={isPending}
                        customClasses='w-full !bg-gray-300 !text-black tracking-[1px]'
                    />
                </div>
            </div>
        </form>
    )
}

export default EditClientForm
