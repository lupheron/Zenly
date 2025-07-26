import React from 'react';
import LoginForm from '../../Components/Macro/Forms/Login/LoginForm';

function Login() {
    const handleLogin = (formData) => {
        console.log('Login attempt:', formData);
        // Here you would typically call your login API
        // Example:
        // loginUser(formData).then(response => {
        //     // Handle successful login
        // }).catch(error => {
        //     // Handle login error
        // });
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
                onSubmit={handleLogin}
                loading={false}
                error={null}
            />
        </div>
    );
}

export default Login;