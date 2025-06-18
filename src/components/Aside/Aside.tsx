'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PanoramaIcon from '@mui/icons-material/Panorama'
import { usePathname } from 'next/navigation'

const Aside = () => {
    const pathname = usePathname()
    const routes = [
        {
            label: "Boshqaruv paneli",
            route: "/user",
            icon: <DashboardIcon />
        },
        {
            label: "Postlar",
            route: "/user/posts",
            icon: <PanoramaIcon />
        },
        {
            label: "Profil",
            route: "/user/profile",
            icon: <AccountCircleIcon />
        }
    ]

    return (
        <aside className="w-64 min-h-screen p-4 border-r border-gray-200 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] bg-white">
            <div className="mb-4 flex items-center justify-center">
                <Image
                    width={140}
                    height={85}
                    src="/logo/black-logo-with-text.png"
                    alt="Logo"
                />
            </div>

            <div className="flex flex-col gap-6 mt-10">
                {routes.map((item, index) => (
                    <Link
                        key={index}
                        href={item.route}
                        className={`text-lg font-bold tracking-[1px] flex items-center gap-2 p-2 rounded ${pathname === item.route ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    )
}

export default Aside