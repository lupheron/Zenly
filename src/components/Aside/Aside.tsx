'use client'

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Aside = () => {
    const routes = [
        {
            label: "Boshqaruv paneli",
            route: "/dashboard"
        },
        {
            label: "Postlar",
            route: "/posts"
        },
        {
            label: "Profil",
            route: "/profile"
        }
    ]

    return (
        <aside className="p-4 border-b shadow-sm">
            <div className="mb-4">
                <Image
                    width={100}
                    height={45}
                    src="/logo/black-logo-with-text.png"
                    alt="Logo"
                />
            </div>

            <div className="flex flex-col gap-6">
                {routes.map((item, index) => (
                    <Link key={index} href={item.route} className="text-sm font-medium text-gray-700 hover:text-black">
                        {item.label}
                    </Link>
                ))}
            </div>
        </aside>
    )
}

export default Aside