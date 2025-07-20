'use client'

import React, { useEffect, useState } from 'react'
import { useRegisterUser, ApiError } from '@/src/hooks/useRegisterUser'
import { useRouter } from 'next/navigation'
import AlertDefault from '../../Alert/AlertDefault'
import InputDefault from '../../FormElements/Input/InputDefault'
import LabelDefault from '../../FormElements/label/LabelDefault'
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

const RegisterForm = () => {
    const [form, setForm] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        password: '',
        type: 0
    })
    const router = useRouter()

    const { mutate, isPending, isSuccess, isError, error } = useRegisterUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate(form)
    }

    useEffect(() => {
        if (isSuccess) {
            AlertDefault.success("Ro'yxatdan o'tish muvaffaqiyatli yakunlandi!")
            router.push('/login')
        }
    }, [isSuccess, router])

    useEffect(() => {
        if (isError && error instanceof ApiError) {
            if (error.status === 409) {
                AlertDefault.error("Bu username allaqachon ishlatilgan!")
            } else {
                AlertDefault.error("Ro'yxatdan o'tishda xatolik yuz berdi!")
            }
        }
    }, [isError, error])

    return (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 w-full">
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
                    customClasses='bg-white rounded border-1 border-light-green w-full'
                    required={true}
                    placeholder="To'liq ism va familiya"
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
                    customClasses='bg-white rounded border-1 border-light-green w-full'
                    required={true}
                    placeholder="Username kiriting"
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
                    customClasses='bg-white rounded border-1 border-light-green w-full'
                    required={true}
                    placeholder="+998 XX XXX XX XX"
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
                    customClassesSelect="w-full h-[40px] sm:h-[45px] md:h-[50px] border border-gray-300 rounded px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 text-sm sm:text-base"
                />
            </div>

            <div>
                <LabelDefault 
                    label="Parol:" 
                    htmlFor="password" 
                    customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                />
                <InputDefault
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    customClasses='bg-white rounded border-1 border-light-green w-full'
                    required={true}
                    placeholder="Parol kiriting"
                />
            </div>

            <div className='hidden'>
                <LabelDefault label="Turi:" htmlFor="type" />
                <InputDefault
                    name="type"
                    type="number"
                    value={String(form.type)}
                    onChange={handleChange}
                    customClasses='bg-white rounded border-1 border-light-green'
                    required={true}
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-light-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-semibold hover:bg-green-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
            >
                {isPending ? 'Yuborilmoqda...' : "Ro'yxatdan o'tish"}
            </button>
        </form>
    )
}

export default RegisterForm
