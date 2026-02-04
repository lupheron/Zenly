import React, { useState } from 'react';
import AnimatedSelect from '@/src/components/FormElements/Select/AnimatedSelect';
import { useLanguage } from '@/src/contexts/LanguageContext';

interface SearchPostsProps {
    onSearch: (params: { location: string; sort: string; guests: string }) => void;
}

const SearchPosts: React.FC<SearchPostsProps> = ({ onSearch }) => {
    const { t } = useLanguage();
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
            newErrors.location = t('searchPosts.locationError');
        }

        if (!searchData.sort) {
            newErrors.sort = t('searchPosts.searchTypeError');
        }

        if (!searchData.guests || parseInt(searchData.guests) < 1) {
            newErrors.guests = t('searchPosts.guestsError');
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
        { value: 'recent', label: t('searchPosts.sort.recent') },
        { value: 'rating', label: t('searchPosts.sort.rating') },
        { value: 'price_low', label: t('searchPosts.sort.priceLow') },
        { value: 'price_high', label: t('searchPosts.sort.priceHigh') },
        { value: 'popular', label: t('searchPosts.sort.popular') }
    ];

    const hasAllFields = Boolean(searchData.location && searchData.sort && searchData.guests);

    return (
        <div className="mt-10 max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-4 md:p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">{t('searchPosts.title')}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Location Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('searchPosts.location')} *
                        </label>
                        <input
                            type="text"
                            value={searchData.location}
                            onChange={(e) => handleInputChange('location', e.target.value)}
                            placeholder={t('searchPosts.locationPlaceholder')}
                            className={`w-full h-12.5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.location ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.location && (
                            <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                        )}
                    </div>

                    {/* Sort Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('searchPosts.searchType')} *
                        </label>
                        <AnimatedSelect
                            name="sort"
                            value={searchData.sort}
                            onChange={(e) => handleInputChange('sort', e.target.value)}
                            placeholder={t('searchPosts.select')}
                            customClassesSelect={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.sort ? 'border-red-500' : 'border-gray-300'}`}
                            options={sortOptions}
                        />
                        {errors.sort && (
                            <p className="text-red-500 text-xs mt-1">{errors.sort}</p>
                        )}
                    </div>

                    {/* Guests Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('searchPosts.guests')} *
                        </label>
                        <input
                            type="number"
                            min="1"
                            value={searchData.guests}
                            onChange={(e) => handleInputChange('guests', e.target.value)}
                            placeholder={t('searchPosts.guestsPlaceholder')}
                            className={`w-full h-12.5 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.guests ? 'border-red-500' : 'border-gray-300'
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
                        {hasAllFields ? t('searchPosts.search') : t('searchPosts.fillAll')}
                    </button>

                    {hasAllFields && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="flex-1 sm:flex-none px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
                        >
                            {t('searchPosts.clear')}
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
                            {t('searchPosts.activeSearch').replace('{count}', searchData.guests)}
                        </div>
                    ) : (
                        <div className="text-gray-500">
                            {t('searchPosts.startSearch')}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default SearchPosts;