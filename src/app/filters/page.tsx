import React from 'react'
import Amenities from './amenities/Amenities'

interface FilterProps {
    selectedAmenities: string[];
    onAmenitiesChange: (selected: string[]) => void;
}

const Filter: React.FC<FilterProps> = ({ selectedAmenities, onAmenitiesChange }) => {
    return (
        <div className='flex flex-col gap-10 bg-white rounded-xl w-[15%] p-5'>
            <div>
                <h2 className='text-2xl font-semibold'>Amenities</h2>
                <Amenities selectedAmenities={selectedAmenities} onChange={onAmenitiesChange} />
            </div>
        </div>
    );
};

export default Filter;