import Image from 'next/image'
import React from 'react'

interface AboutBannerProps {
    img: string,
    title: string,
    paragraph: string
}

const AboutBanner: React.FC<AboutBannerProps> = ({ img, title, paragraph }) => {
    return (
        <div className="relative w-full h-[550px] group overflow-hidden">
            <div className="w-full h-full">
                <Image
                    width={1000}
                    height={600}
                    src={img}
                    alt=""
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>

            <div className="absolute bottom-10 left-10 right-10 bg-white p-6 transition-all duration-500 ease-in-out h-[120px] group-hover:h-[160px] overflow-hidden rounded-xl">
                <div className="h-full flex flex-col">
                    <div className="flex-1">
                        <div className='w-20 h-[0.5px] bg-dark-green mb-2'></div>
                        <div className="flex items-center justify-between">
                            <h1 className="text-xl font-semibold">{title}</h1>
                            <button className='rounded-full border-none bg-light-green w-12 h-12 flex items-center justify-center cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-right text-white" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-in-out">
                        <p className="text-sm mt-2">{paragraph}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutBanner