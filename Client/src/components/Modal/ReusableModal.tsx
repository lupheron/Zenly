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
            title={title}
            className={`!p-4 sm:!p-6 md:!p-8 !top-4 sm:!top-10 ${customeClasses}`}
            width={typeof width === 'number' ? width : '90%'} 
            style={{ maxWidth: '750px', margin: '0 auto' }} 
        >
            {children}
        </Modal>
    )
}

export default ReusableModal
