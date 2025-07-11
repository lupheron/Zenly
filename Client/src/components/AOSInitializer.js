'use client'; // Important for Next.js 13+

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AOSInitializer = () => {
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 120,
            delay: 100,
        });
    }, []);

    return null;
};

export default AOSInitializer;