'use client'

import UserBookingRequests from '@/src/components/Cart/Booking/UserBookingRequests'
import { useBookingRequestsForUserPosts } from '@/src/hooks/booking/useBookingRequests'
import { useRouter } from 'next/navigation'
import React from 'react'

const UserBooked = () => {
    const user_id = typeof window !== 'undefined' ? Number(localStorage.getItem('user_id')) : null
    const { data = [], isLoading, isError } = useBookingRequestsForUserPosts(user_id)
    const router = useRouter()

    if (isLoading) return <div>Yuklanmoqda...</div>
    if (isError) return <div>Xatolik yuz berdi.</div>

    return (
        <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8 py-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Mening joylarimga kelgan bron so&apos;rovlari</h1>
            <UserBookingRequests bookings={data} onBookingClick={(booking) => router.push(`/posts/${booking.post_id}`)} />  
        </div>
    )
}

export default UserBooked