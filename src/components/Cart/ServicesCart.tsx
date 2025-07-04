import React from 'react';

interface ServicesCartProps {
    icon: React.ReactNode;
    title: string;
    paragraph: string;
}

const ServicesCart: React.FC<ServicesCartProps> = ({ icon, title, paragraph }) => {
    return (
        <div className="flex flex-col items-center text-center gap-4 bg-light-gray p-4 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg border-2 border-transparent hover:border-green-400 h-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-4xl sm:text-5xl text-primary bg-white rounded-full transition-all duration-300 hover:bg-green-50 hover:text-green-700 border-2 border-transparent hover:border-green-400">
                {icon}
            </div>

            <div className="flex flex-col justify-center gap-2">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h1>
                <p className="text-sm sm:text-base leading-relaxed text-gray-500">{paragraph}</p>
            </div>
        </div>
    );
};

export default ServicesCart;
