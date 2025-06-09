"use client"
import React, { useState } from 'react'
import SelectDefault from '../FormElements/Select/SelectDefault'
import DateRangePicker from '../FormElements/DatePciker/DatePicker'
import InputDefault from '../FormElements/Input/InputDefault'

interface BookingFormProps {
    formData: {
        name: string,
        days: number,
        guests: number,
        location: string
    }
}

const BookingForm = () => {
    const [dateRange, setDateRange] = useState({
        checkIn: null,
        checkOut: null,
    });

    const handleDateChange = (checkIn: Date | null, checkOut: Date | null) => {
        setDateRange({ checkIn, checkOut });
    };
    return (
        <form action="">
            <SelectDefault
                label="Region"
                htmlFor="region"
                name="region"
                options={['Tashkent', 'Samarkand', 'Bukhara']}
                customClassesLabel="block text-sm font-medium text-gray-700 mb-1"
                customClassesSelect="w-full border border-gray-300 rounded-lg p-2 text-gray-800 cursor-pointer"
                customClassesOptions="cursor-pointer"
            />
            <div className='w-[1px] h-5 bg-black'></div>
            <DateRangePicker
                onDateChange={handleDateChange}
                className="mb-6"
            />
            <div className='w-[1px] h-5 bg-black'></div>
            <InputDefault type='text' name='' value='Guests' onChange={() => {console.log("Hello")}}/>
        </form>
    )
}

export default BookingForm