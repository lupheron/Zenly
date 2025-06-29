"use client"
import Aside from '@/src/components/Aside/Aside'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AlertDefault from '@/src/components/Alert/AlertDefault';

export default function UserLayout({ children }: { children: ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            AlertDefault.error("Avval identifikatsiyadan o'ting!")
            router.push("/login")
        }
    }, [router])

    return (
        <div className="flex min-h-screen">
            <Aside />
            <div className='w-full height-full p-30 flex-1 overflow-auto'>
                <div className='cursor-pointer' onClick={() => window.history.back()}>
                    <ArrowBackIcon />
                    <ButtonDefault
                        label='Qaytish'
                        onClick={() => console.log('Qaytish tugmasi bosildi')}
                        customClasses='bg-transparent !text-black tracking-[1px] text-xl mb-5 hover:bg-transparent !px-0 !py-0 ml-2'
                    />
                </div>
                <main className="h-full border-1 rounded-2xl bg-light-gray border-gray-200 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] p-10">
                    {children}
                </main>
            </div>
        </div>
    )
}