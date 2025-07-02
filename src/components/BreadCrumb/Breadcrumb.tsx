'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

const Breadcrumb = () => {
    const pathname = usePathname()

    const pathParts = pathname.split('/').filter(Boolean)

    const capitalizeFirstLetter = (str: string) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="text-xl text-gray-500 my-4">
            <Link href="/" className="hover:underline">Home</Link>
            {pathParts.map((part, index) => {
                const path = '/' + pathParts.slice(0, index + 1).join('/')
                const isLast = index === pathParts.length - 1

                return (
                    <span key={index} className="text-blue-600">
                        <span className="text-gray-500">{' / '}</span>
                        {isLast ? (
                            <span className="font-medium">{capitalizeFirstLetter(decodeURIComponent(part))}</span>
                        ) : (
                            <Link href={path} className="hover:underline">
                                {capitalizeFirstLetter(decodeURIComponent(part))}
                            </Link>
                        )}
                    </span>
                )
            })}
        </div>
    )
}

export default Breadcrumb
>