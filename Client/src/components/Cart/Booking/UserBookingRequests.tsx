import React from 'react'
import ButtonDefault from '../../Button/ButtonDefault'
import { useUpdateBookingRequestStatus } from '@/src/hooks/booking/useBookingRequests'

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
    const updateStatus = useUpdateBookingRequestStatus()

    const handleAcceptBooking = (id: number) => {
        updateStatus.mutate({ id, status: 'active' })
    }
    const handleRejectBooking = (id: number) => {
        updateStatus.mutate({ id, status: 'cancelled' })
    }

    if (!bookings.length) return <div>Hech qanday so&apos;rov topilmadi.</div>

    return (
        <div className="space-y-4">
            {bookings.map(b => (
                <div
                    key={b.id}
                    className="p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-100"

                >
                    <div className=' flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <div className="font-bold text-lg cursor-pointer text-blue-500 hover:underline" onClick={() => onBookingClick(b)}>{b.post_title}</div>
                            <div className="text-gray-600">So&apos;rovchi: {b.requester_fullname}</div>
                            <div className="text-gray-500 text-sm">Yuborilgan: {new Date(b.send_date).toLocaleString()}</div>
                        </div>
                        <div className="mt-2 sm:mt-0 flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-white ${b.status === 'pending' ? 'bg-yellow-500' : b.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>{b.status}</span>
                        </div>
                    </div>
                    {b.status === 'pending' && (
                        <div className='flex gap-2 items-center mt-5'>
                            <ButtonDefault
                                label="Qabul qilish"
                                onClick={() => {
                                    handleAcceptBooking(b.id);
                                }}
                                customClasses=''
                            />
                            <ButtonDefault
                                label="Rad etish"
                                onClick={() => {
                                    handleRejectBooking(b.id);
                                }}
                                customClasses='bg-red-500'
                            />
                        </div>
                    )}
                    {b.status === 'active' && (
                        <div className='flex gap-2 items-center mt-5'>
                            <ButtonDefault
                                label="Bekor qilish"
                                onClick={() => {
                                    handleRejectBooking(b.id);
                                }}
                                customClasses='bg-red-500'
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default UserBookingRequests