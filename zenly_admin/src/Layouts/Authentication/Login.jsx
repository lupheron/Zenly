import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../Components/Macro/Forms/Login/LoginForm';
import useLoginStore from '../../hooks/Auth/useLogin';

function Login() {
    const navigate = useNavigate();
    const { handleLogin, loading, error, isAuthenticated, clearError } = useLoginStore();

    // Check if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // Clear error when component mounts
    useEffect(() => {
        clearError();
    }, [clearError]);

    const onSubmit = async (formData) => {
        const result = await handleLogin(formData);
        if (result.success) {
            // Redirect to dashboard on successful login
            navigate('/dashboard');
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <LoginForm 
                onSubmit={onSubmit}
                loading={loading}
                error={error}
            />
        </div>
    );
}

export default Login;