'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DashboardIcon from '@mui/icons-material/Dashboard'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { usePathname, useRouter } from 'next/navigation'

const CustomerAside = () => {
    const pathname = usePathname()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)

    const routes = [
        {
            label: "Boshqaruv paneli",
            route: "/customer",
            icon: <DashboardIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        },
        {
            label: "Profil",
            route: "/customer/profile",
            icon: <AccountCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        }
    ]

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const closeSidebar = () => {
        setIsOpen(false)
    }

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg border border-gray-200"
            >
                {isOpen ? (
                    <CloseIcon className="w-6 h-6" />
                ) : (
                    <MenuIcon className="w-6 h-6" />
                )}
            </button>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-40
                w-64 min-h-screen p-4 border-r border-gray-200 
                shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)] bg-white
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="mb-4 flex items-center justify-center">
                    <Image
                        width={140}
                        height={85}
                        src="/logo/black-logo-with-text.png"
                        alt="Logo"
                        onClick={() => {
                            router.push('/')
                            closeSidebar()
                        }}
                        className='cursor-pointer'
                    />
                </div>

                <div className="flex flex-col gap-4 sm:gap-6 mt-8 sm:mt-10">
                    {routes.map((item, index) => (
                        <Link
                            key={index}
                            href={item.route}
                            onClick={closeSidebar}
                            className={`
                                text-sm sm:text-base lg:text-lg font-bold tracking-[1px] 
                                flex items-center gap-2 p-2 sm:p-3 rounded transition-colors duration-200
                                ${pathname === item.route
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'hover:bg-gray-100 text-gray-700'
                                }
                            `}
                        >
                            {item.icon}
                            <span className="whitespace-nowrap">{item.label}</span>
                        </Link>
                    ))}
                </div>
            </aside>
        </>
    )
}

export default CustomerAside