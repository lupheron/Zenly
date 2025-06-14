import InputDefault from '@/src/components/FormElements/Input/InputDefault'
import LabelDefault from '@/src/components/FormElements/label/LabelDefault'
import React from 'react'

const amenities = [
    { value: 'wifi', label: 'Wi-Fi' },
    { value: 'kitchen', label: 'Tashqi va ichki oshxona' },
    { value: 'bathroom', label: 'Shaxsiy hammom' },
    { value: 'climate', label: 'Isitish / Konditsioner' },
    { value: 'spa', label: 'Sauna / Issiq vannalar' },
    { value: 'bbq', label: 'Mangal / Kamin' },
    { value: 'parking', label: 'Avtoturargoh' },
    { value: 'pool', label: 'Suzish havzasi' },
]

const Amenities = () => {
    const onChange = (value: string) => {
        console.log("Selected amenity:", value)
    }

    return (
        <div className='flex flex-wrap'>
            {amenities.map((item) => (
                <div key={item.value} className='flex items-center gap-2'>
                    <InputDefault
                        type='checkbox'
                        name='amenity'
                        id={item.value}
                        onChange={() => onChange(item.value)}
                    />
                    <LabelDefault label={item.label} htmlFor={item.value} />
                </div>
            ))}
        </div>
    )
}

export default Amenities
