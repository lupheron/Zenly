import Aside from '@/src/components/Aside/Aside'
import { ReactNode } from 'react'

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Aside />
            <div className='w-full height-full p-30 flex-1 overflow-auto'>
                <main className="h-full border-1 rounded-2xl border-gray-200 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] bg-white p-10">{children}</main>
            </div>
        </div>
    )
}