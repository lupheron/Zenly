"use client";
import React, { useEffect, useState } from 'react';
import IntroSlider from '../IntroSlider/IntroSlider';

const slides = [
    {
        title: 'Sarguzasht Sizni Kutmoqda',
        text: 'O\'rmonlar, tog\'lar va daryolar sizni kutmoqda — tabiat bilan uyg\'un sayohat qiling.',
        src: "/intro/intro1.jpg",
        alt: "Intro 1"
    },
    {
        title: 'Tabiatga Sayohat Qiling',
        text: 'Tabiat qo\'ynida dam oling, yangi joylarni kashf eting, sarguzashtlarga to\'la sayohat boshlang.',
        src: "/intro/intro2.jpg",
        alt: "Intro 2"
    },
];

const IntroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-[600px] w-full bg-dark-green flex flex-col lg:flex-row flex-wrap px-4 sm:px-6 md:px-12 lg:px-20 justify-between items-center gap-6 lg:gap-8 py-8 lg:py-12 relative">

            <button
                onClick={prevSlide}
                className="hidden lg:flex items-center justify-center w-[50px] h-[50px] lg:w-[55px] lg:h-[55px] text-black-muted border border-solid rounded-full hover:bg-light-green transition absolute left-4 lg:left-10 top-1/2 -translate-y-1/2 z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 16 16" className="w-6 h-6 lg:w-7 lg:h-7">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                </svg>
            </button>

            <IntroSlider
                key={currentSlide}
                title={slides[currentSlide].title}
                text={slides[currentSlide].text}
                src={slides[currentSlide].src}
                alt={slides[currentSlide].alt}
            />

            <button
                onClick={nextSlide}
                className="hidden lg:flex items-center justify-center w-[50px] h-[50px] lg:w-[55px] lg:h-[55px] text-black-muted border border-solid rounded-full hover:bg-light-green transition absolute right-4 lg:right-10 top-1/2 -translate-y-1/2 z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 16 16" className="w-6 h-6 lg:w-7 lg:h-7">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                </svg>
            </button>

            <div className="flex lg:hidden justify-center gap-4 lg:gap-6 mt-4 lg:mt-6">
                <button
                    onClick={prevSlide}
                    className="flex items-center justify-center w-[45px] h-[45px] lg:w-[55px] lg:h-[55px] text-black-muted border border-solid rounded-full hover:bg-light-green transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 16 16" className="w-5 h-5 lg:w-7 lg:h-7">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="flex items-center justify-center w-[45px] h-[45px] lg:w-[55px] lg:h-[55px] text-black-muted border border-solid rounded-full hover:bg-light-green transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 16 16" className="w-5 h-5 lg:w-7 lg:h-7">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default IntroSection;
