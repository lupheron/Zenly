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
        { value: 'Toshkent', label: 'Toshkent' },
        { value: 'Samarqand', label: 'Samarqand' },
        { value: 'Buxoro', label: 'Buxoro' }
    ];

    const handleSearch = () => {
        onSearch({
            location,
            sort,
            guests
        });
    };

    return (
        <div className="w-[55%] mx-auto">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                className="flex h-30 items-center justify-between px-10 bg-white rounded-lg shadow-sm"
            >
                <div className="px-5 border-r-gray-300 border-r">
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

                <div className="px-5">
                    <SelectDefault
                        label="Saralash"
                        htmlFor="sort"
                        name="sort"
                        options={sortOptions}
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        customClassesLabel="block text-sm font-medium text-gray-700 mb-1"
                        customClassesSelect="w-full border border-gray-300 rounded-lg p-2 text-gray-800 cursor-pointer focus:outline-none "
                        customClassesOptions="cursor-pointer"
                    />
                </div>

                <div className="border-r-gray-300 border-r w-[1px] h-16"></div>

                <div className="px-5">
                    <LabelDefault htmlFor="guests" label="Odam Soni" />
                    <InputDefault
                        type="number"
                        name="guests"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="Odam Soni"
                    />
                </div>

                <ButtonDefault
                    label={<SearchIcon fontSize="large" />}
                    type="submit"
                    customClasses="rounded-[50%] w-15 h-15 flex items-center justify-center"
                />
            </form>
        </div>
    )
}

export default BookingForm
