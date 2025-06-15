import React from 'react'

interface InputProps {
    customClasses?: string;
    type: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    onChange(): (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputDefault: React.FC<InputProps> = ({ customClasses = "", name, required, onChange, type, placeholder = "" }) => {
    return (
        <div className={`${customClasses} flex items-center justify-center`}>
            <input
                type={type}
                name={name}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`bg-light-gray px-5 py-5 border-none rounded text-black w-full h-[45px] focus:outline-none ${customClasses}`}
            />
        </div>
    )
}

export default InputDefault