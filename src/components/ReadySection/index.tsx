import Image from 'next/image';
import React from 'react';
import ButtonDefault from '../Button/ButtonDefault';

const ReadySection = () => {
    return (
        <div className="w-full h-[300px] sm:h-[300px] md:h-[300px] lg:h-[400px] relative mt-30 z-1">
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src="/ready/ready.jpg"
                    alt="Adventure background"
                    fill
                    className="object-cover brightness-50"
                />
            </div>

            <div className="relative z-10 h-full flex flex-col justify-center items-center gap-5 text-white px-4 text-center" data-aos="fade-down">
                <h1 className="max-w-[800px] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-5">
                    Haqiqiy sarguzasht bilan sayohat qilishga tayyormisiz?
                </h1>
                <ButtonDefault
                    label="Hoziroq bron qiling"
                    isDisabled={false}
                    onClick={() => { }}
                />
            </div>
        </div>
    );
};

export default ReadySection;