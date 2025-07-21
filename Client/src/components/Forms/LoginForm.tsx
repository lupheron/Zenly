'use client'

import React, { useState } from 'react'
import { useLoginUser } from '@/src/hooks/useLoginUser'
import InputDefault from '../FormElements/Input/InputDefault'
import LabelDefault from '../FormElements/label/LabelDefault'
import AlertDefault from '../Alert/AlertDefault'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
    const router = useRouter()

    const [form, setForm] = useState({
        username: '',
        password: '',
    })

    const { mutate, isPending } = useLoginUser()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        mutate(form, {
            onSuccess: (data) => {
                if (data.remember_token && data.id) {
                    localStorage.setItem('token', data.remember_token)
                    localStorage.setItem('user_id', data.id.toString())
                    AlertDefault.success(data.message || "Tizimga muvaffaqiyatli kirdingiz!")
                    router.push("/")
                } else {
                    AlertDefault.error("Serverdan noto'g'ri javob qaytdi.")
                }
            },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 w-full">
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
                    label="Parol:" 
                    htmlFor="password" 
                    customClasses="text-sm sm:text-base font-medium text-gray-700 block mb-1 sm:mb-2"
                />
                <InputDefault
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Parol kiriting"
                    customClasses="w-full"
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full cursor-pointer bg-light-green text-white px-4 sm:px-6 py-2 sm:py-3 rounded-md text-sm sm:text-base font-semibold hover:bg-green-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
            >
                {isPending ? 'Tekshirilmoqda...' : 'Kirish'}
            </button>
        </form>
    )
}

export default LoginForm
