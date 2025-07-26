import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../../Components/Macro/Forms/Register/RegisterForm';
import styles from '../../assets/css/components.module.css';

function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSuccess = (formData) => {
    setSuccess(true);
    setError(null);
    
    // Show success message for 2 seconds then redirect to login
    setTimeout(() => {
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please log in with your new account.',
          email: formData.email 
        } 
      });
    }, 2000);
  };

  const handleRegisterError = (error) => {
    setError(error);
    setSuccess(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Admin Registration</h1>
          <p className={styles.authSubtitle}>
            Create a new admin account to access the dashboard
          </p>
        </div>

        {success && (
          <div className={styles.successMessage}>
            <h3>Registration Successful!</h3>
            <p>Your admin account has been created. Redirecting to login...</p>
          </div>
        )}

        {!success && (
          <RegisterForm
            onSubmit={handleRegisterSuccess}
            onError={handleRegisterError}
            loading={loading}
            error={error}
          />
        )}

        <div className={styles.authFooter}>
          <p>
            Already have an account?{' '}
            <a 
              href="/login" 
              className={styles.authLink}
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;