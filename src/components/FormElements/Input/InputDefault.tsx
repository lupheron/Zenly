import React from 'react'

interface InputProps {
    customClasses?: string;
    type: string;
    name: string;
    id?: string; 
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    checked?: boolean;
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
    checked
}) => {
    return (
        <div className={`${customClasses} flex items-center justify-center`}>
            <input
                type={type}
                name={name}
                id={id}
                onChange={onChange}
                value={value}
                checked={checked}
                placeholder={placeholder}
                required={required}
                className={`bg-light-gray px-5 py-5 border-none rounded text-black w-full h-[45px] focus:outline-none ${customClasses}`}
            />
        </div>
    )
}

export default InputDefault
