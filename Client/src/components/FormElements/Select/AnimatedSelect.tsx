"use client";

import React, { useState, useRef, useEffect } from 'react';
import LabelDefault from '../label/LabelDefault';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Option {
    label: string;
    value: string;
}

interface AnimatedSelectProps {
    label?: string;
    htmlFor?: string;
    name: string;
    customClassesLabel?: string;
    customClassesSelect?: string;
    customClassesOptions?: string;
    options: string[] | Option[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    // Style variants
    variant?: 'default' | 'compact' | 'large' | 'filter' | 'booking';
}

const AnimatedSelect: React.FC<AnimatedSelectProps> = ({
    label,
    htmlFor,
    name,
    customClassesLabel = '',
    customClassesSelect = '',
    customClassesOptions = '',
    options,
    value = '',
    onChange,
    placeholder = 'Tanlang...',
    required = false,
    disabled = false,
    variant = 'default'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(value);
    const [selectedLabel, setSelectedLabel] = useState('');
    const selectRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get variant-specific styles
    const getVariantStyles = () => {
        switch (variant) {
            case 'compact':
                return {
                    select: 'h-[40px] text-sm px-3 py-2',
                    dropdown: 'text-sm',
                    option: 'text-sm py-2 px-3'
                };
            case 'large':
                return {
                    select: 'h-[60px] text-lg px-5 py-3',
                    dropdown: 'text-lg',
                    option: 'text-lg py-3 px-5'
                };
            case 'filter':
                return {
                    select: 'border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full sm:w-auto',
                    dropdown: 'text-sm',
                    option: 'text-sm py-2 px-3'
                };
            case 'booking':
                return {
                    select: 'w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    dropdown: 'text-base',
                    option: 'text-base py-3 px-4'
                };
            default:
                return {
                    select: 'h-[40px] sm:h-[45px] md:h-[50px] border border-gray-300 rounded px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-0 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent',
                    dropdown: 'text-sm sm:text-base',
                    option: 'text-sm sm:text-base py-2 px-3'
                };
        }
    };

    const variantStyles = getVariantStyles();

    // Update selected label when value changes
    useEffect(() => {
        if (value) {
            const option = options.find(opt => 
                typeof opt === 'string' ? opt === value : opt.value === value
            );
            if (option) {
                setSelectedLabel(typeof option === 'string' ? option : option.label);
            }
        } else {
            setSelectedLabel('');
        }
        setSelectedValue(value);
    }, [value, options]);

    // Handle option selection
    const handleOptionSelect = (optionValue: string, optionLabel: string) => {
        setSelectedValue(optionValue);
        setSelectedLabel(optionLabel);
        setIsOpen(false);
        
        // Create synthetic event for onChange
        if (onChange) {
            const syntheticEvent = {
                target: {
                    name,
                    value: optionValue
                }
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange(syntheticEvent);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="w-full relative" ref={selectRef}>
            {label && (
                <LabelDefault 
                    label={label} 
                    htmlFor={htmlFor || name} 
                    customClasses={customClassesLabel} 
                />
            )}
            
            <div
                className={`
                    ${variantStyles.select}
                    ${customClassesSelect}
                    cursor-pointer
                    flex items-center justify-between
                    transition-all duration-200 ease-in-out
                    ${isOpen ? 'ring-2 ring-light-green border-transparent' : ''}
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
                `}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                tabIndex={disabled ? -1 : 0}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={`${name}-dropdown`}
                aria-label={label || name}
            >
                <span className={`${selectedLabel ? 'text-gray-900' : 'text-gray-500'} ${variantStyles.dropdown}`}>
                    {selectedLabel || placeholder}
                </span>
                <KeyboardArrowDownIcon 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`} 
                />
            </div>

            {/* Dropdown */}
            <div
                ref={dropdownRef}
                className={`
                    absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg
                    transition-all duration-200 ease-in-out
                    ${isOpen 
                        ? 'opacity-100 visible transform translate-y-0' 
                        : 'opacity-0 invisible transform -translate-y-2'
                    }
                    max-h-60 overflow-y-auto
                `}
                role="listbox"
                id={`${name}-dropdown`}
            >
                {options.map((option, index) => {
                    const optionValue = typeof option === 'string' ? option : option.value;
                    const optionLabel = typeof option === 'string' ? option : option.label;
                    const isSelected = selectedValue === optionValue;

                    return (
                        <div
                            key={index}
                            className={`
                                ${variantStyles.option}
                                ${customClassesOptions}
                                cursor-pointer
                                transition-all duration-150 ease-in-out
                                hover:bg-light-green hover:text-white
                                ${isSelected ? 'bg-light-green text-white' : 'text-gray-900'}
                                first:rounded-t-md last:rounded-b-md
                            `}
                            onClick={() => handleOptionSelect(optionValue, optionLabel)}
                            role="option"
                            aria-selected={isSelected}
                        >
                            {optionLabel}
                        </div>
                    );
                })}
            </div>

            {/* Hidden select for form compatibility */}
            <select
                name={name}
                id={htmlFor || name}
                value={selectedValue}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className="sr-only"
                tabIndex={-1}
            >
                <option value="">{placeholder}</option>
                {options.map((option, index) => {
                    const optionValue = typeof option === 'string' ? option : option.value;
                    const optionLabel = typeof option === 'string' ? option : option.label;
                    return (
                        <option key={index} value={optionValue}>
                            {optionLabel}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default AnimatedSelect;
