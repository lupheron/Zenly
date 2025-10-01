"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import HomeIcon from '@mui/icons-material/Home';
import PhotoIcon from '@mui/icons-material/Photo';
import CallIcon from '@mui/icons-material/Call';
import { useUser } from '@/src/hooks/users/useUser';

const BottomNavigation = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { data } = useUser();
    const [hasToken, setHasToken] = useState(false);

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
                // Scroll to Mashhur servislar section
                const activitiesSection = document.getElementById('activities');
                if (activitiesSection) {
                    activitiesSection.scrollIntoView({ behavior: 'smooth' });
                }
            },
            isActive: pathname.startsWith('/posts')
        },
        {
            id: 'contact',
            icon: <CallIcon className="w-8 h-8" />,
            action: () => {
                // Scroll to contact section
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
                    src={data?.img && data.img.trim() !== "" ? data.img : "/logo/profile-default.png"}
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
            action: hasToken ? handleProfileClick : () => router.push('/login'),
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
                        className={`flex flex-col items-center justify-center p-2 min-w-0 flex-1 transition-colors duration-200 min-h-[60px] ${
                            item.isActive 
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
        </div>
    );
};

export default BottomNavigation;
