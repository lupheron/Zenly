'use client'

import React from 'react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

    return (
        <div className="flex mx-auto gap-2 mt-5 w-100">
            <button
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer "
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Oldingi
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`cursor-pointer px-3 py-1 border rounded ${page === currentPage ? 'bg-gray-200' : ''}`}
                >
                    {page}
                </button>
            ))}
            <button
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer "
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Keyingi
            </button>
        </div>
    )
}

export default Pagination
