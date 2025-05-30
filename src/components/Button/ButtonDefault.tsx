import React from "react";

interface ButtonProps {
    label: string;
    onClick: () => void;
    isDisabled?: boolean;
    customClasses?: string;
    children?: React.ReactNode;
}

const ButtonDefault: React.FC<ButtonProps> = ({ label, onClick, isDisabled = false, customClasses = "", children }) => {
    const defaultClasses = "px-4 py-2 rounded-4xl text-white font-mulish font-semibold transition duration-[300ms] hover:cursor-pointer outline-none";
    const disabledClasses = "bg-gray cursor-not-allowed";
    const enabledClasses = "bg-light-green hover:bg-orange px-8";
    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`${defaultClasses} ${isDisabled ? disabledClasses : enabledClasses} ${customClasses}`}>
            {label}
            {children}
        </button>
    );
};

export default ButtonDefault;