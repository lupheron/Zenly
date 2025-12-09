'use client'

import React from 'react';
import AboutBanner from '../Banners/AboutBanner';
import TitleButtons from '../Button/TitleButtons';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/src/contexts/LanguageContext';

const AboutSection = () => {
    const router = useRouter();
    const { t } = useLanguage();

    const banners = [
        { id: 1, title: t('about.dachas'), paragraph: t('about.dachasDesc'), img: "/about/dacha.jpg" },
        { id: 2, title: t('about.touristZones'), paragraph: t('about.touristZonesDesc'), img: "/about/registan.jpeg" },
        { id: 3, title: t('about.guestHouses'), paragraph: t('about.guestHousesDesc'), img: "/about/guest_houses.jpg" },
        { id: 4, title: t('about.ecoTravel'), paragraph: t('about.ecoTravelDesc'), img: "/about/ecoo.jpg" },
    ];

    return (
        <div className="mt-20 px-4 md:px-8" id='about-us'>
            <div className="max-w-[900px] mx-auto flex flex-col items-center text-center gap-5" data-aos="fade-down">
                <TitleButtons label={t('about.title')} customClasses="text-green-700 bg-green-50" />
                <h1 className="text-[28px] sm:text-[34px] md:text-[33px] font-semibold">
                    {t('about.heading')}
                </h1>
                <p className="leading-[28px] md:leading-[30px]">
                    {t('about.description')}
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mt-16" data-aos="fade-up">
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="cursor-pointer"
                        onClick={() => router.push(`/posts?area_id=${banner.id}`)}
                    >
                        <AboutBanner title={banner.title} paragraph={banner.paragraph} img={banner.img} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutSection;