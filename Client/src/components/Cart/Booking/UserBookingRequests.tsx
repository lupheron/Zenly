import React from 'react'
import ButtonDefault from '../../Button/ButtonDefault'
import BookingCheckingForm from '@/src/components/Forms/BookingCheckingForm'
import { useUpdateBookingRequestStatus, useCreateBookingChecking, useBookingCheckingByRequestId } from '@/src/hooks/booking/useBookingRequests'
import { useQueryClient } from '@tanstack/react-query'

export interface PostBookingRequest {
    id: number
    post_title: string
    post_id: number
    requester_fullname: string
    user_phone: string
    send_date: string
    status: string
}

interface UserBookingRequestsProps {
    bookings: PostBookingRequest[]
    onBookingClick: (booking: PostBookingRequest) => void
}

const UserBookingRequests: React.FC<UserBookingRequestsProps> = ({ bookings, onBookingClick }) => {
    const updateStatus = useUpdateBookingRequestStatus()
    const [checkingModalOpen, setCheckingModalOpen] = React.useState(false)
    const [selectedBooking, setSelectedBooking] = React.useState<PostBookingRequest | null>(null)
    const createChecking = useCreateBookingChecking()
    const queryClient = useQueryClient()

    const handleAcceptBooking = (booking: PostBookingRequest) => {
        setSelectedBooking(booking)
        setCheckingModalOpen(true)
    }
    const handleRejectBooking = (id: number) => {
        updateStatus.mutate({ id, status: 'cancelled' })
    }

    const handleCheckingSubmit = (data: { start_date: string, end_date: string, price: number }) => {
        if (!selectedBooking) return
        const user_id = Number(localStorage.getItem('user_id'))
        createChecking.mutate({
            request_id: selectedBooking.id,
            user_id,
            post_id: selectedBooking.post_id,
            ...data
        }, {
            onSuccess: () => {
                setCheckingModalOpen(false)
                setSelectedBooking(null)
                // Refetch bookings after successful checking
                queryClient.invalidateQueries({ queryKey: ['booking-requests-for-user-posts'] })
            }
        })
    }

    if (!bookings.length) return <div>Hech qanday so&apos;rov topilmadi.</div>

    return (
        <div className="space-y-4">
            {bookings.map(b => (
                <div
                    key={b.id}
                    className="p-4 bg-white rounded shadow hover:bg-gray-100"
                >
                    <div className=' flex flex-col sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <div className="font-bold text-lg cursor-pointer text-blue-500 hover:underline" onClick={() => onBookingClick(b)}>{b.post_title}</div>
                            <div className="text-gray-600">Mijoz: {b.requester_fullname}</div>
                            <div className="text-gray-500 text-sm">Yuborilgan: {new Date(b.send_date).toLocaleString()}</div>
                            <div className="text-gray-500 text-sm">Telefon raqami: <a
                                href={`tel:${b.user_phone}`}
                                className='text-blue-500 cursor-pointer hover:underline'
                            >
                                {b.user_phone}
                            </a></div>
                        </div>
                        <div className="mt-2 sm:mt-0 flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-white ${b.status === 'pending' ? 'bg-yellow-500' : b.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>{b.status}</span>
                        </div>
                    </div>
                    <p className='text-red-500 text-sm mt-5'>So&apos;rovni qabul qilishdan avval mijoz bilan aloqaga chiqishingzni so&apos;rab qolamiz!!!</p>
                    {/* Show waiting message if booking_checking exists and customer_confirmed is false */}
                    {b.status === 'active' && (
                      <BookingCheckingStatus requestId={b.id} />
                    )}
                    {b.status === 'pending' && (
                        <div className='flex gap-2 items-center mt-5'>
                            <ButtonDefault
                                label="Qabul qilish"
                                onClick={() => handleAcceptBooking(b)}
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
            <BookingCheckingForm
                open={checkingModalOpen}
                onClose={() => setCheckingModalOpen(false)}
                onSubmit={handleCheckingSubmit}
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ['booking-requests-for-user-posts'] })}
            />
        </div>
    )
}

// Child component to use hook per booking
const BookingCheckingStatus: React.FC<{ requestId: number }> = ({ requestId }) => {
  const { data: checking, isLoading } = useBookingCheckingByRequestId(requestId)
  if (isLoading) return null
  if (checking && checking.owner_confirmed && !checking.customer_confirmed) {
    return <div className="mt-3 text-yellow-600 font-semibold">Mijoz ma&apos;lumotini tasdiqlashini kutyapmiz...</div>
  }
  return null
}

export default UserBookingRequests