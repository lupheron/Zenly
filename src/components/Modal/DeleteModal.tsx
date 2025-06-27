'use client'

import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'

interface DeleteModalProps {
    open: boolean
    onConfirm: () => void
    onCancel: () => void
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onConfirm, onCancel }) => {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-2xl text-center animate-fade-in">
                <h2 className="text-2xl font-bold mb-4 text-dark-green">Diqqat!</h2>
                <p className="text-gray-700 mb-6">Haqiqatan ham ushbu postni o'chirmoqchimisiz?</p>

                <div className="flex justify-center gap-4">
                    <ButtonDefault
                        label='Ha'
                        onClick={onConfirm}
                    />
                    <ButtonDefault
                        label="Yo'q"
                        onClick={onCancel}
                    />
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
