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
  label,
  showLabel = false,
  error,
  ...props 
}) {
  return (
    <div className={styles.inputContainer}>
      {showLabel && label && (
        <label htmlFor={id} className={styles.inputLabel} style={{
          display: 'block',
          marginBottom: '5px',
          fontWeight: '500',
          color: '#333'
        }}>
          {label}
          {required && <span style={{ color: '#dc3545' }}> *</span>}
        </label>
      )}
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
        style={{
          width: '100%',
          padding: '10px 12px',
          border: error ? '1px solid #dc3545' : '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          backgroundColor: disabled ? '#f8f9fa' : 'white',
          color: disabled ? '#6c757d' : '#333'
        }}
        {...props}
      />
      {error && (
        <div style={{
          color: '#dc3545',
          fontSize: '12px',
          marginTop: '4px',
          marginLeft: '2px'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default InputDefault;