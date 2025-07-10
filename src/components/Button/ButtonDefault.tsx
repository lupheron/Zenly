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
    const defaultClasses =
        "px-4 py-2 rounded-4xl text-white font-mulish font-semibold transition duration-300 outline-none";
    const disabledClasses = "bg-gray cursor-not-allowed";
    const enabledClasses = "bg-light-green px-8";

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
