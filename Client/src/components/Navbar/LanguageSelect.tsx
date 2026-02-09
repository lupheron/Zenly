"use client";

import React, { useState, useRef, useEffect } from 'react';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '@/src/contexts/LanguageContext';

const LanguageSelect = ({ isDark = false }: { isDark?: boolean }) => {
    const { language, setLanguage } = useLanguage();
    const [showLangMenu, setShowLangMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleLanguageChange = (lang: 'en' | 'ru' | 'uz') => {
        setLanguage(lang);
        setShowLangMenu(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setShowLangMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className={`flex items-center space-x-2 transition duration-300 px-3 py-2 rounded ${isDark ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:text-light-green'
                    }`}
            >
                <LanguageIcon />
                <span className="text-sm font-semibold uppercase">{language}</span>
            </button>

            {showLangMenu && (
                <div className={`absolute top-full mt-2 right-0 bg-white rounded-lg shadow-lg py-2 w-32 z-50 border border-gray-100`}>
                    <button
                        onClick={() => handleLanguageChange('en')}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${language === 'en' ? 'bg-gray-100 font-semibold' : 'text-gray-800'}`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => handleLanguageChange('ru')}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${language === 'ru' ? 'bg-gray-100 font-semibold' : 'text-gray-800'}`}
                    >
                        Русский
                    </button>
                    <button
                        onClick={() => handleLanguageChange('uz')}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 transition ${language === 'uz' ? 'bg-gray-100 font-semibold' : 'text-gray-800'}`}
                    >
                        Oʻzbekcha
                    </button>
                </div>
            )}
        </div>
    );
};

export default LanguageSelect;
