'use client'
import React from 'react'
import Bookings from '@/src/components/Cart/Bookings'
import { useUserBookingRequests } from '@/src/hooks/booking/useBookingRequests'

const BookedPlaces = () => {
  const user_id = typeof window !== 'undefined' ? Number(localStorage.getItem('user_id')) : null
  const { data = [], isLoading, isError } = useUserBookingRequests(user_id)

  if (isLoading) return <div>Yuklanmoqda...</div>
  if (isError) return <div>Xatolik yuz berdi.</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mening bron so&apos;rovlarim</h1>
      <Bookings bookings={data} />
    </div>
  )
}

export default BookedPlaces