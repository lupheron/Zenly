import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import ButtonDefault from '../Button/ButtonDefault';

const NavbarSection = () => {
    const navLinks = [
        {
            label: "Biz haqimizda",
            link: "about-us"
        },
        {
            label: "Mashxur maskanlar",
            link: "activities"
        },
        {
            label: "Servislar",
            link: "services"
        },
        {
            label: "Foydalanuvchilar fikri",
            link: "coments"
        }
    ];
    return (
        <nav className='w-full fixed bg-dark-green z-99'>
            <div className='flex items-center justify-between flex-wrap w-[76%] mx-auto'>
                <Link href={"/"}>
                    <Image
                        src="/logo/white-logo-text.png"
                        alt='Logo'
                        width={120}
                        height={80}
                    />
                </Link>

                <ul className="flex space-x-6 items-center justify-between">
                    {navLinks.map(({ label, link }) => (
                        <li key={link}>
                            <Link href={`/${link}`} className="text-[17px] text-mulish font-semibold tracking-[1] text-white hover:text-light-green transition duration-300">
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ButtonDefault
                    label="Bron qilish"
                    isDisabled={false}
                    customClasses='tracking-[1]'
                    onClick={() => console.log("clicked")}
                />
            </div>
            <div className='w-[76%] h-[0.1px] bg-black-muted mx-auto'></div>
        </nav>
    )
}

export default NavbarSection