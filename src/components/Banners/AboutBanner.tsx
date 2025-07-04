import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface AboutBannerProps {
    img: string;
    title: string;
    paragraph: string;
}

const AboutBanner: React.FC<AboutBannerProps> = ({ img, title, paragraph }) => {
    return (
        <div className="relative w-full h-[350px] sm:h-[400px] md:h-[450px] lg:h-[500px] group overflow-hidden z-1 rounded-xl">
            <Image
                src={img}
                alt={title}
                width={1000}
                height={600}
                className="w-full h-full object-cover rounded-xl"
            />

            <div className="absolute bottom-4 left-4 right-4 bg-white p-4 sm:p-6 transition-all duration-500 ease-in-out group-hover:h-[180px] rounded-xl flex flex-col justify-between overflow-hidden">
                <div>
                    <div className="w-16 h-[2px] bg-dark-green mb-2"></div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-lg sm:text-xl font-semibold">{title}</h1>
                        <Link href="/posts">
                            <button className="rounded-full border-none bg-light-green w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-arrow-right text-white" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                </svg>
                            </button>
                        </Link>
                    </div>
                </div>

                <div className="hidden sm:block transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                    <p className="text-sm mt-2">{paragraph}</p>
                </div>
            </div>
        </div>
    );
};

export default AboutBanner;
