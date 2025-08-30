import React from 'react'
import { useBookingCheckingByRequestId, useCustomerConfirmBookingChecking, useCustomerRejectBookingChecking } from '@/src/hooks/booking/useBookingRequests'

export interface Booking {
  id: number
  post_title: string
  user_fullname: string
  send_date: string
  status: string
  post_id: number
  post_owner_fullname: string
}

interface BookingsProps {
  bookings: Booking[]
  onBookingClick: (booking: Booking) => void
}

const Bookings: React.FC<BookingsProps> = ({ bookings, onBookingClick }) => {
  const customerConfirm = useCustomerConfirmBookingChecking()
  const customerReject = useCustomerRejectBookingChecking()

  const handleCustomerConfirm = (booking: Booking, ownerData: { start_date: string; end_date: string; price: number }, checkingId: number) => {
    // Automatically confirm with owner's data
    customerConfirm.mutate({
      id: checkingId, // Use booking checking ID, not booking request ID
      start_date: ownerData.start_date,
      end_date: ownerData.end_date,
      price: ownerData.price
    })
  }

  const handleCustomerReject = (booking: Booking) => {
    // We need to get the booking checking ID from the booking
    // For now, we'll use the booking ID directly and handle it in the backend
    customerReject.mutate({ id: booking.id })
  }

  if (!bookings.length) return <div>Hech qanday bron so&apos;rovi topilmadi.</div>

  return (
    <div className="space-y-4">
      {bookings.map(b => (
        <BookingRow
          key={b.id}
          booking={b}
          onBookingClick={onBookingClick}
          onCustomerConfirm={handleCustomerConfirm}
          onCustomerReject={handleCustomerReject}
        />
      ))}
    </div>
  )
}

const BookingRow: React.FC<{
  booking: Booking,
  onBookingClick: (booking: Booking) => void,
  onCustomerConfirm: (booking: Booking, ownerData: { start_date: string; end_date: string; price: number }, checkingId: number) => void,
  onCustomerReject: (booking: Booking) => void
}> = ({ booking, onBookingClick, onCustomerConfirm, onCustomerReject }) => {
  const { data: checking } = useBookingCheckingByRequestId(booking.id)
  const showConfirmBtn = checking && checking.owner_confirmed && !checking.customer_confirmed
  const showWaitingMsg = checking && checking.owner_confirmed && checking.customer_confirmed && checking.status === 'pending'
  
  // Parse owner data if available
  const ownerData = checking?.owner_data ? JSON.parse(checking.owner_data) : null
  
  return (
    <div
      className="p-4 bg-white rounded shadow hover:bg-gray-100"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-lg cursor-pointer text-blue-500 hover:underline" onClick={() => onBookingClick(booking)}>{booking.post_title}</div>
            <span className={`px-3 py-1 rounded-full text-white text-sm ${booking.status === 'pending' ? 'bg-yellow-500' : booking.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>{booking.status}</span>
          </div>
          <div className="text-gray-600">Foydalanuvchi: {booking.user_fullname}</div>
          <div className="text-gray-600">Joy egasi: {booking.post_owner_fullname}</div>
          <div className="text-gray-500 text-sm">Yuborilgan: {new Date(booking.send_date).toLocaleString()}</div>
          
          {/* Show owner's data when available */}
          {ownerData && (
            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Joy egasi kiritgan ma&apos;lumotlar:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                <div><span className="font-medium">Boshlanish sanasi:</span> {new Date(ownerData.start_date).toLocaleDateString()}</div>
                <div><span className="font-medium">Tugash sanasi:</span> {new Date(ownerData.end_date).toLocaleDateString()}</div>
                <div><span className="font-medium">Narxi:</span> ${ownerData.price}</div>
              </div>
            </div>
          )}
          
          {/* Red message above buttons */}
          <div className="text-red-500 text-sm mt-3 mb-2">Dastlab joy egasi maʼlumotlarni kiritishi kerak, soʻng mijoz tekshiradi!</div>
          
          {showConfirmBtn && (
            <div className="flex gap-2 mt-3">
              <button 
                className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer hover:bg-green-700" 
                onClick={() => onCustomerConfirm(booking, ownerData!, checking!.id)}
              >
                Tasdiqlash
              </button>
              <button 
                className="px-4 py-2 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700" 
                onClick={() => onCustomerReject(booking)}
              >
                Ma&apos;lumot noto&apos;g&apos;ri
              </button>
            </div>
          )}
          {showWaitingMsg && (
            <div className="mt-3 text-yellow-600 font-semibold">Mijoz ma&apos;lumoti kutilyapdi...</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bookings