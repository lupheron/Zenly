import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'
import Image from 'next/image'
import { motion } from "framer-motion";


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
                    <motion.h1
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className='text-6xl w-[500px] font-black mb-10'
                    >
                        {title}
                    </motion.h1>
                    <div className='flex flex-wrap justify-between items-center'>
                        <motion.p
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className='w-[300px]'
                        >
                            {text}
                        </motion.p>
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <ButtonDefault
                                label="Batafsil Ma'lumot"
                                onClick={() => { console.log("Clicked") }}
                                isDisabled={false}
                            />
                        </motion.div>
                    </div>
                </div>
                <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <Image
                        src={src}
                        alt={alt}
                        width={850}
                        height={850}
                        className='rounded-[3%]'
                    />
                </motion.div>
            </div>
        </div>
    );
};

export default IntroSlider