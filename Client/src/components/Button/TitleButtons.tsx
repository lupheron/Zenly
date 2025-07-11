import React from 'react'

interface TitleButtonProps {
    label: string;
    customClasses?: string;
}


const TitleButtons: React.FC<TitleButtonProps> = ({ label, customClasses }) => {
    const defaultCalss = "w-50 h-10 rounded flex justify-center items-center"
    return (
        <button className={`${customClasses} ${defaultCalss}`}>
            {label}
        </button>
    )
}

export default TitleButtons