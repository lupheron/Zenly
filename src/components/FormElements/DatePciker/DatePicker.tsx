import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
    onDateChange: (checkIn: Date | null, checkOut: Date | null) => void;
    initialCheckIn?: Date | null;
    initialCheckOut?: Date | null;
    className?: string;
}

export default function DateRangePicker({
    onDateChange,
    initialCheckIn = null,
    initialCheckOut = null,
    className = '',
}: DateRangePickerProps) {
    const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
    const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);

    const handleCheckInChange = (date: Date | null) => {
        setCheckIn(date);
        // Reset check-out if it's before the new check-in
        if (checkOut && date && checkOut < date) {
            setCheckOut(null);
            onDateChange(date, null);
        } else {
            onDateChange(date, checkOut);
        }
    };

    const handleCheckOutChange = (date: Date | null) => {
        setCheckOut(date);
        onDateChange(checkIn, date);
    };

    return (
        <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
            {/* Check-In Date */}
            <div className="w-full">
                <label htmlFor="check-in" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-In
                </label>
                <DatePicker
                    id="check-in"
                    selected={checkIn}
                    onChange={handleCheckInChange}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText="Select check-in"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dateFormat="MMM d, yyyy"
                    isClearable
                    clearButtonClassName="after:bg-blue-500"
                />
            </div>

            {/* Check-Out Date */}
            <div className="w-full">
                <label htmlFor="check-out" className="block text-sm font-medium text-gray-700 mb-1">
                    Check-Out
                </label>
                <DatePicker
                    id="check-out"
                    selected={checkOut}
                    onChange={handleCheckOutChange}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    placeholderText="Select check-out"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dateFormat="MMM d, yyyy"
                    isClearable
                    clearButtonClassName="after:bg-blue-500"
                    disabled={!checkIn}
                />
            </div>
        </div>
    );
}