'use client'

import React, { useState } from 'react'
import LabelDefault from '../FormElements/label/LabelDefault'
import InputDefault from '../FormElements/Input/InputDefault'
import { useRegisterUser } from '@/src/hooks/useRegisterUser'

const RegisterForm = () => {
    const [form, setForm] = useState({
        fullname: '',
        username: '',
        phone: '',
        address: '',
        password: '',
    })

    const { mutate, isPending, isSuccess, isError } = useRegisterUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate(form)
    }

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
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="bg-light-green text-white px-6 py-2 rounded-md cursor-pointer     hover:bg-opacity-90"
            >
                {isPending ? 'Yuborilmoqda...' : 'Ro‘yxatdan o‘tish'}
            </button>

            {isSuccess && <p className="text-green-600">Ro‘yxatdan o‘tish muvaffaqiyatli!</p>}
            {isError && <p className="text-red-500">Xatolik yuz berdi!</p>}
        </form>
    )
}

export default RegisterForm
