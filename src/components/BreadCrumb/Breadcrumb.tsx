'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import React from 'react'

const Breadcrumb = () => {
    const pathname = usePathname()

    const pathParts = pathname.split('/').filter(Boolean)

    return (
        <div className="text-sm text-gray-500 my-4">
            <Link href="/" className="hover:underline">Home</Link>
            {pathParts.map((part, index) => {
                const path = '/' + pathParts.slice(0, index + 1).join('/')
                const isLast = index === pathParts.length - 1

                return (
                    <span key={index}>
                        {' / '}
                        {isLast ? (
                            <span className="font-medium">{decodeURIComponent(part)}</span>
                        ) : (
                            <Link href={path} className="hover:underline">
                                {decodeURIComponent(part)}
                            </Link>
                        )}
                    </span>
                )
            })}
        </div>
    )
}

export default Breadcrumb
