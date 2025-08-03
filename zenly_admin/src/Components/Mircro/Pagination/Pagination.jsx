// Pagination.jsx
import React from 'react';
import styles from '../../../assets/css/components.module.css';

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange = () => { },
    showFirstLast = true,
    showPrevNext = true,
    maxVisiblePages = 5,
    size = 'medium', // small, medium, large
    variant = 'default', // default, minimal, rounded
    disabled = false,
    className = ''
}) => {
    // Generate page numbers to display
    const generatePageNumbers = () => {
        const pages = [];
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, currentPage + halfVisible);

        // Adjust if we're near the beginning or end
        if (endPage - startPage + 1 < maxVisiblePages) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            } else {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
        }

        // Add ellipsis and first page if needed
        if (startPage > 1) {
            pages.push(1);
            if (startPage > 2) {
                pages.push('...');
            }
        }

        // Add visible pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Add ellipsis and last page if needed
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageClick = (page) => {
        if (disabled || page === currentPage || page === '...') return;
        onPageChange(page);
    };

    const handlePrevious = () => {
        if (disabled || currentPage <= 1) return;
        onPageChange(currentPage - 1);
    };

    const handleNext = () => {
        if (disabled || currentPage >= totalPages) return;
        onPageChange(currentPage + 1);
    };

    const handleFirst = () => {
        if (disabled || currentPage === 1) return;
        onPageChange(1);
    };

    const handleLast = () => {
        if (disabled || currentPage === totalPages) return;
        onPageChange(totalPages);
    };

    const pages = generatePageNumbers();

    // Build CSS classes
    const containerClasses = [
        styles.paginationContainer,
        styles[size],
        styles[variant],
        disabled ? styles.disabled : '',
        className
    ].filter(Boolean).join(' ');

    return (
        <nav className={containerClasses}>
            {/* First Page Button */}
            {showFirstLast && totalPages > maxVisiblePages && (
                <button
                    className={`${styles.paginationBtn} ${styles.firstBtn} ${currentPage === 1 ? styles.btnDisabled : ''}`}
                    onClick={handleFirst}
                    disabled={disabled || currentPage === 1}
                    title="First page"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Previous Button */}
            {showPrevNext && (
                <button
                    className={`${styles.paginationBtn} ${styles.prevBtn} ${currentPage === 1 ? styles.btnDisabled : ''}`}
                    onClick={handlePrevious}
                    disabled={disabled || currentPage === 1}
                    title="Previous page"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}

            {/* Page Numbers */}
            <div className={styles.paginationPages}>
                {pages.map((page, index) => (
                    <button
                        key={index}
                        className={`${styles.paginationBtn} ${styles.pageBtn} ${page === currentPage ? styles.active : ''
                            } ${page === '...' ? styles.ellipsis : ''}`}
                        onClick={() => handlePageClick(page)}
                        disabled={disabled || page === '...'}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            {showPrevNext && (
                <button
                    className={`${styles.paginationBtn} ${styles.nextBtn} ${currentPage === totalPages ? styles.btnDisabled : ''}`}
                    onClick={handleNext}
                    disabled={disabled || currentPage === totalPages}
                    title="Next page"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            )}

            {/* Last Page Button */}
            {showFirstLast && totalPages > maxVisiblePages && (
                <button
                    className={`${styles.paginationBtn} ${styles.lastBtn} ${currentPage === totalPages ? styles.btnDisabled : ''}`}
                    onClick={handleLast}
                    disabled={disabled || currentPage === totalPages}
                    title="Last page"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    </svg>
                </button>
            )}
        </nav>
    );
};

export default Pagination;