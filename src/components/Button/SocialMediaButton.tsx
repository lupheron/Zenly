import React from 'react';

interface SocialMediaButtonProps {
    icon: React.ReactNode;
    onClick: () => void;
}

const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({ icon, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-gray-300 flex items-center justify-center rounded-full cursor-pointer hover:bg-gray-400 transition-all"
        >
            {icon}
        </button>
    );
};

export default SocialMediaButton;
