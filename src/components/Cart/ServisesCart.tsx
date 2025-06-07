import Image from 'next/image'
import React from 'react'

interface ServisesCartProps {
    img: string,
    title: string,
    paragraph: string
}

const ServisesCart: React.FC<ServisesCartProps> = ({ img, title, paragraph }) => {
    return (
        <div className='flex items-center justify-center gap-10 bg-light-gray'>
            <Image
                width={200}
                height={150}
                src={img}
                alt=''
            />

            <div className='flex flex-col items-center justify-center gap-7'>
                <h1>{title}</h1>
                <p>{paragraph}</p>
            </div>
        </div>
    )
}

export default ServisesCart