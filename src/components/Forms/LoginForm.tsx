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
                    router.push('/user')
                } else {
                    AlertDefault.error("Serverdan noto'g'ri javob qaytdi.")
                }
            },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <LabelDefault label="Parol:" htmlFor="password" />
                <InputDefault
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="bg-light-green text-white px-6 py-2 rounded-md"
            >
                {isPending ? 'Tekshirilmoqda...' : 'Kirish'}
            </button>
        </form>
    )
}

export default LoginForm
