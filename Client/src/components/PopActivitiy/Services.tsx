'use client'

import React from 'react';
import ServicesCart from '../Cart/ServicesCart';
import GppGoodIcon from '@mui/icons-material/GppGood';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';
import PhishingIcon from '@mui/icons-material/Phishing';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';
import { useLanguage } from '@/src/contexts/LanguageContext';

const Services = () => {
    const { t } = useLanguage();

    const services = [
        { icon: <GppGoodIcon fontSize="large" />, title: t('services.security'), paragraph: t('services.securityDesc') },
        { icon: <CompassCalibrationIcon fontSize="large" />, title: t('services.internet'), paragraph: t('services.internetDesc') },
        { icon: <PoolIcon fontSize="large" />, title: t('services.swimming'), paragraph: t('services.swimmingDesc') },
        { icon: <DirectionsBikeIcon fontSize="large" />, title: "Mountain Biking", paragraph: "Scenic trails for adventuring through nature." },
        { icon: <PhishingIcon fontSize="large" />, title: "Fishing", paragraph: "Cast your line and relax in quiet spots." },
        { icon: <SelfImprovementIcon fontSize="large" />, title: "Gym & Yoga", paragraph: "Serenity classes for harmonizing body and mind." }
    ];

    return (
        <div className="w-[95%] sm:w-[90%] md:w-[85%] lg:w-[75%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mt-10 " data-aos="fade-up">
            {services.map((service, index) => (
                <ServicesCart
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    paragraph={service.paragraph}
                />
            ))}
        </div>
    );
};

export default Services;
