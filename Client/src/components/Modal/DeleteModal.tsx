'use client'

import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'

interface DeleteModalProps {
    open: boolean
    onConfirm: () => void
    onCancel: () => void
    text: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onConfirm, onCancel, text }) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md lg:max-w-lg shadow-2xl text-center animate-fade-in">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-dark-green">Diqqat!</h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 leading-relaxed">{text}</p>

                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <ButtonDefault
                        label='Ha'
                        onClick={onConfirm}
                        customClasses="w-full sm:w-auto"
                    />
                    <ButtonDefault
                        label="Yo'q"
                        onClick={onCancel}
                        customClasses="w-full sm:w-auto !bg-gray-500"
                    />
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
