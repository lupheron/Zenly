import React, { useEffect } from 'react';
import styles from '../../../assets/css/components.module.css';

const Modal = ({ 
    isOpen, 
    onClose, 
    title, 
    children, 
    size = 'medium', // 'small', 'medium', 'large', 'full'
    showCloseButton = true,
    closeOnOverlayClick = true,
    actions = null, // Array of action buttons
    className = ''
}) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div 
            className={styles.modalOverlay}
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className={`${styles.modalContainer} ${styles[`modalSize${size.charAt(0).toUpperCase() + size.slice(1)}`]} ${className}`}>
                {(title || showCloseButton) && (
                    <div className={styles.modalHeader}>
                        {title && <h2 className={styles.modalTitle}>{title}</h2>}
                        {showCloseButton && (
                            <button 
                                onClick={onClose}
                                className={styles.modalCloseButton}
                                aria-label="Close modal"
                            >
                                ×
                            </button>
                        )}
                    </div>
                )}
                
                <div className={styles.modalBody}>
                    {children}
                </div>
                
                {actions && actions.length > 0 && (
                    <div className={styles.modalFooter}>
                        {actions.map((action, index) => (
                            <button 
                                key={index}
                                onClick={action.onClick}
                                className={`${styles.button} ${styles[`button${action.variant || 'Primary'}`]}`}
                                disabled={action.disabled}
                            >
                                {action.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
