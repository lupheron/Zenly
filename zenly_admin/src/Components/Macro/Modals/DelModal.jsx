import React from 'react';
import styles from '../../../assets/css/components.module.css';

const DelModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title = "Delete Confirmation", 
    message = "Are you sure you want to delete this item?",
    confirmText = "Delete",
    cancelText = "Cancel"
}) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{title}</h2>
                    <button 
                        onClick={onClose}
                        className={styles.modalCloseButton}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>
                
                <div className={styles.modalBody}>
                    <div className={styles.modalIcon}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#f44336"/>
                        </svg>
                    </div>
                    <p className={styles.modalMessage}>{message}</p>
                    <p className={styles.modalWarning}>
                        This action cannot be undone.
                    </p>
                </div>
                
                <div className={styles.modalFooter}>
                    <button 
                        onClick={onClose}
                        className={`${styles.button} ${styles.buttonBlack}`}
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm}
                        className={`${styles.button} ${styles.buttonRed}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DelModal;
