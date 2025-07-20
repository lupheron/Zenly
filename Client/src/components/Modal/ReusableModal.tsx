'use client'

import { Modal } from 'antd'
import React from 'react'

interface ReusableModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
    width?: number | string
    customeClasses?: string
}

const ReusableModal: React.FC<ReusableModalProps> = ({
    open,
    onClose,
    title,
    children,
    customeClasses = '',
    width = '100%',
}) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            closable={true}
            footer={null}
            title={
                <div className="text-sm sm:text-base md:text-lg font-semibold text-gray-800">
                    {title}
                </div>
            }
            className={`
                !p-3 sm:!p-4 md:!p-6 
                !top-2 sm:!top-4 md:!top-10 
                !mx-2 sm:!mx-4 md:!mx-auto
                ${customeClasses}
            `}
            width="95%"
            style={{ 
                maxWidth: typeof width === 'number' ? `${width}px` : '600px',
                margin: '0 auto',
                top: '5%'
            }}
            centered={false}
            destroyOnClose={true}
        >
            <div className="w-full max-h-[80vh] overflow-y-auto">
                {children}
            </div>
        </Modal>
    )
}

export default ReusableModal
