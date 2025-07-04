"use client";

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ButtonDefault from '../Button/ButtonDefault';
import { useUser } from '@/src/hooks/users/useUser';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useRouter } from 'next/navigation';
import ReusableModal from '../Modal/ReusableModal';
import ClientData from '../Containers/ClientData';
import EditClientForm from '../Forms/EditClient/EditClientForm';

const NavbarSection = () => {
    const [hasToken, setHasToken] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { data } = useUser();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setHasToken(!!token);
    }, []);

    const TypeChecking = () => {
        if (data.type !== 0) {
            setShowModal(true);
        } else {
            router.push("/user");
        }
    };

    const navLinks = [
        { label: "Biz haqimizda", link: "about-us" },
        { label: "Mashxur maskanlar", link: "activities" },
        { label: "Foydalanuvchilar fikri", link: "coments" }
    ];

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
                                href={`/${link}`}
                                className="text-[17px] text-mulish font-semibold tracking-[1] text-white hover:text-light-green transition duration-300"
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="hidden lg:flex items-center space-x-4">
                    {hasToken ? (
                        <>
                            <div
                                onClick={TypeChecking}
                                className="cursor-pointer"
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
                                <LogoutIcon fontSize="large" className="cursor-pointer" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/register">
                                <ButtonDefault label="Ro'yxatdan O'tish" onClick={() => console.log()} />
                            </Link>
                            <Link href="/login">
                                <ButtonDefault customClasses="w-45" label="Kirish" onClick={() => console.log()} />
                            </Link>
                        </>
                    )}
                </div>

                <div className="lg:hidden">
                    <MenuIcon
                        fontSize="large"
                        className="text-white cursor-pointer"
                        onClick={() => setMenuOpen(true)}
                    />
                </div>
            </div>

            <div className="w-[90%] h-[0.1px] bg-black-muted mx-auto"></div>

            <div
                className={`fixed top-0 right-0 h-full w-[70%] sm:w-[60%] bg-dark-green z-50 transform transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-white text-lg font-bold">Menu</h2>
                    <CloseIcon
                        fontSize="large"
                        className="text-white cursor-pointer"
                        onClick={() => setMenuOpen(false)}
                    />
                </div>

                <ul className="flex flex-col space-y-4 mt-6 px-4">
                    {navLinks.map(({ label, link }) => (
                        <li key={link}>
                            <Link
                                href={`/${link}`}
                                className="block text-[17px] text-white font-semibold hover:text-light-green transition duration-300"
                                onClick={() => setMenuOpen(false)}
                            >
                                {label}
                            </Link>
                        </li>
                    ))}
                </ul>

                <div className="px-4 mt-8 space-y-4">
                    {hasToken ? (
                        <>
                            <div
                                onClick={() => {
                                    setMenuOpen(false);
                                    TypeChecking();
                                }}
                                className="flex items-center space-x-3 cursor-pointer"
                            >
                                <Image
                                    src={data?.img}
                                    alt="Profile"
                                    width={50}
                                    height={50}
                                    className="rounded-full object-cover"
                                />
                                <span className="text-white text-[16px]">Profil</span>
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("user_id");
                                    setHasToken(false);
                                    setMenuOpen(false);
                                }}
                                className="text-white hover:text-light-green transition duration-300"
                            >
                                <LogoutIcon fontSize="large" className="cursor-pointer" />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/register" onClick={() => setMenuOpen(false)}>
                                <ButtonDefault label="Ro'yxatdan O'tish" customClasses='w-full' onClick={() => console.log()} />
                            </Link>
                            <Link href="/login" onClick={() => setMenuOpen(false)}>
                                <ButtonDefault customClasses="w-full mt-5" label="Kirish" onClick={() => console.log()} />
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <ReusableModal
                    open={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setShowEditForm(false);
                    }}
                    title={showEditForm ? "Profilni Tahrirlash" : "Profil Ma'lumotlari"}
                    width={"35%"}
                >
                    {showEditForm ? (
                        <EditClientForm closeEditForm={() => setShowEditForm(false)} />
                    ) : (
                        <ClientData openEditForm={() => setShowEditForm(true)} />
                    )}
                </ReusableModal>
            )}
        </nav>
    );
};

export default NavbarSection;
