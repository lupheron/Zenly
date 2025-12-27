import React from 'react'
import Amenities from './amenities/Amenities'
import { useLanguage } from '@/src/contexts/LanguageContext'

interface FilterProps {
    selectedAmenities: string[];
    onAmenitiesChange: (selected: string[]) => void;
    customClasses?: string
}

const Filter: React.FC<FilterProps> = ({ selectedAmenities, onAmenitiesChange, customClasses = '' }) => {
    const { t } = useLanguage()
    return (
        <div className={`flex flex-col gap-4 md:gap-6 bg-white rounded-xl w-full lg:w-[35%] xl:w-[20%] p-4 md:p-5 ${customClasses}`}>
            <div>
                <h2 className='text-lg md:text-xl lg:text-2xl font-semibold mb-5'>{t('amenities.title')}</h2>
                <Amenities selectedAmenities={selectedAmenities} onChange={onAmenitiesChange} />
            </div>
        </div>
    )
};

export default Filter;