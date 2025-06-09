import React from 'react'
import LabelDefault from '../label/LabelDefault'

interface SelectDefaultProps {
    label: string;
    htmlFor: string;
    name: string;
    customClassesLabel?: string;
    customClassesSelect?: string;
    customClassesOptions?: string;
    options: string[];
}


const SelectDefault: React.FC<SelectDefaultProps> = ({
    label,
    htmlFor,
    name,
    customClassesLabel = '',
    customClassesSelect = '',
    customClassesOptions = '',
    options
}) => {
    return (
        <div>
            <LabelDefault label={label} htmlFor={htmlFor} customClasses={customClassesLabel} />
            <select
                name={name}
                id={htmlFor}
                className={`${customClassesSelect}`}
            >
                <option value="">Select an option</option>
                {options.map((opt, index) => (
                    <option key={index} value={opt} className={`${customClassesOptions}`}>
                        {opt}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectDefault