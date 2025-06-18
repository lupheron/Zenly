'use client'

import { toast } from 'sonner'
import InfoIcon from '@mui/icons-material/Info'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react'

const AlertDefault = {
    info: (message: string) =>
        toast.info(message, {
            icon: <InfoIcon style={{ color: '#0288d1' }} />,
        }),

    warning: (message: string) =>
        toast.warning(message, {
            icon: <WarningAmberIcon style={{ color: '#f9a825' }} />,
        }),

    error: (message: string) =>
        toast.error(message, {
            icon: <ErrorOutlineIcon style={{ color: '#e53935' }} />,
        }),

    success: (message: string) =>
        toast.success(message, {
            icon: <CheckCircleIcon style={{ color: '#43a047' }} />,
        }),

    delete: (message: string) =>
        toast.error(message, {
            icon: <DeleteIcon style={{ color: '#e53935' }} />,
        }),
}

export default AlertDefault
