import React, { useState } from 'react'
import ReusableModal from '@/src/components/Modal/ReusableModal'
import LabelDefault from '../FormElements/label/LabelDefault'
import { DateRangePicker } from '../FormElements/DatePciker/DatePicker'
import AlertDefault from '../Alert/AlertDefault'

interface BookingCheckingFormProps {
    open: boolean
    onClose: () => void
    onSubmit: (data: { start_date: string, end_date: string, price: number }) => Promise<void> | void
    onSuccess?: () => void // optional callback for parent to refresh data
}

const BookingCheckingForm: React.FC<BookingCheckingFormProps> = ({ open, onClose, onSubmit, onSuccess }) => {
    const [checkIn, setCheckIn] = useState<Date | null>(null)
    const [checkOut, setCheckOut] = useState<Date | null>(null)
    const [price, setPrice] = useState('')
    const [loading, setLoading] = useState(false)

    const handleDateChange = (start: Date | null, end: Date | null) => {
        setCheckIn(start)
        setCheckOut(end)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!checkIn || !checkOut || !price) return
        setLoading(true)
        try {
            await onSubmit({
                start_date: checkIn.toISOString(),
                end_date: checkOut.toISOString(),
                price: Number(price)
            })
            AlertDefault.success('Bron checking muvaffaqiyatli yaratildi!')
            setTimeout(() => {
                onClose()
                if (onSuccess) onSuccess()
            }, 1000)
        } catch {
            // error handled in onSubmit
        } finally {
            setLoading(false)
        }
    }

    return (
        <ReusableModal open={open} onClose={onClose} title="Bron tafsilotlari (Checking)" width={400}>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <DateRangePicker
                    onDateChange={handleDateChange}
                    initialCheckIn={checkIn}
                    initialCheckOut={checkOut}
                    showTimeSelect={true}
                    checkInLabel="Boshlanish sanasi"
                    checkOutLabel="Tugash sanasi"
                />
                <div>
                    <LabelDefault label='Narxi' htmlFor='price'/>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                        min={0}
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2" disabled={loading}>
                    {loading ? 'Yuborilmoqda...' : 'Tasdiqlash'}
                </button>
            </form>
        </ReusableModal>
    )
}

export default BookingCheckingForm