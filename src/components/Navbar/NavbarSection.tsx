"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ButtonDefault from '../Button/ButtonDefault';
import { useUser } from '@/src/hooks/users/useUser';
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from 'next/navigation';

const NavbarSection = () => {
    const [hasToken, setHasToken] = useState(false);
    const { data } = useUser()
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem("token");
        setHasToken(!!token);
    }, []);

    const TypeChecking = () => {
        if (data.type !== 0) {
            router.push("client")
        } else {
            router.push("/user")
        }
    }

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
                        <>

                            <div
                                onClick={TypeChecking}
                                className='cursor-pointer'
                            >
                                <Image
                                    src={data?.img}
                                    alt="Profile"
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover"
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
                                <LogoutIcon fontSize="large" className='cursor-pointer' />
                            </button>
                        </>
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