'use client'

import React from 'react'

interface LargeContainerProps {
    children: React.ReactNode
    className?: string
}

const LargeContainer = ({ children, className = '' }: LargeContainerProps) => {
    return (
        <div className={`bg-white rounded-xl shadow-xl p-6 ${className}`}>
            {children}
        </div>
    )
}

export default LargeContainer
