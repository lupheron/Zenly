import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'
import Image from 'next/image'

interface IntroProps {
    title: string;
    text: string;
    customClasses?: string;
    src: string;
    alt: string;
}

const IntroSlider: React.FC<IntroProps> = ({ title, text, src, alt }) => {
    return (
        <div className='text-white'>
            <div className='flex flex-wrap justify-between items-center gap-20'>
                <div className='w-[650px]'>
                    <h1 className='text-6xl w-[500px] font-black mb-10'>{title}</h1>
                    <div className='flex flex-wrap justify-between items-center'>
                        <p className='w-[300px]'>{text}</p>
                        <ButtonDefault
                            label="Batafsil Ma'lumot"
                            onClick={() => { console.log("Clicked") }}
                            isDisabled={false}
                            customClasses='transform transition duration-300 translateX-2'
                        />
                    </div>
                </div>
                <div>
                    <Image
                        src={src}
                        alt={alt}
                        width={850}
                        height={850}
                        className='rounded-[3%]'
                    />
                </div>
            </div>
        </div>
    )
}

export default IntroSlider