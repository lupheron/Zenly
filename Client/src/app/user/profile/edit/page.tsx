'use client'
import EditUserForm from '@/src/components/Forms/EditUserForm'
import React from 'react'

import { useLanguage } from '@/src/contexts/LanguageContext'

const EditUser = () => {
    const { t } = useLanguage()
    return (
        <div className='flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[1px] mb-8 sm:mb-12 lg:mb-15 text-center'>
                {t('user.editUserInfo')}
            </h1>
            <div className='w-full max-w-md lg:max-w-2xl xl:max-w-4xl bg-white p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl shadow-xl'>
                <EditUserForm />
            </div>
        </div>
    )
}

export default EditUser
