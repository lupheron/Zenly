"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import HomeIcon from '@mui/icons-material/Home';
import PhotoIcon from '@mui/icons-material/Photo';
import CallIcon from '@mui/icons-material/Call';
import LanguageIcon from '@mui/icons-material/Language';
import { useUser } from '@/src/hooks/users/useUser';
import AuthChoiceModal from '../Modal/AuthChoiceModal';
import { useLanguage } from '@/src/contexts/LanguageContext';
import { getImageUrl } from '@/src/utils/axios';
import ReusableModal from '../Modal/ReusableModal';

const BottomNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data } = useUser();
    const [hasToken, setHasToken] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLangModal, setShowLangModal] = useState(false);
    const { language, setLanguage, t } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setHasToken(!!token);
    }, []);

    const handleProfileClick = () => {
        if (!data) return;
        if (data.type === 0) {
            router.push('/user');
        } else if (data.type === 1) {
            router.push('/customer');
        }
    };

    const handleLanguageChange = (lang: 'en' | 'ru') => {
        setLanguage(lang);
        setShowLangModal(false);
    };

    const navItems = [
        {
            id: 'home',
            icon: <HomeIcon className="w-8 h-8" />,
            action: () => router.push('/'),
            isActive: pathname === '/'
        },
        {
            id: 'posts',
            icon: <PhotoIcon className="w-8 h-8" />,
            action: () => {
                const activitiesSection = document.getElementById('activities');
                if (activitiesSection) {
                    activitiesSection.scrollIntoView({ behavior: 'smooth' });
                }
            },
            isActive: pathname.startsWith('/posts')
        },
        {
            id: 'language',
            icon: <LanguageIcon className="w-8 h-8" />,
            action: () => setShowLangModal(true),
            isActive: false
        },
        {
            id: 'contact',
            icon: <CallIcon className="w-8 h-8" />,
            action: () => {
                const contactSection = document.getElementById('coments');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            },
            isActive: false
        },
        {
            id: 'profile',
            icon: hasToken ? (
                <Image
                    src={getImageUrl(data?.img)}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full object-cover border-2 border-gray-200"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/logo/profile-default.png";
                    }}
                />
            ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-gray-200 flex items-center justify-center">
                    <span className="text-xs text-gray-500">?</span>
                </div>
            ),
            action: hasToken ? handleProfileClick : () => setShowAuthModal(true),
            isActive: pathname.startsWith('/user') || pathname.startsWith('/customer')
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 lg:hidden">
            <div className="flex justify-around items-center py-3 px-2">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={item.action}
                        className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors duration-200 min-h-[60px] ${item.isActive
                            ? 'text-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        <div className="text-2xl">
                            {item.icon}
                        </div>
                    </button>
                ))}
            </div>

            <AuthChoiceModal
                open={showAuthModal}
                onClose={() => setShowAuthModal(false)}
            />

            <ReusableModal
                open={showLangModal}
                onClose={() => setShowLangModal(false)}
                title={t("nav.selectLanguage")}
            >
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => handleLanguageChange('en')}
                        className={`p-4 rounded hover:bg-gray-100 text-left transition ${language === 'en' ? 'bg-gray-100 font-semibold' : ''
                            }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => handleLanguageChange('ru')}
                        className={`p-4 rounded hover:bg-gray-100 text-left transition ${language === 'ru' ? 'bg-gray-100 font-semibold' : ''
                            }`}
                    >
                        Русский
                    </button>
                </div>
            </ReusableModal>
        </div>
    );
};

export default BottomNavigation;
