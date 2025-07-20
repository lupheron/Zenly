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
        <div className="min-h-screen bg-gray-50">
            <NavbarSection />

            <div className="flex flex-col md:flex-row items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
                <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl bg-gray-200 p-4 sm:p-6 lg:p-8 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none h-auto md:h-[700px] lg:h-[670px] flex items-center'>
                    {selectedType && (
                        <div className="w-full">
                            <h2 className='text-xl sm:text-2xl font-bold mb-4 sm:mb-6'>
                                {selectedType === 'business'
                                    ? "Joy egasi uchun ro'yxatdan o'tish"
                                    : "Foydalanuvchi uchun ro'yxatdan o'tish"}
                            </h2>

                            {selectedType === 'business' && <RegisterForm />}
                            {selectedType === 'user' && <RegisterClientForm />}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <RegisterClient />
            </div>

            <ReusableModal
                open={modalOpen}
                onClose={handleForceClose}
                title="Ro'yxatdan o'tish turini tanlang!"
            >
                <div className="flex flex-col gap-3 sm:gap-4">
                    <button
                        onClick={() => handleSelect('business')}
                        className="flex items-center gap-3 p-3 sm:p-4 bg-light-green text-white rounded hover:opacity-90 cursor-pointer text-sm sm:text-base"
                    >
                        <WorkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-medium">Joy egasi</span>
                    </button>

                    <button
                        onClick={() => handleSelect('user')}
                        className="flex items-center gap-3 p-3 sm:p-4 bg-dark-green text-white rounded hover:opacity-90 cursor-pointer text-sm sm:text-base"
                    >
                        <AccountCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                        <span className="font-medium">Foydalanuvchi</span>
                    </button>
                </div>
            </ReusableModal>
        </div>
    )
}

export default Register