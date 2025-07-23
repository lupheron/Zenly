import React from 'react'

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
  if (!bookings.length) return <div>Hech qanday bron so&apos;rovi topilmadi.</div>

  return (
    <div className="space-y-4">
      {bookings.map(b => (
        <div
          key={b.id}
          className="p-4 bg-white rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-gray-100"
        >
          <div>
            <div className="font-bold text-lg cursor-pointer text-blue-500 hover:underline" onClick={() => onBookingClick(b)}>{b.post_title}</div>
            <div className="text-gray-600">Foydalanuvchi: {b.user_fullname}</div>
            <div className="text-gray-600">Joy egasi: {b.post_owner_fullname}</div>
            <div className="text-gray-500 text-sm">Yuborilgan: {new Date(b.send_date).toLocaleString()}</div>
          </div>
          <div className="mt-2 sm:mt-0">
            <span className={`px-3 py-1 rounded-full text-white ${b.status === 'pending' ? 'bg-yellow-500' : b.status === 'approved' ? 'bg-green-600' : 'bg-red-600'}`}>{b.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Bookings