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
    return (
        <div className={`${customClasses} flex items-center justify-center w-full`}>
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
                className={`bg-light-gray px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 border-none rounded text-black w-full h-[40px] sm:h-[45px] md:h-[50px] focus:outline-none text-sm sm:text-base ${customClasses}`}
            />
        </div>
    )
}

export default InputDefault
