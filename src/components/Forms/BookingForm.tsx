import React from 'react'
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
    return (
        <div className='grid grid-cols-2 gap-4'>

            <InputDefault
                value=''
            />
        </div>
    )
}

export default BookingForm