import React from 'react';
import styles from '../../../../assets/css/components.module.css';

function SelectDefault({ 
    label, 
    name, 
    value, 
    onChange, 
    options = [], 
    placeholder = "Select an option",
    error,
    required = false,
    disabled = false,
    showLabel = false,
    ...props 
}) {
    return (
        <div className={styles.inputContainer}>
            {showLabel && label && (
                <label className={styles.inputLabel} style={{
                    display: 'block',
                    marginBottom: '5px',
                    fontWeight: '500',
                    color: '#333'
                }}>
                    {label}
                    {required && <span style={{ color: '#dc3545' }}> *</span>}
                </label>
            )}
            
            <select
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: error ? '1px solid #dc3545' : '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    backgroundColor: disabled ? '#f8f9fa' : 'white',
                    color: disabled ? '#6c757d' : '#333',
                    cursor: disabled ? 'not-allowed' : 'pointer'
                }}
                {...props}
            >
                <option value="" disabled>
                    {placeholder}
                </option>
                {options.map((option, index) => (
                    <option key={index} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            
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

export default SelectDefault; 