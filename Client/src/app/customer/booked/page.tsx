'use client'
import React from 'react'
import Bookings from '@/src/components/Cart/Booking/Bookings'
import { useUserBookingRequests } from '@/src/hooks/booking/useBookingRequests'
import { useRouter } from 'next/navigation'

const BookedPlaces = () => {
  const [user_id, setUserId] = React.useState<number | null>(null)
  const { data = [], isLoading, isError } = useUserBookingRequests(user_id)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('user_id')
      if (id) setUserId(Number(id))
    }
  }, [])
  const router = useRouter()

  if (isLoading) return <div>Yuklanmoqda...</div>
  if (isError) return <div>Xatolik yuz berdi.</div>

  return (
    <div className="max-w-3xl mx-auto px-2 sm:px-4 md:px-8 py-4">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Mening bron so&apos;rovlarim</h1>
      <Bookings bookings={data} onBookingClick={(booking) => router.push(`/posts/${booking.post_id}`)} />
    </div>
  )
}

export default BookedPlaces