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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className={styles.loginForm}>
      <h2 className={styles.formTitle}>Welcome Back</h2>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <InputDefault
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <InputDefault
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            name="rememberMe"
            id="rememberMe"
            className={styles.checkbox}
            checked={formData.rememberMe}
            onChange={handleInputChange}
            disabled={loading}
          />
          <label htmlFor="rememberMe" className={styles.checkboxLabel}>
            Remember me
          </label>
        </div>

        <ButtonDefault
          type="submit"
          variant="primary"
          disabled={loading}
          style={{ width: '100%' }}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </ButtonDefault>
      </form>
    </div>
  );
}

export default LoginForm;