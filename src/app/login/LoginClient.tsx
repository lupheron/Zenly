import LoginForm from '@/src/components/Forms/LoginForm'
import Image from 'next/image'
import React from 'react'

const LoginClient = () => {
    return (
        <div className='flex items-center justify-center mt-50'>
            <div className='w-140 h-130 bg-gray-200 p-5 rounded-l-2xl'>
                <LoginForm />
            </div>
            <div className='w-150 h-130 flex flex-col gap-2 bg-dark-green text-white p-5 rounded-r-2xl'>
                <h1 className='text-4xl font-semibold'>Profilga Kirish</h1>
                <p className='text-gray'>Biz bilan birga o'z dam olish maskaningizdan daromad qilishni boshlang</p>
                <div className="w-full h-full relative mt-5">
                    <Image
                        src="/ready/ready.jpg"
                        alt="Ready"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginClient