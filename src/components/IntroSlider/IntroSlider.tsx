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
        <div className="text-white w-full flex flex-col lg:flex-row justify-between items-center gap-8 px-10">

            {/* Text Block */}
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
                    className="text-base sm:text-lg leading-relaxed"
                >
                    {text}
                </motion.p>
            </div>

            {/* Image Block */}
            <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="w-full lg:w-[50%] flex justify-center"
            >
                <Image
                    src={src}
                    alt={alt}
                    width={600}
                    height={600}
                    className="rounded-[3%] w-auto h-auto max-w-full"
                />
            </motion.div>
        </div>
    );
};

export default IntroSlider;
