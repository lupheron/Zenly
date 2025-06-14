import React from 'react'
import Amenities from './amenities/Amenities'
import SortOptions from './sort/SortOptions'

const Filter = () => {
    return (
        <div className='flex flex-col gap-10 bg-white rounded-xl w-[15%] p-5'>
            <div>
                <h2 className='text-2xl font-semibold'>Sort Options</h2>
                <SortOptions />
            </div>
            <div>
                <h2 className='text-2xl font-semibold'>Amenities</h2>
                <Amenities />
            </div>
        </div>
    )
}

export default Filter