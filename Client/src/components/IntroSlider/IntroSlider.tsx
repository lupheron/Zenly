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
        <div className="text-white w-full flex flex-col lg:flex-row justify-between items-center gap-8 px-4 md:px-10 h-[500px]">
            <div className="w-full lg:w-[50%] text-center lg:text-left px-4 h-[300px] flex flex-col justify-center">

                <AnimatePresence mode="wait">
                    <motion.h1
                        key={`title-${title}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 h-[120px] flex items-center justify-center lg:justify-start"
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
                        className="text-base sm:text-lg leading-relaxed w-full lg:w-[65%] mx-auto lg:mx-0 h-[80px] flex items-center justify-center lg:justify-start"
                    >
                        {text}
                    </motion.p>
                </AnimatePresence>
            </div>

            <div className="w-full lg:w-[50%] flex justify-center h-[400px]">

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
                            className="rounded-[3%] w-full sm:w-[400px] md:w-[500px] lg:w-[700px] xl:w-[800px] h-auto max-h-[400px] object-cover"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default IntroSlider;
