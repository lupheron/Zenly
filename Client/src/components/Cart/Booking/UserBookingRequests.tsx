import React from 'react'

export interface PostBookingRequest {
  id: number
  post_title: string
  post_id: number
  requester_fullname: string
  send_date: string
  status: string
}

interface UserBookingRequestsProps {
  bookings: PostBookingRequest[]
  onBookingClick: (booking: PostBookingRequest) => void
}

const UserBookingRequests: React.FC<UserBookingRequestsProps> = ({ bookings, onBookingClick }) => {
  if (!bookings.length) return <div>Hech qanday so&apos;rov topilmadi.</div>

  return (
    <div className="space-y-4">
      {bookings.map(b => (
        <div
          key={b.id}
          className="p-4 bg-white rounded shadow flex flex-col sm:flex-row sm:items-center sm:justify-between cursor-pointer hover:bg-gray-100"
          onClick={() => onBookingClick(b)}
        >
          <div>
            <div className="font-bold text-lg">{b.post_title}</div>
            <div className="text-gray-600">So&apos;rovchi: {b.requester_fullname}</div>
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

export default UserBookingRequests