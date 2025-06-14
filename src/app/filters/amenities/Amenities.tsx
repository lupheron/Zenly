import InputDefault from '@/src/components/FormElements/Input/InputDefault'
import LabelDefault from '@/src/components/FormElements/label/LabelDefault'
import React from 'react'

const Amenities = () => {
    const onChange = () => {
        console.log("Hello world")
    }
    return (
        <div className='flex items-center gap-3'>
            <InputDefault
                type='checkbox'
                name='amenity'
                onChange={() => onChange}
            />
            <LabelDefault label='WiFi' htmlFor='checkbox' />
        </div>
    )
}

export default Amenities