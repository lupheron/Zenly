'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
                AlertDefault.error("Token noto'g'ri yoki sessiya tugagan.")
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
        <div className="flex min-h-screen bg-gray-50">
            <Aside />
            <div className='w-full lg:ml-0 flex-1 overflow-auto'>
                <div className='p-4 sm:p-6 lg:p-8'>
                    <div className='flex items-center gap-5 mb-4 sm:mb-6'>
                        <div className='cursor-pointer flex items-center' onClick={handleBack}>
                            <ArrowBackIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                            <ButtonDefault
                                label='Qaytish'
                                onClick={() => { }}
                                customClasses='bg-transparent !text-black tracking-[1px] text-sm sm:text-base lg:text-xl hover:bg-transparent !px-0 !py-0 ml-2'
                            />
                        </div>
                        <span className="text-gray-400">/</span>
                        <Link
                            href="/"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base lg:text-lg transition-colors"
                        >
                            🏠 Bosh sahifa
                        </Link>
                    </div>
                    <main className="min-h-[calc(100vh-120px)] border-1 rounded-xl sm:rounded-2xl bg-light-gray border-gray-200 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] p-4 sm:p-6 lg:p-10">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    )
}
