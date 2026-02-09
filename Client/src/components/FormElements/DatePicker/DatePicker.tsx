import { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import LabelDefault from '../label/LabelDefault';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface DateRangePickerProps {
    onDateChange: (checkIn: Date | null, checkOut: Date | null) => void;
    initialCheckIn?: Date | null;
    initialCheckOut?: Date | null;
    className?: string;
    showTimeSelect?: boolean;
    checkInLabel?: string;
    checkOutLabel?: string;
}

const CustomInput = forwardRef(({ value, onClick, placeholder, className, icon }: any, ref: any) => (
    <div className="relative w-full group" onClick={onClick} ref={ref}>
        <input
            readOnly
            value={value}
            placeholder={placeholder}
            className={`w-full p-2.5 pl-10 border border-gray-300 rounded-lg focus:outline-none cursor-pointer transition-all duration-200 bg-white hover:border-gray-400 ${className}`}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
            {icon || <CalendarMonthIcon fontSize="small" />}
        </div>
    </div>
));

CustomInput.displayName = 'CustomInput';

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
                    placeholderText={checkInLabel}
                    customInput={<CustomInput />}
                    dateFormat={showTimeSelect ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy'}
                    isClearable
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
                    placeholderText={checkOutLabel}
                    customInput={<CustomInput />}
                    dateFormat={showTimeSelect ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy'}
                    isClearable
                    showTimeSelect={showTimeSelect}
                    timeFormat="HH:mm"
                    disabled={!checkIn}
                />
            </div>
        </div>
    );
}

interface DatePickerDefaultProps {
    label?: string;
    value: Date | null;
    onChange: (date: Date | null) => void;
    placeholder?: string;
    className?: string;
    showTimeSelect?: boolean;
    minDate?: Date | null;
    maxDate?: Date | null;
}

export function DatePickerDefault({
    label,
    value,
    onChange,
    placeholder,
    className = '',
    showTimeSelect = false,
    minDate,
    maxDate,
    id
}: DatePickerDefaultProps & { id?: string }) {
    const internalId = id || `date-picker-${Math.random().toString(36).substr(2, 9)}`;
    return (
        <div className={`w-full ${className}`}>
            {label && <LabelDefault label={label} htmlFor={internalId} customClasses='block text-sm font-medium text-gray-700 mb-1' />}
            <DatePicker
                id={internalId}
                selected={value}
                onChange={onChange}
                placeholderText={placeholder}
                customInput={<CustomInput />}
                dateFormat={showTimeSelect ? 'MMM d, yyyy HH:mm' : 'MMM d, yyyy'}
                isClearable
                showTimeSelect={showTimeSelect}
                timeFormat="HH:mm"
                minDate={minDate || undefined}
                maxDate={maxDate || undefined}
            />
        </div>
    );
}
