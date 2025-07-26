import React, { useState } from 'react';
import styles from '../../../../assets/css/components.module.css';
import ButtonDefault from '../../../Mircro/Button/ButtonDefault';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import useRegister from '../../../../hooks/Auth/useRegister';

function RegisterForm({ onSubmit, loading = false, error = null }) {
  const [formData, setFormData] = useState({
    name: '',
    surename: '',
    username: '',
    password: '',
    password_confirmation: ''
  });

  const [validationErrors, setValidationErrors] = useState({});
  const { register, loading: registerLoading, error: registerError, clearError } = useRegister();

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      errors.name = 'Name must not exceed 50 characters';
    }

    if (!formData.surename.trim()) {
      errors.surename = 'Surname is required';
    } else if (formData.surename.length > 50) {
      errors.surename = 'Surname must not exceed 50 characters';
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 50) {
      errors.username = 'Username must not exceed 50 characters';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Clear API error when user starts typing
    if (registerError) {
      clearError();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register(formData);
    
    if (result.success) {
      // Call the parent onSubmit if provided
      if (onSubmit) {
        onSubmit(formData);
      }
    }
  };

  // Use the loading and error from the hook
  const isLoading = loading || registerLoading;
  const displayError = error || registerError;

  return (
    <div className={styles.registerForm}>
      <h2 className={styles.formTitle}>Create Admin Account</h2>

      {displayError && (
        <div className={styles.errorMessage}>
          {displayError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <InputDefault
            type="text"
            name="name"
            id="name"
            label="Name"
            showLabel={true}
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className={validationErrors.name ? styles.inputError : ''}
          />
          {validationErrors.name && (
            <span className={styles.validationError}>{validationErrors.name}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <InputDefault
            type="text"
            name="surename"
            id="surename"
            label="Surname"
            showLabel={true}
            placeholder="Enter your surname"
            value={formData.surename}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className={validationErrors.surename ? styles.inputError : ''}
          />
          {validationErrors.surename && (
            <span className={styles.validationError}>{validationErrors.surename}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <InputDefault
            type="text"
            name="username"
            id="username"
            label="Username"
            showLabel={true}
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className={validationErrors.username ? styles.inputError : ''}
          />
          {validationErrors.username && (
            <span className={styles.validationError}>{validationErrors.username}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <InputDefault
            type="password"
            name="password"
            id="password"
            label="Password"
            showLabel={true}
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className={validationErrors.password ? styles.inputError : ''}
          />
          {validationErrors.password && (
            <span className={styles.validationError}>{validationErrors.password}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <InputDefault
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            label="Confirm Password"
            showLabel={true}
            placeholder="Confirm your password"
            value={formData.password_confirmation}
            onChange={handleInputChange}
            required
            disabled={isLoading}
            className={validationErrors.password_confirmation ? styles.inputError : ''}
          />
          {validationErrors.password_confirmation && (
            <span className={styles.validationError}>{validationErrors.password_confirmation}</span>
          )}
        </div>



        <ButtonDefault
          type="submit"
          variant="primary"
          disabled={isLoading}
          style={{ width: '100%' }}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </ButtonDefault>
      </form>
    </div>
  );
}

export default RegisterForm;