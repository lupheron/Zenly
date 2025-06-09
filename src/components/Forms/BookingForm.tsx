import React from 'react'
import SelectDefault from '../FormElements/Select/SelectDefault'

interface BookingFormProps {
    formData: {
        name: string,
        days: number,
        guests: number,
        location: string
    }
}

const BookingForm = () => {
    return (
        <div className='grid grid-cols-2 gap-4'>
            <SelectDefault
                label="Region"
                htmlFor="region"
                name="region"
                options={['Tashkent', 'Samarkand', 'Bukhara']}
                customClassesLabel="block text-sm font-medium text-gray-700 mb-1"
                customClassesSelect="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
            />
        </div>
    )
}

export default BookingForm