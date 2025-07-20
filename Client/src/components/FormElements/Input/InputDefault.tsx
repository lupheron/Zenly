import React from 'react'

interface InputProps {
    customClasses?: string;
    type: string;
    name: string;
    id?: string; 
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string | number; 
    checked?: boolean;
    maxLength?: number;
}

const InputDefault: React.FC<InputProps> = ({
    customClasses = "",
    name,
    id,
    required,
    onChange,
    type,
    placeholder = "",
    value,
    checked,
    maxLength
}) => {
    const getInputClasses = () => {
        if (type === 'checkbox') {
            return `w-4 h-4 bg-gray-100 border-gray-300 rounded ${customClasses}`
        }
        
        return `bg-light-gray px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 border-none rounded text-black w-full h-[40px] sm:h-[45px] md:h-[50px] focus:outline-none text-sm sm:text-base ${customClasses}`
    }

    const getContainerClasses = () => {
        if (type === 'checkbox') {
            return `${customClasses} flex items-center justify-center`
        }
        
        return `${customClasses} flex items-center justify-center w-full`
    }

    return (
        <div className={getContainerClasses()}>
            <input
                type={type}
                name={name}
                id={id}
                onChange={onChange}
                value={value}
                checked={checked}
                placeholder={placeholder}
                required={required}
                maxLength={maxLength}
                className={getInputClasses()}
            />
        </div>
    )
}

export default InputDefault
