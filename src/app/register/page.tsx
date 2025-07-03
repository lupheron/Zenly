'use client'

import NavbarSection from '@/src/components/Navbar/NavbarSection'
import React, { useState } from 'react'
import ReusableModal from '@/src/components/Modal/ReusableModal'
import WorkIcon from '@mui/icons-material/Work'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import RegisterClient from './RegisterClient'
import RegisterForm from '@/src/components/Forms/Register/RegisterForm'
import RegisterClientForm from '@/src/components/Forms/Register/RegisterClientForm'

const Register = () => {
    const [modalOpen, setModalOpen] = useState(true)
    const [selectedType, setSelectedType] = useState<'business' | 'user' | null>(null)

    const handleSelect = (type: 'business' | 'user') => {
        setSelectedType(type)
        setModalOpen(false)
    }

    const handleForceClose = () => {
        window.history.back()
    }

    return (
        <div>
            <NavbarSection />

            <div className="flex items-center justify-center mt-50 h-150">
                <div className='w-140 h-full bg-gray-200 p-5 rounded-l-2xl flex flex-col gap-4'>
                    {selectedType && (
                        <>
                            <h2 className='text-2xl font-bold mb-4'>
                                {selectedType === 'business'
                                    ? "Joy egasi uchun ro'yxatdan o'tish"
                                    : "Foydalanuvchi uchun ro'yxatdan o'tish"}
                            </h2>

                            {selectedType === 'business' && <RegisterForm />}
                            {selectedType === 'user' && <RegisterClientForm />}
                        </>
                    )}
                </div>

                <RegisterClient />
            </div>

            <ReusableModal
                open={modalOpen}
                onClose={handleForceClose}
                title="Ro'yxatdan o'tish turini tanlang!"
            >
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => handleSelect('business')}
                        className="flex items-center gap-3 p-4 bg-light-green text-white rounded hover:opacity-90  cursor-pointer"
                    >
                        <WorkIcon />
                        <span className="text-lg font-medium">Joy egasi</span>
                    </button>

                    <button
                        onClick={() => handleSelect('user')}
                        className="flex items-center gap-3 p-4 bg-dark-green text-white rounded hover:opacity-90  cursor-pointer"
                    >
                        <AccountCircleIcon />
                        <span className="text-lg font-medium">Foydalanuvchi</span>
                    </button>
                </div>
            </ReusableModal>
        </div>
    )
}

export default Register
