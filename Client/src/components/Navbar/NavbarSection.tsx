"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ButtonDefault from '../Button/ButtonDefault';
import { useUser } from '@/src/hooks/users/useUser';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/src/contexts/LanguageContext';
import LanguageSelect from './LanguageSelect';
import { getImageUrl } from '@/src/utils/axios';

const NavbarSection = () => {
    const [hasToken, setHasToken] = useState(false);
    const { data } = useUser();
    const router = useRouter();
    const { t } = useLanguage();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setHasToken(!!token);
    }, []);


    const navLinks = [
        { label: t("nav.about"), link: "about-us" },
        { label: t("nav.popularPlaces"), link: "activities" },
        { label: t("nav.userFeedback"), link: "coments" }
    ];

    const handleProfileClick = () => {
        if (!data) return;
        if (data.type === 0) {
            router.push('/user');
        } else if (data.type === 1) {
            router.push('/customer');
        }
    };

    return (
        <nav className="w-full sticky top-0 bottom-0 bg-dark-green z-50">
            <div className="flex items-center justify-between flex-wrap w-[90%] mx-auto py-4">
                <Link href={"/"}>
                    <Image
                        src="/logo/white-logo.png"
                        alt="Logo"
                        width={120}
                        height={80}
                    />
                </Link>

                <ul className="hidden lg:flex space-x-6 items-center justify-between">
                    {navLinks.map(({ label, link }) => (
                        <li key={link}>
                            <Link
                                href={`#${link}`}
                                className="text-[17px] text-mulish font-semibold tracking-[1] text-white hover:text-light-green transition duration-300"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="hidden lg:flex items-center space-x-4">
                    <LanguageSelect />

                    {hasToken ? (
                        <>
                            <div
                                className="cursor-pointer"
                                onClick={handleProfileClick}
                            >
                                <Image
                                    src={getImageUrl(data?.img)}
                                    alt="Profile"
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover border-2 border-gray-200"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src = "/logo/profile-default.png";
                                    }}
                                />
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user_id");
                                    setHasToken(false);
                                }}
                                className="ml-4 text-white hover:text-light-green transition duration-300"
                                aria-label="Logout"
                            >
                                <LogoutIcon fontSize="large" className="cursor-pointer" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/register">
                                <ButtonDefault customClasses="w-30" label={t("nav.register")} onClick={() => { }} />
                            </Link>
                            <Link href="/login">
                                <ButtonDefault customClasses="w-30" label={t("nav.login")} onClick={() => { }} />
                            </Link>
                        </>
                    )}
                </div>
            </div>

            <div className="w-[90%] h-[0.1px] bg-black-muted mx-auto"></div>

        </nav>
    );
};

export default NavbarSection;
