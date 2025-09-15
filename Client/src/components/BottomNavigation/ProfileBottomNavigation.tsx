"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import PieChartIcon from '@mui/icons-material/PieChart';
import PhotoIcon from '@mui/icons-material/Photo';
import ViewListIcon from '@mui/icons-material/ViewList';
import { useUser } from '@/src/hooks/users/useUser';

interface ProfileBottomNavigationProps {
    userType: 'user' | 'customer';
}

const ProfileBottomNavigation: React.FC<ProfileBottomNavigationProps> = ({ userType }) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data } = useUser();

    const getRoutes = () => {
        if (userType === 'user') {
            return [
                {
                    id: 'dashboard',
                    icon: <PieChartIcon className="w-8 h-8" />,
                    action: () => router.push('/user'),
                    isActive: pathname === '/user'
                },
                {
                    id: 'posts',
                    icon: <PhotoIcon className="w-8 h-8" />,
                    action: () => router.push('/user/posts'),
                    isActive: pathname.startsWith('/user/posts')
                },
                {
                    id: 'orders',
                    icon: <ViewListIcon className="w-8 h-8" />,
                    action: () => router.push('/user/booked'),
                    isActive: pathname.startsWith('/user/booked')
                },
                {
                    id: 'profile',
                    icon: (
                        <Image
                            src={data?.img && data.img.trim() !== "" ? data.img : "/logo/profile-default.png"}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
                    ),
                    action: () => router.push('/user/profile'),
                    isActive: pathname.startsWith('/user/profile')
                }
            ];
        } else {
            return [
                {
                    id: 'dashboard',
                    icon: <PieChartIcon className="w-8 h-8" />,
                    action: () => router.push('/customer'),
                    isActive: pathname === '/customer'
                },
                {
                    id: 'posts',
                    icon: <PhotoIcon className="w-8 h-8" />,
                    action: () => router.push('/posts'),
                    isActive: pathname.startsWith('/posts')
                },
                {
                    id: 'orders',
                    icon: <ViewListIcon className="w-8 h-8" />,
                    action: () => router.push('/customer/booked'),
                    isActive: pathname.startsWith('/customer/booked')
                },
                {
                    id: 'profile',
                    icon: (
                        <Image
                            src={data?.img && data.img.trim() !== "" ? data.img : "/logo/profile-default.png"}
                            alt="Profile"
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                        />
                    ),
                    action: () => router.push('/customer/profile'),
                    isActive: pathname.startsWith('/customer/profile')
                }
            ];
        }
    };

    const navItems = getRoutes();

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

export default ProfileBottomNavigation;
