'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AlertDefault from '../../Alert/AlertDefault'
import InputDefault from '../../FormElements/Input/InputDefault'
import LabelDefault from '../../FormElements/label/LabelDefault'
import { useRegisterUser } from '@/src/hooks/useRegisterUser'
import SelectDefault from '../../FormElements/Select/SelectDefault'

const uzbekistanProvinces = [
    { label: 'Andijon', value: 'Andijon' },
    { label: 'Buxoro', value: 'Buxoro' },
    { label: 'Fargʻona', value: 'Fargʻona' },
    { label: 'Jizzax', value: 'Jizzax' },
    { label: 'Xorazm', value: 'Xorazm' },
    { label: 'Namangan', value: 'Namangan' },
    { label: 'Navoiy', value: 'Navoiy' },
    { label: 'Qashqadaryo', value: 'Qashqadaryo' },
    { label: 'Qoraqalpogʻiston', value: 'Qoraqalpogʻiston' },
    { label: 'Samarqand', value: 'Samarqand' },
    { label: 'Sirdaryo', value: 'Sirdaryo' },
    { label: 'Surxondaryo', value: 'Surxondaryo' },
    { label: 'Toshkent viloyati', value: 'Toshkent viloyati' },
    { label: 'Toshkent shahri', value: 'Toshkent shahri' }
]

const RegisterClientForm = () => {
    const [form, setForm] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        password: '',
        type: 1
    })

    const router = useRouter()
    const { mutate, isPending, isSuccess, isError, error } = useRegisterUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: name === 'type' ? Number(value) : value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate(form)
    }

    useEffect(() => {
        if (isSuccess) {
            AlertDefault.success("Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!")
            router.push('/login')
        }
        if (isError && error) {
            if (error.message === "USERNAME_CONFLICT") {
                AlertDefault.error("Bu username allaqachon ishlatilgan!")
            } else {
                AlertDefault.error("Ro‘yxatdan o‘tishda xatolik yuz berdi!")
            }
        }
    }, [isSuccess, isError, error, router])

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <LabelDefault label="F.I.SH:" htmlFor="fullname" />
                <InputDefault
                    name="fullname"
                    type="text"
                    value={form.fullname}
                    onChange={handleChange}
                    customClasses='bg-white rounded border-1 border-light-green'
                    required={true}
                />
            </div>

            <div>
                <LabelDefault label="Username:" htmlFor="username" />
                <InputDefault
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    customClasses='bg-white rounded border-1 border-light-green'
                    required={true}
                />
            </div>

            <div>
                <LabelDefault label="Telefon Raqamingiz:" htmlFor="phone" />
                <InputDefault
                    name="phone"
                    type="text"
                    value={form.phone}
                    onChange={handleChange}
                    customClasses='bg-white rounded border-1 border-light-green'
                    required={true}
                />
            </div>

            <div>
                <SelectDefault
                    label="Yashash manzilingiz:"
                    htmlFor="address"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    options={uzbekistanProvinces}
                    customClassesSelect="w-full h-15 border border-gray-300 rounded px-3 py-2"
                />
            </div>

            <div>
                <LabelDefault label="Parol:" htmlFor="password" />
                <InputDefault
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    customClasses='bg-white rounded border-1 border-light-green'
                    required={true}
                />
            </div>

            <div className="hidden">
                <LabelDefault label="Turi:" htmlFor="type" />
                <InputDefault
                    name="type"
                    type="number"
                    value={String(form.type)}
                    onChange={handleChange}
                    customClasses="bg-white rounded border-1 border-light-green"
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="bg-light-green text-white px-6 py-2 rounded-md cursor-pointer hover:bg-opacity-90"
            >
                {isPending ? "Yuborilmoqda..." : "Ro‘yxatdan o‘tish"}
            </button>
        </form>
    )
}

export default RegisterClientForm
