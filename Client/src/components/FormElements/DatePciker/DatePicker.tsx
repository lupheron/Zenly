import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LabelDefault from '../label/LabelDefault';

interface DateRangePickerProps {
    onDateChange: (checkIn: Date | null, checkOut: Date | null) => void;
    initialCheckIn?: Date | null;
    initialCheckOut?: Date | null;
    className?: string;
    showTimeSelect?: boolean; // new prop to allow datetime selection
    checkInLabel?: string;
    checkOutLabel?: string;
}

export function DateRangePicker({
    onDateChange,
    initialCheckIn = null,
    initialCheckOut = null,
    className = '',
    showTimeSelect = false,
    checkInLabel = 'Kirish',
    checkOutLabel = 'Chiqish',
}: DateRangePickerProps) {
    const [checkIn, setCheckIn] = useState<Date | null>(initialCheckIn);
    const [checkOut, setCheckOut] = useState<Date | null>(initialCheckOut);

    const handleCheckInChange = (date: Date | null) => {
        setCheckIn(date);
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
            <div className="w-full">
                <LabelDefault htmlFor='check-in' label={checkInLabel} customClasses='block text-sm font-medium text-gray-700 mb-1' />
                <DatePicker
                    id="check-in"
                    selected={checkIn}
                    onChange={handleCheckInChange}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={new Date()}
                    placeholderText={checkInLabel + ' Kuni'}
                    className="w-full p-2 border border-gray-300 rounded-md active:border-0 focus:border-transparent"
                    dateFormat={showTimeSelect ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy'}
                    isClearable
                    clearButtonClassName="after:bg-blue-500"
                    showTimeSelect={showTimeSelect}
                    timeFormat="HH:mm"
                />
            </div>

            <div className="w-full">
                <LabelDefault htmlFor='check-out' label={checkOutLabel} customClasses='block text-sm font-medium text-gray-700 mb-1' />
                <DatePicker
                    id="check-out"
                    selected={checkOut}
                    onChange={handleCheckOutChange}
                    selectsEnd
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={checkIn || new Date()}
                    placeholderText={checkOutLabel + ' Kuni'}
                    className="w-full p-2 border border-gray-300 rounded-md active:border-0 focus:border-transparent"
                    dateFormat={showTimeSelect ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy'}
                    isClearable
                    clearButtonClassName="after:bg-blue-500"
                    showTimeSelect={showTimeSelect}
                    timeFormat="HH:mm"
                    disabled={!checkIn}
                />
            </div>
        </div>
    );
}