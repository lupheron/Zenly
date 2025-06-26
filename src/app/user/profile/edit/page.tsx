import EditUserForm from '@/src/components/Forms/EditUserForm'
import React from 'react'

const EditUser = () => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-4xl font-bold tracking-[1px] mb-15'>Foydalanuvchi ma'lumotlarini tahririlash</h1>
            <div className='min-w-250 bg-white p-5 rounded-2xl'>
                <EditUserForm />
            </div>
        </div>
    )
}

export default EditUser
