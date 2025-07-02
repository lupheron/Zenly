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
        <div className="w-45">
            <LabelDefault label={label} htmlFor={htmlFor} customClasses={customClassesLabel} />
            <select
                name={name}
                id={htmlFor}
                value={value}
                onChange={onChange}
                className={`${customClassesSelect}`}
            >
                <option value="">Tanlang</option>
                {options.map((opt, index) => {
                    if (typeof opt === 'string') {
                        return (
                            <option key={index} value={opt} className={`${customClassesOptions}`}>
                                {opt}
                            </option>
                        )
                    } else {
                        return (
                            <option key={index} value={opt.value} className={`${customClassesOptions}`}>
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
