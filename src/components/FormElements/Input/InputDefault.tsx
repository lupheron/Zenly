import React from 'react'

interface InputProps {
    customClasses?: string;
    type: string;
    name: string;
    placeholder?: string;
    required?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Fixed this line
    value?: string; // You should also add this
}

const InputDefault: React.FC<InputProps> = ({
    customClasses = "",
    name,
    required,
    onChange,
    type,
    placeholder = "",
    value // Add this
}) => {
    return (
        <div className={`${customClasses} flex items-center justify-center`}>
            <input
                type={type}
                name={name}
                onChange={onChange}
                value={value} // Add this
                placeholder={placeholder}
                required={required}
                className={`bg-light-gray px-5 py-5 border-none rounded text-black w-full h-[45px] focus:outline-none ${customClasses}`}
            />
        </div>
    )
}

export default InputDefault