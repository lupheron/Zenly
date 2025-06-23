'use client'

import React from 'react'

interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages: (number | string)[] = []

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, '...', totalPages)
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
            } else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
            }
        }

        return pages
    }

    const pages = getPageNumbers()

    return (
        <div className="flex mx-auto gap-2 mt-5 flex-wrap">
            <button
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                Oldingi
            </button>

            {pages.map((page, index) =>
                typeof page === 'number' ? (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`cursor-pointer px-3 py-1 border rounded ${page === currentPage ? 'bg-gray-200' : ''}`}
                    >
                        {page}
                    </button>
                ) : (
                    <span key={index} className="px-2 py-1 text-gray-500">...</span>
                )
            )}

            <button
                className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                Keyingi
            </button>
        </div>
    )
}

export default Pagination
