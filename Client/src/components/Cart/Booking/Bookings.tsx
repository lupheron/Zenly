import React from 'react'
import { useBookingCheckingByRequestId, useCustomerConfirmBookingChecking } from '@/src/hooks/booking/useBookingRequests'
import BookingCheckingForm from '@/src/components/Forms/BookingCheckingForm'
import AlertDefault from '@/src/components/Alert/AlertDefault'
import { AxiosError } from 'axios'

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
  const [checkingModalOpen, setCheckingModalOpen] = React.useState(false)
  const [selectedBooking, setSelectedBooking] = React.useState<Booking | null>(null)
  const customerConfirm = useCustomerConfirmBookingChecking()

  const handleCustomerConfirm = (booking: Booking) => {
    setSelectedBooking(booking)
    setCheckingModalOpen(true)
  }

  const handleCheckingSubmit = async (data: { start_date: string, end_date: string, price: number }) => {
    if (!selectedBooking) return
    customerConfirm.mutate({
      id: selectedBooking.id,
      ...data
    }, {
      onSuccess: () => {
        setCheckingModalOpen(false)
        setSelectedBooking(null)
      },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError<{ message?: string }>
        if (axiosError?.response?.status === 422) {
          AlertDefault.error('Maʼlumotlar mos emas!')
        }
      }
    })
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
          showForm={!!selectedBooking && selectedBooking.id === b.id}
          checkingModalOpen={checkingModalOpen}
          onCloseForm={() => setCheckingModalOpen(false)}
          onSubmitForm={handleCheckingSubmit}
        />
      ))}
    </div>
  )
}

const BookingRow: React.FC<{
  booking: Booking,
  onBookingClick: (booking: Booking) => void,
  onCustomerConfirm: (booking: Booking) => void,
  showForm: boolean,
  checkingModalOpen: boolean,
  onCloseForm: () => void,
  onSubmitForm: (data: { start_date: string, end_date: string, price: number }) => void
}> = ({ booking, onBookingClick, onCustomerConfirm, showForm, checkingModalOpen, onCloseForm, onSubmitForm }) => {
  const { data: checking } = useBookingCheckingByRequestId(booking.id)
  const showConfirmBtn = checking && checking.owner_confirmed && !checking.customer_confirmed
  const showWaitingMsg = checking && checking.owner_confirmed && checking.customer_confirmed && checking.status === 'pending'
  return (
    <div
      className="p-4 bg-white rounded shadow flex flex-col md:flex-row md:items-center md:justify-between hover:bg-gray-100"
    >
      <div>
        <div className="font-bold text-lg cursor-pointer text-blue-500 hover:underline" onClick={() => onBookingClick(booking)}>{booking.post_title}</div>
        <div className="text-gray-600">Foydalanuvchi: {booking.user_fullname}</div>
        <div className="text-gray-600">Joy egasi: {booking.post_owner_fullname}</div>
        <div className="text-gray-500 text-sm">Yuborilgan: {new Date(booking.send_date).toLocaleString()}</div>
        {/* Red message above buttons */}
        <div className="text-red-500 text-sm mt-3 mb-2">Dastlab joy egasi maʼlumotlarni kiritishi kerak, soʻng mijoz tekshiradi!</div>
        {showConfirmBtn && (
          <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer" onClick={() => onCustomerConfirm(booking)}>
            Tasdiqlash
          </button>
        )}
        {showWaitingMsg && (
          <div className="mt-3 text-yellow-600 font-semibold">Mijoz ma&apos;lumoti kutilyapdi...</div>
        )}
      </div>
      <div className="mt-2 md:mt-0">
        <span className={`px-3 py-1 rounded-full text-white ${booking.status === 'pending' ? 'bg-yellow-500' : booking.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>{booking.status}</span>
      </div>
      {showForm && (
        <BookingCheckingForm
          open={checkingModalOpen}
          onClose={onCloseForm}
          onSubmit={onSubmitForm}
        />
      )}
    </div>
  )
}

export default Bookings