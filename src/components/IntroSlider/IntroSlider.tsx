import React from 'react';
import Image from 'next/image';
import { motion } from "framer-motion";

interface IntroProps {
    title: string;
    text: string;
    src: string;
    alt: string;
}

const IntroSlider: React.FC<IntroProps> = ({ title, text, src, alt }) => {
    return (
        <div className="text-white w-full flex flex-col lg:flex-row justify-between items-center gap-8 px-4 md:px-10">

            <div className="w-full lg:w-[50%] text-center lg:text-left px-4">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl sm:text-5xl md:text-6xl font-black mb-6"
                >
                    {title}
                </motion.h1>

                <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base sm:text-lg leading-relaxed w-full lg:w-[65%] mx-auto lg:mx-0"
                >
                    {text}
                </motion.p>
            </div>

            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full lg:w-[50%] flex justify-center"
            >
                <Image
                    src={src}
                    alt={alt}
                    width={800}
                    height={800}
                    className="rounded-[3%] w-full sm:w-[400px] md:w-[500px] lg:w-[700px] xl:w-[800px] h-auto"
                />
            </motion.div>
        </div>
    );
};

export default IntroSlider;
