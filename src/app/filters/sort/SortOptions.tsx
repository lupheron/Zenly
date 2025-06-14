import InputDefault from '@/src/components/FormElements/Input/InputDefault'
import LabelDefault from '@/src/components/FormElements/label/LabelDefault'
import React from 'react'

const SortOptions = () => {
    const onChange = () => {
        console.log("Hello World")
    }
    return (
        <div className='flex flex-col items-center gap-2'>
            <LabelDefault label="Ko'p Ko'rilgan" htmlFor='checkbox' />
            <InputDefault type='radio' name='sort' onChange={() => onChange} />
        </div>
    )
}

export default SortOptions