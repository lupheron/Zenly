import React, { useState } from 'react';

interface SearchPostsProps {
    onSearch: (params: { location: string; sort: string; guests: string }) => void;
}

const SearchPosts: React.FC<SearchPostsProps> = ({ onSearch }) => {
    const [searchData, setSearchData] = useState({
        location: '',
        sort: '',
        guests: ''
    });

    const [errors, setErrors] = useState({
        location: '',
        sort: '',
        guests: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setSearchData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }

        // Auto-trigger search if all fields are filled
        const updatedData = { ...searchData, [field]: value };
        if (updatedData.location && updatedData.sort && updatedData.guests) {
            onSearch(updatedData);
        } else {
            // Clear search if any field becomes empty
            onSearch({ location: '', sort: '', guests: '' });
        }
    };

    const validateForm = () => {
        const newErrors = {
            location: '',
            sort: '',
            guests: ''
        };

        if (!searchData.location.trim()) {
            newErrors.location = 'Joylashuvni tanlang';
        }

        if (!searchData.sort) {
            newErrors.sort = 'Qidiruv turini tanlang';
        }

        if (!searchData.guests || parseInt(searchData.guests) < 1) {
            newErrors.guests = 'A&apos;zolar sonini kiriting (1 dan kam bo&apos;lmasligi kerak)';
        }

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSearch(searchData);
        }
    };

    const clearSearch = () => {
        const emptyData = { location: '', sort: '', guests: '' };
        setSearchData(emptyData);
        setErrors({ location: '', sort: '', guests: '' });
        onSearch(emptyData);
    };

    const sortOptions = [
        { value: 'recent', label: 'Eng yangi' },
        { value: 'rating', label: 'Eng yuqori reyting' },
        { value: 'price_low', label: 'Arzon narx' },
        { value: 'price_high', label: 'Qimmat narx' },
        { value: 'popular', label: 'Mashhur' }
    ];

    const hasAllFields = Boolean(searchData.location && searchData.sort && searchData.guests);

    return (
        <div className="mt-10 max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Joy qidirish</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Location Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Joylashuv *
                        </label>
                        <input
                            type="text"
                            value={searchData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder="Masalan: Toshkent, Samarqand..."
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.location && (
                            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                        )}
                    </div>

                    {/* Sort Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Qidiruv turi *
                        </label>
                        <select
                            value={searchData.sort}
                            onChange={(e) => handleInputChange('sort', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sort ? 'border-red-500' : 'border-gray-300'
                                }`}
                        >
                            <option value="">Tanlang...</option>
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.sort && (
                            <p className="text-red-500 text-xs mt-1">{errors.sort}</p>
                        )}
                    </div>

                    {/* Guests Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            A&apos;zolar soni *
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={searchData.guests}
                            onChange={(e) => handleInputChange('guests', e.target.value)}
                            placeholder="Necha kishi?"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.guests ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.guests && (
                            <p className="text-red-500 text-xs mt-1">{errors.guests}</p>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                        type="submit"
                        disabled={!hasAllFields}
                        className={`flex-1 px-6 py-2 rounded-md font-medium transition-colors ${hasAllFields
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {hasAllFields ? 'Qidirish' : "Barcha maydonlarni to'ldiring"}
                    </button>

                    {hasAllFields && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="flex-1 sm:flex-none px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
                        >
                            Tozalash
                        </button>
                    )}
                </div>

                {/* Search Status */}
                <div className="text-sm text-gray-600">
                    {hasAllFields ? (
                        <div className="flex items-center text-green-600">
                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Qidiruv faol - {searchData.guests} va undan ko&apos;p a&apos;zoga mo&apos;ljallangan joylar ko&apos;rsatilmoqda
                        </div>
                    ) : (
                        <div className="text-gray-500">
                            Qidirishni boshlash uchun barcha maydonlarni to&apos;ldiring
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SearchPosts;