import React from 'react'

interface InputProps {
    customClasses?: string;
    type: string;
    name: string;
    value: string;
    placeholder?: string;
    required?: boolean;
    onChange(): (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ElementType;
}

const InputDefault: React.FC<InputProps> = ({ customClasses = "", name, value, required, onChange, type, placeholder = "", icon: Icon }) => {
    return (
        <div className={`${customClasses} flex items-center justify-center`}>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="bg-light-gray px-5 py-5 border-none rounded text-black w-full h-[45px]"
            />
            <Icon className="text-light-green bg-light-gray w-full h-[45px]" />
        </div>
    )
}

export default InputDefault