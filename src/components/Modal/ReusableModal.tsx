'use client'

import { Modal } from 'antd'
import React from 'react'

interface ReusableModalProps {
    open: boolean
    onClose: () => void
    title: string
    children: React.ReactNode
}

const ReusableModal: React.FC<ReusableModalProps> = ({ open, onClose, title, children }) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            closable={true}
            footer={null}
            destroyOnClose
            title={title}
        >
            {children}
        </Modal>
    )
}

export default ReusableModal
