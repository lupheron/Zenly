import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from "framer-motion";

interface IntroProps {
    title: string;
    text: string;
    src: string;
    alt: string;
}

const IntroSlider: React.FC<IntroProps> = ({ title, text, src, alt }) => {
    return (
        <div className="text-white w-full flex flex-col lg:flex-row justify-between items-center gap-6 lg:gap-8 px-4 md:px-10 min-h-[500px] py-8">
            <div className="w-full lg:w-[50%] text-center lg:text-left px-4 flex flex-col justify-center space-y-6">

                <AnimatePresence mode="wait">
                    <motion.h1
                        key={`title-${title}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight"
                    >
                        {title}
                    </motion.h1>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    <motion.p
                        key={`text-${text}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="text-sm sm:text-base md:text-md lg:text-gl leading-relaxed w-full lg:w-[85%] xl:w-[75%]"
                    >
                        {text}
                    </motion.p>
                </AnimatePresence>
            </div>

            <div className="w-full lg:w-[50%] flex justify-center items-center">

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`image-${src}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full flex justify-center items-center"
                    >
                        <Image
                            src={src}
                            alt={alt}
                            width={800}
                            height={800}
                            className="rounded-[3%] w-full max-w-[400px] sm:max-w-[450px] md:max-w-[500px] lg:max-w-[550px] xl:max-w-[600px] h-auto max-h-[350px] sm:max-h-[400px] md:max-h-[450px] object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default IntroSlider;
