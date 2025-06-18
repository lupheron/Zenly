import Aside from '@/src/components/Aside/Aside'
import { ReactNode } from 'react'

export default function UserLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Aside />
            <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
    )
}