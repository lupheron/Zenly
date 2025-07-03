'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AlertDefault from '../../Alert/AlertDefault'
import InputDefault from '../../FormElements/Input/InputDefault'
import LabelDefault from '../../FormElements/label/LabelDefault'
import { useRegisterUser } from '@/src/hooks/useRegisterUser'

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

    const { mutate, isPending, isSuccess, isError } = useRegisterUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
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
        if (isError) {
            AlertDefault.error("Ro‘yxatdan o‘tishda xatolik yuz berdi!")
        }
    }, [isSuccess, isError])

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
                <LabelDefault label="Manzilingiz:" htmlFor="address" />
                <InputDefault
                    name="address"
                    type="text"
                    value={form.address}
                    onChange={handleChange}
                    customClasses='bg-white rounded border-1 border-light-green'
                    required={true}
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
                className="bg-light-green text-white px-6 py-2 rounded-md cursor-pointer hover:bg-opacity-90"
            >
                {isPending ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}
            </button>
        </form>
    )
}

export default RegisterClientForm