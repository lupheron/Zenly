import Image from 'next/image';
import React from 'react';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface ServiceBannerProps {
    title: string;
    paragraph: string;
    src: string;
}

const SerivecesBanner: React.FC<ServiceBannerProps> = ({ title, paragraph, src }) => {
    return (
        <div className="w-full h-full bg-white rounded-xl py-4 sm:p-5 relative flex flex-col items-start">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-5">{title}</h1>

            {/* Paragraph */}
            <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-10">{paragraph}</p>

            {/* Button */}
            <button className="absolute top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white cursor-pointer shadow-lg shadow-black/40 flex items-center justify-center">
                <NavigateNextIcon className="text-black" />
            </button>

            {/* Image */}
            <Image
                width={400}
                height={300}
                src={src}
                alt=""
                className="rounded-2xl w-full object-cover"
            />
        </div>
    );
};

export default SerivecesBanner;
