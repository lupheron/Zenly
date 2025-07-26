import { useState } from 'react';
import axios from '../axios';

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post('/admin/register', {
        name: formData.name,
        surename: formData.surename,
        username: formData.username,
        password: formData.password,
        password_confirmation: formData.password_confirmation
      });

      if (response.data.success) {
        setSuccess(true);
        return { success: true, data: response.data };
      } else {
        setError(response.data.message || 'Registration failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearSuccess = () => {
    setSuccess(false);
  };

  return {
    register,
    loading,
    error,
    success,
    clearError,
    clearSuccess
  };
};

export default useRegister;
