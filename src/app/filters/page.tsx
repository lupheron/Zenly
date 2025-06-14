import React from 'react'
import Amenities from './amenities/Amenities'
import SortOptions from './sort/SortOptions'

const Filter = () => {
    return (
        <div className=''>
            <h2>Amenities</h2>
            <Amenities />
            <h2>Sort Options</h2>
            <SortOptions />
        </div>
    )
}

export default Filter