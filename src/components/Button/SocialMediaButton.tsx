import React from 'react'

interface SocialMediaButtonProps {
    icon: string;
    onCLick: () => void;
}

const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({ icon, onCLick }) => {
    return (
        <button
            onClick={onCLick}
            className="w-12 h-12 bg-gray-300 rounded-[50%] cursor-pointer"
        >
            {icon}
        </button>
    )
}

export default SocialMediaButton