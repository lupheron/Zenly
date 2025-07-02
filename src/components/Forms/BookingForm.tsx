'use client'

import React, { useState } from 'react'
import SelectDefault from '../FormElements/Select/SelectDefault'
import DateRangePicker from '../FormElements/DatePciker/DatePicker'
import InputDefault from '../FormElements/Input/InputDefault'
import ButtonDefault from '../Button/ButtonDefault'
import LabelDefault from '../FormElements/label/LabelDefault'

const BookingForm = () => {
    const [dateRange, setDateRange] = useState<{ checkIn: Date | null, checkOut: Date | null }>({
        checkIn: null,
        checkOut: null,
    })

    const [guests, setGuests] = useState<string>('')

    const handleDateChange = (checkIn: Date | null, checkOut: Date | null) => {
        setDateRange({ checkIn, checkOut })
    }

    const handleSearch = () => {
        console.log('Searching with:')
        console.log('Guests:', guests)
        console.log('Check In:', dateRange.checkIn)
        console.log('Check Out:', dateRange.checkOut)
        // You can handle API calls here
    }

    return (
        <div className="w-[55%] mx-auto">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSearch()
                }}
                className="flex items-center justify-between px-10 bg-white rounded-lg shadow-sm"
            >
                <div className="px-5 border-r-gray-300 border-r">
                    <SelectDefault
                        label="Shahar"
                        htmlFor="region"
                        name="region"
                        options={['Toshkent', 'Samarqand', 'Buxoro']}
                        customClassesLabel="block text-sm font-medium text-gray-700 mb-1"
                        customClassesSelect="w-full border border-gray-300 rounded-lg p-2 text-gray-800 cursor-pointer"
                        customClassesOptions="cursor-pointer"
                    />
                </div>

                <div className="mt-5 px-5">
                    <DateRangePicker
                        onDateChange={handleDateChange}
                        className="mb-6"
                    />
                </div>

                <div className="border-r-gray-300 border-r w-[1px] h-16"></div>

                <div className="px-5">
                    <LabelDefault htmlFor="guests" label="Odam Soni" />
                    <InputDefault
                        type="number"
                        name="guests"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="Odam Soni"
                    />
                </div>

                <ButtonDefault
                    label="Qidirish"
                    type="submit"
                />
            </form>
        </div>
    )
}

export default BookingForm
