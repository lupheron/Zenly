import React from 'react'
import AnimatedSelect from './AnimatedSelect'

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
        <AnimatedSelect
            label={label}
            htmlFor={htmlFor}
            name={name}
            customClassesLabel={customClassesLabel}
            customClassesSelect={customClassesSelect}
            customClassesOptions={customClassesOptions}
            options={options}
            value={value}
            onChange={onChange}
            variant="default"
        />
    )
}

export default SelectDefault
