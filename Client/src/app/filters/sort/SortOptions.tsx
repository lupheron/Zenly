import InputDefault from '@/src/components/FormElements/Input/InputDefault'
import LabelDefault from '@/src/components/FormElements/label/LabelDefault'
import React from 'react'

const sortOptions = [
    { value: 'rating', label: 'Reyting' },
    { value: 'price', label: 'Narxi' },
    { value: 'date', label: 'Oxirgi joylanganlar' }
]

const SortOptions = () => {
    const onChange = (value: string) => {
        console.log("Selected sort:", value)
    }

    return (
        <div className='flex flex-col justify-center'>
            {sortOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2 h-8">
                    <InputDefault
                        type='radio'
                        name='sort'
                        id={option.value}
                        onChange={() => onChange(option.value)}
                    />
                    <LabelDefault label={option.label} htmlFor={option.value} />
                </div>
            ))}
        </div>
    )
}

export default SortOptions
