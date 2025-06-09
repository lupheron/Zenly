"use client"
import React, { useState } from 'react'
import SelectDefault from '../FormElements/Select/SelectDefault'
import DateRangePicker from '../FormElements/DatePciker/DatePicker'
import InputDefault from '../FormElements/Input/InputDefault'
import ButtonDefault from '../Button/ButtonDefault'
import LabelDefault from '../FormElements/label/LabelDefault'

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

    const onChange = () => {
        console.log("Hello World")
    }
    return (
        <div className='w-[55%] mx-auto'>
            <form
                action=""
                className='flex items-center justify-between px-10 bg-white rounded-lg shadow-sm'
            >
                <div className='px-5 border-r-gray-300 border-r-1'>
                    <SelectDefault
                        label="Shahar"
                        htmlFor="region"
                        name="region"
                        options={['Tashkent', 'Samarkand', 'Bukhara']}
                        customClassesLabel="block text-sm font-medium text-gray-700 mb-1"
                        customClassesSelect="w-full border border-gray-300 rounded-lg p-2 text-gray-800 cursor-pointer"
                        customClassesOptions="cursor-pointer"
                    />
                </div>
                <div className='mt-5 px-5'>
                    <DateRangePicker
                        onDateChange={handleDateChange}
                        className="mb-6"
                    />
                </div>
                <div className='border-r-gray-300 border-r-1 w-1 h-16'></div>
                <div className='px-5'>
                    <LabelDefault htmlFor='text' label='Odam Soni'/>
                    <InputDefault
                        type='text'
                        name=''
                        onChange={() => onChange}
                        placeholder='Odam Soni'
                    />
                </div>

                <ButtonDefault
                    label='Qidirish'
                    onClick={() => { }}
                />
            </form>
        </div>
    )
}

export default BookingForm