import React from 'react'
import LabelDefault from '../label/LabelDefault'

interface Option {
    label: string;
    value: string;
}

interface SelectDefaultProps {
    label: string;
    htmlFor: string;
    name: string;
    customClassesLabel?: string;
    customClassesSelect?: string;
    customClassesOptions?: string;
    options: string[] | Option[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectDefault: React.FC<SelectDefaultProps> = ({
    label,
    htmlFor,
    name,
    customClassesLabel = '',
    customClassesSelect = '',
    customClassesOptions = '',
    options,
    value,
    onChange
}) => {
    return (
        <div className="w-full">
            <LabelDefault label={label} htmlFor={htmlFor} customClasses={customClassesLabel} />
            <select
                name={name}
                id={htmlFor}
                value={value}
                onChange={onChange}
                className={`h-[40px] sm:h-[45px] md:h-[50px] border border-gray-300 rounded px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-0 text-sm sm:text-base bg-white focus:outline-none focus:ring-2 focus:ring-light-green focus:border-transparent ${customClassesSelect}`}
            >
                {options.map((opt, index) => {
                    if (typeof opt === 'string') {
                        return (
                            <option key={index} value={opt} className={`py-2 ${customClassesOptions}`}>
                                {opt}
                            </option>
                        )
                    } else {
                        return (
                            <option key={index} value={opt.value} className={`py-2 ${customClassesOptions}`}>
                                {opt.label}
                            </option>
                        )
                    }
                })}
            </select>
        </div>
    )
}

export default SelectDefault
