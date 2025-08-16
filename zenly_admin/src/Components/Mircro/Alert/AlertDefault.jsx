import React from 'react';
import styles from '../../../assets/css/components.module.css';

const AlertDefault = {
    info: (message) => {
        showAlert(message, 'info');
    },

    warning: (message) => {
        showAlert(message, 'warning');
    },

    error: (message) => {
        showAlert(message, 'error');
    },

    success: (message) => {
        showAlert(message, 'success');
    },

    delete: (message) => {
        showAlert(message, 'delete');
    }
};

// Helper function to show alerts
const showAlert = (message, type) => {
    // Create alert element
    const alertElement = document.createElement('div');
    alertElement.className = `${styles.alert} ${styles[`alert${type.charAt(0).toUpperCase() + type.slice(1)}`]}`;
    
    // Create icon based on type
    const icon = getIcon(type);
    
    alertElement.innerHTML = `
        <div class="${styles.alertContent}">
            <span class="${styles.alertIcon}">${icon}</span>
            <span class="${styles.alertMessage}">${message}</span>
            <button class="${styles.alertClose}" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(alertElement);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertElement.parentElement) {
            alertElement.remove();
        }
    }, 5000);
};

// Helper function to get appropriate icon
const getIcon = (type) => {
    switch (type) {
        case 'info':
            return 'ℹ️';
        case 'warning':
            return '⚠️';
        case 'error':
        case 'delete':
            return '❌';
        case 'success':
            return '✅';
        default:
            return 'ℹ️';
    }
};

export default AlertDefault;
