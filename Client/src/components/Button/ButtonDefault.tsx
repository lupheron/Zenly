import React from "react";

interface ButtonProps {
    label?: string | React.ReactNode;
    onClick?: () => void;
    isDisabled?: boolean;
    customClasses?: string;
    children?: React.ReactNode;
    type?: "button" | "submit" | "reset";
}

const ButtonDefault: React.FC<ButtonProps> = ({
    label,
    onClick,
    isDisabled = false,
    customClasses = "",
    children,
    type = "button"
}) => {
    const defaultClasses = "px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-2 md:py-2 rounded-4xl text-white font-mulish font-semibold transition duration-300 outline-none text-sm sm:text-base md:text-md";
    const disabledClasses = "bg-gray cursor-not-allowed";
    const enabledClasses = "bg-light-green";

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            type={type}
            className={`cursor-pointer ${defaultClasses} ${isDisabled ? disabledClasses : enabledClasses} ${customClasses}`}
        >
            {label}
            {children}
        </button>
    );
};

export default ButtonDefault;
