'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/src/hooks/users/useUser'

export default function Dashboard() {
    const router = useRouter()
    const { data, isLoading } = useUser()

    useEffect(() => {
        if (!isLoading && data) {
            if (data.type !== 0) {
                router.push('/')
            }
        }
    }, [data, isLoading, router])

    if (isLoading || !data) {
        return <p>Yuklanmoqda...</p>
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p>Welcome to your dashboard</p>
        </div>
    )
}
