'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Aside from '@/src/components/Aside/Aside'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AlertDefault from '@/src/components/Alert/AlertDefault'
import api from '@/src/utils/axios'

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            AlertDefault.error("Avval identifikatsiyadan o'ting!")
            router.push("/login")
            return
        }

        api.get('/user') // secure backend call using token
            .then((res) => {
                const userType = res.data.type
                if (userType === 1) {
                    AlertDefault.error("Sizga bu sahifaga kirish taqiqlangan.")
                    router.push("/")
                }
            })
            .catch(() => {
                AlertDefault.error("Token noto‘g‘ri yoki sessiya tugagan.")
                router.push("/login")
            })
            .finally(() => {
                setLoading(false)
            })
    }, [router])

    const handleBack = () => {
        window.history.back()
    }

    if (loading) return null // or a spinner

    return (
        <div className="flex min-h-screen">
            <Aside />
            <div className='w-full height-full p-30 flex-1 overflow-auto'>
                <div className='cursor-pointer flex items-center' onClick={handleBack}>
                    <ArrowBackIcon />
                    <ButtonDefault
                        label='Qaytish'
                        onClick={() => { }}
                        customClasses='bg-transparent !text-black tracking-[1px] text-xl mb-5 hover:bg-transparent !px-0 !py-0 ml-2 mt-5'
                    />
                </div>
                <main className="h-full border-1 rounded-2xl bg-light-gray border-gray-200 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] p-10">
                    {children}
                </main>
            </div>
        </div>
    )
}
