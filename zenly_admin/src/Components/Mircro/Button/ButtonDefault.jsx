import React from 'react';
import styles from '../../../assets/css/components.module.css';

function ButtonDefault({ 
  children, 
  variant = 'primary', 
  type = 'button', 
  disabled = false, 
  onClick,
  ...props 
}) {
  // Map variant to CSS class
  const getButtonClass = () => {
    switch (variant) {
      case 'primary':
        return `${styles.button} ${styles.buttonPrimary}`;
      case 'black':
        return `${styles.button} ${styles.buttonBlack}`;
      case 'red':
        return `${styles.button} ${styles.buttonRed}`;
      case 'green':
        return `${styles.button} ${styles.buttonGreen}`;
      case 'yellow':
        return `${styles.button} ${styles.buttonYellow}`;
      default:
        return `${styles.button} ${styles.buttonPrimary}`;
    }
  };

  return (
    <button
      type={type}
      className={getButtonClass()}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default ButtonDefault;