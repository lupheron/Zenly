import React, { useState, useEffect, useCallback } from 'react';

interface BookingFormProps {
    onSearch: (params: { location: string; sort: string; guests: string }) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSearch }) => {
    const [formData, setFormData] = useState({
        location: '',
        sort: '',
        guests: ''
    });

    const [locationError, setLocationError] = useState('');
    const [searchDebounceTimer, setSearchDebounceTimer] = useState<NodeJS.Timeout | null>(null);

    // Debounced search function
    const debouncedSearch = useCallback((searchParams: { location: string; sort: string; guests: string }) => {
        // Clear previous timer
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
        }

        // Set new timer
        const timer = setTimeout(() => {
            onSearch(searchParams);
        }, 500); // 500ms delay

        setSearchDebounceTimer(timer);
    }, [onSearch, searchDebounceTimer]);

    const handleLocationChange = (value: string) => {
        setFormData(prev => ({ ...prev, location: value }));

        // Clear error when user starts typing
        if (locationError) {
            setLocationError('');
        }

        // Check if location meets minimum length requirement
        if (value.length > 0 && value.length < 3) {
            setLocationError('Kamida 3 ta harf kiriting');
            // Clear search since location is invalid
            onSearch({ location: '', sort: '', guests: '' });
            return;
        }

        // Auto-trigger search if all fields are filled and location is valid
        const updatedData = { ...formData, location: value };
        if (updatedData.location.length >= 3 && updatedData.sort && updatedData.guests) {
            // Use debounced search to avoid too many requests
            debouncedSearch(updatedData);
        } else if (value.length === 0) {
            // Clear search immediately if location is completely empty
            onSearch({ location: '', sort: '', guests: '' });
        }
    };

    const handleInputChange = (field: string, value: string) => {
        if (field === 'location') {
            handleLocationChange(value);
            return;
        }

        const updatedData = { ...formData, [field]: value };
        setFormData(updatedData);

        // Only trigger search if ALL fields are filled and location is valid (>=3 chars)
        if (updatedData.location.length >= 3 && updatedData.sort && updatedData.guests) {
            // Immediate search for select fields (no debounce needed)
            onSearch(updatedData);
        } else {
            // Clear search if any field becomes empty or invalid
            onSearch({ location: '', sort: '', guests: '' });
        }
    };

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (searchDebounceTimer) {
                clearTimeout(searchDebounceTimer);
            }
        };
    }, [searchDebounceTimer]);

    const isValidForm = formData.location.length >= 3 && formData.sort && formData.guests;

    return (
        <div className="max-w-4xl mx-auto bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Joylashuv
                        <span className="text-gray-500 text-xs ml-1">(kamida 3 harf)</span>
                    </label>
                    <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        placeholder="Masalan: Toshkent, Samarqand..."
                        className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${locationError ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {locationError && (
                        <p className="text-red-500 text-xs mt-1">{locationError}</p>
                    )}
                    {formData.location.length > 0 && (
                        <p className="text-gray-500 text-xs mt-1">
                            {formData.location.length}/3 harf kiritildi
                            {formData.location.length >= 3 && ' - qidiruv 0.5 soniyadan keyin boshlanadi'}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Saralash</label>
                    <select
                        value={formData.sort}
                        onChange={(e) => handleInputChange('sort', e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tanlang</option>
                        <option value="recent">Eng yangi</option>
                        <option value="rating">Eng yuqori reyting</option>
                        <option value="price_low">Arzon narx</option>
                        <option value="price_high">Qimmat narx</option>
                        <option value="popular">Mashhur</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Mehmonlar soni</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.guests}
                        onChange={(e) => handleInputChange('guests', e.target.value)}
                        placeholder="Necha kishi?"
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
                {isValidForm ? (
                    <span className="text-green-600 font-medium">
                        ✓ Qidiruv faol: {formData.location} - {formData.guests} va undan ko&apos;p kishi uchun joylar
                    </span>
                ) : formData.location.length > 0 && formData.location.length < 3 ? (
                    <span className="text-orange-600">
                        Qidiruv uchun yana {3 - formData.location.length} ta harf kerak
                    </span>
                ) : (
                    <span>Qidirishni boshlash uchun barcha maydonlarni to&apos;ldiring</span>
                )}
            </div>
        </div>
    );
};

export default BookingForm;