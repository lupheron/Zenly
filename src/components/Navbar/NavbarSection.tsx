"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ButtonDefault from '../Button/ButtonDefault';

const NavbarSection = () => {
    const [hasToken, setHasToken] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setHasToken(!!token);
    }, []);

    const navLinks = [
        { label: "Biz haqimizda", link: "about-us" },
        { label: "Mashxur maskanlar", link: "activities" },
        { label: "Servislar", link: "services" },
        { label: "Foydalanuvchilar fikri", link: "coments" }
    ];

    return (
        <nav className='w-full sticky top-0 bottom-0 bg-dark-green z-99'>
            <div className='flex items-center justify-between flex-wrap w-[80%] mx-auto py-4'>
                <Link href={"/"}>
                    <Image
                        src="/logo/white-logo.png"
                        alt="Logo"
                        width={120}
                        height={80}
                    />
                </Link>

                <ul className="flex space-x-6 items-center justify-between">
                    {navLinks.map(({ label, link }) => (
                        <li key={link}>
                            <Link
                                href={`/${link}`}
                                className="text-[17px] text-mulish font-semibold tracking-[1] text-white hover:text-light-green transition duration-300"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="flex items-center space-x-4">
                    {hasToken ? (
                        <Link href="/dashboard">
                            <Image
                                src="/images/profile.jpg"
                                alt="Profile"
                                width={40}
                                height={40}
                                className="rounded-full object-cover"
                            />
                        </Link>
                    ) : (
                        <>
                            <Link href="/register">
                                <ButtonDefault label="Ro'yxatdan O'tish" onClick={() => console.log()} />
                            </Link>
                            <Link href="/login">
                                <ButtonDefault customClasses='w-45' label="Kirish" onClick={() => console.log()} />
                            </Link>
                        </>
                    )}
                </div>
            </div>
            <div className='w-[80%] h-[0.1px] bg-black-muted mx-auto'></div>
        </nav>
    );
};

export default NavbarSection;
