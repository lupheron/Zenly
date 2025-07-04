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

const ReusableModal: React.FC<ReusableModalProps> = ({ open, onClose, title, children, customeClasses = '', width }) => {
    return (
        <Modal
            open={open}
            onCancel={onClose}
            closable={true}
            footer={null}
            destroyOnClose
            title={title}
            className={customeClasses}
            width={width}
        >
            {children}
        </Modal>
    )
}

export default ReusableModal
