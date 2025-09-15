import React from 'react'

interface TitleButtonProps {
    label: string;
    customClasses?: string;
    onClick?: () => void;
}


const TitleButtons: React.FC<TitleButtonProps> = ({ label, customClasses, onClick }) => {
    const defaultCalss = "w-50 h-10 rounded flex justify-center items-center"
    return (
        <button className={`${customClasses} ${defaultCalss}`} onClick={onClick}>
            {label}
        </button>
    )
}

export default TitleButtons