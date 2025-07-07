import React from 'react'
import Amenities from './amenities/Amenities'

interface FilterProps {
    selectedAmenities: string[];
    onAmenitiesChange: (selected: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({ selectedAmenities, onAmenitiesChange }) => {
    return (
        <div className='flex flex-col gap-4 md:gap-6 bg-white rounded-xl w-full lg:w-[35%] xl:w-[20%] p-4 md:p-5'>
            <div>
                <h2 className='text-lg md:text-xl lg:text-2xl font-semibold'>Amenities</h2>
                <Amenities selectedAmenities={selectedAmenities} onChange={onAmenitiesChange} />
            </div>
        </div>
    )
};

export default Filter;