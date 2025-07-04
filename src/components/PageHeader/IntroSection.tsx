"use client";
import React, { useEffect, useState } from 'react';
import IntroSlider from '../IntroSlider/IntroSlider';

const slides = [
    {
        title: 'Sarguzasht Sizni Kutmoqda',
        text: 'O‘rmonlar, tog‘lar va daryolar sizni kutmoqda — tabiat bilan uyg‘un sayohat qiling.',
        src: "/intro/intro1.jpg",
        alt: "Intro 1"
    },
    {
        title: 'Tabiatga Sayohat Qiling',
        text: 'Tabiat qo‘ynida dam oling, yangi joylarni kashf eting, sarguzashtlarga to‘la sayohat boshlang.',
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
        <div className="min-h-[700px] h-auto w-full bg-dark-green flex flex-col lg:flex-row flex-wrap px-6 md:px-20 justify-between items-center gap-8 py-10 relative">

            {/* Desktop buttons */}
            <button
                onClick={prevSlide}
                className="hidden lg:flex items-center justify-center w-[55px] h-[55px] text-black-muted border border-solid rounded-full hover:bg-light-green transition absolute left-10 top-1/2 -translate-y-1/2 z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
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
                className="hidden lg:flex items-center justify-center w-[55px] h-[55px] text-black-muted border border-solid rounded-full hover:bg-light-green transition absolute right-10 top-1/2 -translate-y-1/2 z-10"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                </svg>
            </button>

            {/* Mobile & Tablet buttons below image */}
            <div className="flex lg:hidden justify-center gap-6 mt-6">
                <button
                    onClick={prevSlide}
                    className="flex items-center justify-center w-[55px] h-[55px] text-black-muted border border-solid rounded-full hover:bg-light-green transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                    </svg>
                </button>

                <button
                    onClick={nextSlide}
                    className="flex items-center justify-center w-[55px] h-[55px] text-black-muted border border-solid rounded-full hover:bg-light-green transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default IntroSection;
