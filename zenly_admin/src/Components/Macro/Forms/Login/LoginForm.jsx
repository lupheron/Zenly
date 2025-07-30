import React, { useState } from 'react';
import styles from '../../../../assets/css/components.module.css'
import ButtonDefault from '../../../Mircro/Button/ButtonDefault';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';

function LoginForm({ onSubmit, loading = false, error = null }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (onSubmit) {
        onSubmit(formData);
      }
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.formTitle}>Welcome Back</h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        Sign in to your admin account
      </p>

      {error && (
        <div className={styles.errorMessage} style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          border: '1px solid #fcc'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <InputDefault
            type="text"
            name="username"
            id="username"
            label="Username"
            showLabel={true}
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={loading}
            error={validationErrors.username}
          />
        </div>

        <div className={styles.formGroup}>
          <InputDefault
            type="password"
            name="password"
            id="password"
            label="Password"
            showLabel={true}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
            error={validationErrors.password}
          />
        </div>

        <div className={styles.checkboxGroup} style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            className={styles.checkbox}
            checked={formData.rememberMe}
            onChange={handleInputChange}
            disabled={loading}
            style={{ marginRight: '8px' }}
          />
          <label htmlFor="rememberMe" className={styles.checkboxLabel} style={{
            fontSize: '14px',
            color: '#666',
            cursor: 'pointer'
          }}>
            Remember me
          </label>
        </div>

        <ButtonDefault
          type="submit"
          variant="primary"
          disabled={loading}
          style={{ 
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: '600'
          }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </ButtonDefault>
      </form>
    </div>
  );
}

export default LoginForm;