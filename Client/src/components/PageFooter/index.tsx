'use client';

import React from 'react';
import Contact from '../ContactSection/Contact';
import Image from 'next/image';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import SocialMediaButton from '../Button/SocialMediaButton';
import AOSInitializer from '../AOSInitializer';
import { useLanguage } from '@/src/contexts/LanguageContext';

const smData = [
    {
        icon: <InstagramIcon sx={{ fontSize: 22 }} />,
        onClick: () => window.open('https://instagram.com', '_blank')
    },
    {
        icon: <FacebookIcon sx={{ fontSize: 22 }} />,
        onClick: () => window.open('https://facebook.com', '_blank')
    },
    {
        icon: <LinkedInIcon sx={{ fontSize: 22 }} />,
        onClick: () => window.open('https://linkedin.com', '_blank')
    },
    {
        icon: <XIcon sx={{ fontSize: 22 }} />,
        onClick: () => window.open('https://twitter.com', '_blank')
    }
];

const footerList = [
    { id: 1, key: "callCenter" },
    { id: 2, key: "terms" },
    { id: 3, key: "privacy" }
];

const PageFooter = () => {
    const { t } = useLanguage();
    return (
        <div>
            <AOSInitializer />
            <Contact />

            <div className="w-full py-20 px-4 md:px-20 bg-light-gray mt-20">
                <div className="w-[80%] mx-auto flex flex-col md:flex-row justify-between items-center md:items-center gap-10">

                    <div
                        data-aos="fade-right"
                        className="flex flex-col items-center md:items-start justify-center w-full md:w-1/2 max-w-[400px] text-center md:text-left"
                    >
                        <Image
                            width={200}
                            height={200}
                            src="/logo/black-logo-text.png"
                            alt="Zenly Logo"
                        />
                        <p className="text-lg sm:text-xl md:text-lg mt-4 max-w-[400px]">
                            {t('footer.description')}
                        </p>
                        <div className="flex gap-3 mt-6">
                            {smData.map((item, index) => (
                                <SocialMediaButton
                                    key={index}
                                    icon={item.icon}
                                    onClick={item.onClick}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        data-aos="fade-left"
                        className="flex flex-col items-center md:items-center justify-center w-full md:w-1/3"
                    >
                        <h2 className="text-2xl sm:text-3xl mb-4 font-semibold">{t('footer.support')}</h2>
                        <ul>
                            {footerList.map((item) => (
                                <li key={item.id} className="mt-2 text-lg md:text-xl cursor-pointer hover:underline">
                                    {t(`footer.${item.key}`)}
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PageFooter;
