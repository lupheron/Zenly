'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PanoramaIcon from '@mui/icons-material/Panorama'

const Aside = () => {
    const routes = [
        {
            label: "Boshqaruv paneli",
            route: "/dashboard",
            icon: <DashboardIcon />
        },
        {
            label: "Postlar",
            route: "/posts",
            icon: <PanoramaIcon />
        },
        {
            label: "Profil",
            route: "/profile",
            icon: <AccountCircleIcon />
        }
    ]

    return (
        <aside className="w-[15%] h-full p-4 border-r border-gray-200 shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1),2px_0_4px_-2px_rgba(0,0,0,0.1)]">
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
                    <Link key={index} href={item.route} className="text-lg font-bold tracking-[1px] flex items-center gap-2">
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    )
}

export default Aside