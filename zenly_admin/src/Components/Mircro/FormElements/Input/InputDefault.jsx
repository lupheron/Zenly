import React from 'react';
import styles from '../../../../assets/css/components.module.css';

function InputDefault({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  name, 
  id, 
  required = false, 
  disabled = false,
  ...props 
}) {
  return (
    <input
      type={type}
      className={styles.input}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      id={id}
      required={required}
      disabled={disabled}
      {...props}
    />
  );
}

export default InputDefault;