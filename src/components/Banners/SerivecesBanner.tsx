import Image from 'next/image'
import React from 'react'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface ServiceBannerProps {
    title: string,
    paragraph: string,
    src: string
}

const SerivecesBanner: React.FC<ServiceBannerProps> = ({ title, paragraph, src }) => {
    return (
        <div className='w-full bg-white rounded-xl p-5 relative'>
            <h1 className='text-3xl mb-5'>{title}</h1>
            <p className='text-gray-500 mb-10'>{paragraph}</p>
            <button className='absolute top-33 right-10 w-15 h-15 rounded-[50%] bg-white cursor-pointer shadow-lg shadow-black/40'>
                <NavigateNextIcon className='text-black' />
            </button>
            <Image
                width={400}
                height={350}
                src={src}
                alt=''
                className='rounded-2xl'
            />
        </div>
    )
}

export default SerivecesBanner