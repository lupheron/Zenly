"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import ReusableModal from './ReusableModal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LoginIcon from '@mui/icons-material/Login';

interface AuthChoiceModalProps {
    open: boolean;
    onClose: () => void;
}

const AuthChoiceModal: React.FC<AuthChoiceModalProps> = ({ open, onClose }) => {
    const router = useRouter();

    const handleLogin = () => {
        onClose();
        router.push('/login');
    };

    const handleRegister = () => {
        onClose();
        router.push('/register');
    };

    return (
        <ReusableModal
            open={open}
            onClose={onClose}
            title="Profilga kirish yoki ro'yxatdan o'tish"
        >
            <div className="flex flex-col gap-3 sm:gap-4">
                <button
                    onClick={handleLogin}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-light-green text-white rounded hover:opacity-90 cursor-pointer text-sm sm:text-base transition-opacity duration-200"
                >
                    <LoginIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="font-medium">Kirish</span>
                </button>

                <button
                    onClick={handleRegister}
                    className="flex items-center gap-3 p-3 sm:p-4 bg-dark-green text-white rounded hover:opacity-90 cursor-pointer text-sm sm:text-base transition-opacity duration-200"
                >
                    <AccountCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="font-medium">Ro&apos;yxatdan o&apos;tish</span>
                </button>
            </div>
        </ReusableModal>
    );
};

export default AuthChoiceModal;
