import NavbarSection from '@/src/components/Navbar/NavbarSection'
import React from 'react'
import LoginClient from './LoginClient'

const Login = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarSection />
            <LoginClient />
        </div>
    )
}

export default Login