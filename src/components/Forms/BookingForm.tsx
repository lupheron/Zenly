'use client'

import React, { useState } from 'react'
import SelectDefault from '../FormElements/Select/SelectDefault'
import InputDefault from '../FormElements/Input/InputDefault'
import ButtonDefault from '../Button/ButtonDefault'
import LabelDefault from '../FormElements/label/LabelDefault'
import SearchIcon from '@mui/icons-material/Search';

interface BookingFormProps {
    onSearch: (params: {
        location: string;
        sort: string;
        guests: string;
    }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSearch }) => {
    const [location, setLocation] = useState<string>('');
    const [sort, setSort] = useState<string>('');
    const [guests, setGuests] = useState<string>('');

    const sortOptions = [
        { value: 'rating', label: 'Reyting' },
        { value: 'price_low', label: 'Narxi (Eng arzon)' },
        { value: 'price_high', label: 'Narxi (Eng qimmat)' },
        { value: 'recent', label: 'Oxirgi joylanganlar' }
    ];

    const locations = [
        { label: 'Andijon', value: 'Andijon' },
        { label: 'Buxoro', value: 'Buxoro' },
        { label: 'Fargʻona', value: 'Fargʻona' },
        { label: 'Jizzax', value: 'Jizzax' },
        { label: 'Xorazm', value: 'Xorazm' },
        { label: 'Namangan', value: 'Namangan' },
        { label: 'Navoiy', value: 'Navoiy' },
        { label: 'Qashqadaryo', value: 'Qashqadaryo' },
        { label: 'Qoraqalpogʻiston', value: 'Qoraqalpogʻiston' },
        { label: 'Samarqand', value: 'Samarqand' },
        { label: 'Sirdaryo', value: 'Sirdaryo' },
        { label: 'Surxondaryo', value: 'Surxondaryo' },
        { label: 'Toshkent viloyati', value: 'Toshkent viloyati' },
        { label: 'Toshkent shahri', value: 'Toshkent shahri' }
    ];

    const handleSearch = () => {
        onSearch({
            location,
            sort,
            guests
        });
    };

    return (
        <div className="w-full lg:w-[90%] xl:w-[55%] mx-auto px-4 sm:px-6">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                className="flex flex-col md:flex-row h-auto md:h-30 items-center justify-between p-4 md:px-6 lg:px-10 bg-white rounded-lg shadow-sm gap-4 md:gap-0"
            >
                <div className="w-full md:px-4 lg:px-5 md:w-60">
                    <SelectDefault
                        label="Shahar"
                        htmlFor="region"
                        name="region"
                        options={locations}
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        customClassesLabel="block text-sm font-medium text-gray-700 mb-1"
                        customClassesSelect="w-full border border-gray-300 rounded-lg p-2 text-gray-800 cursor-pointer focus:outline-none"
                        customClassesOptions="cursor-pointer"
                    />
                </div>

                <div className="hidden md:block border-r-gray-300 border-r w-[1px] h-16"></div>

                <div className="w-full md:w-auto md:px-4 lg:px-5 md:w-60">
                    <SelectDefault
                        label="Saralash"
                        htmlFor="sort"
                        name="sort"
                        options={sortOptions}
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        customClassesLabel="block text-sm font-medium text-gray-700 mb-1"
                        customClassesSelect="w-full border border-gray-300 rounded-lg p-2 text-gray-800 cursor-pointer focus:outline-none"
                        customClassesOptions="cursor-pointer"
                    />
                </div>

                <div className="hidden md:block border-r-gray-300 border-r w-[1px] h-16"></div>

                <div className="w-full md:w-auto md:px-4 lg:px-5">
                    <LabelDefault htmlFor="guests" label="Odam Soni" />
                    <InputDefault
                        type="number"
                        name="guests"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="Odam Soni"
                        customClasses="w-full"
                    />
                </div>

                <ButtonDefault
                    label={<SearchIcon fontSize="large" />}
                    type="submit"
                    customClasses=" rounded-lg md:rounded-[50%] w-[100%] h-15 md:w-15 md:h-15 flex items-center justify-center mt-4 md:mt-0"
                />
            </form>
        </div>
    )
}

export default BookingForm