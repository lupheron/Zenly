'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AlertDefault from '../../Alert/AlertDefault'
import InputDefault from '../../FormElements/Input/InputDefault'
import LabelDefault from '../../FormElements/label/LabelDefault'
import { useRegisterUser } from '@/src/hooks/useRegisterUser'

interface FormState {
    fullname: string;
    username: string;
    phone: string;
    address: string;
    password: string;
    type: number;
}

const RegisterClientForm = () => {
    const [form, setForm] = useState<FormState>({
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
        if (isError) {
            AlertDefault.error("Ro‘yxatdan o‘tishda xatolik yuz berdi!")
        }
    }, [isSuccess, isError, router])

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {([
                { label: "F.I.SH:", name: "fullname", type: "text" },
                { label: "Username:", name: "username", type: "text" },
                { label: "Telefon Raqamingiz:", name: "phone", type: "text" },
                { label: "Manzilingiz:", name: "address", type: "text" },
                { label: "Parol:", name: "password", type: "password" },
            ] as const).map(({ label, name, type }) => (
                <div key={name}>
                    <LabelDefault label={label} htmlFor={name} />
                    <InputDefault
                        name={name}
                        type={type}
                        value={form[name]}
                        onChange={handleChange}
                        customClasses="bg-white rounded border-1 border-light-green"
                        required
                    />
                </div>
            ))}

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
