import LoginForm from '@/src/components/Forms/LoginForm'
import Image from 'next/image'
import React from 'react'

const LoginClient = () => {
    return (
        <div className='flex flex-col md:flex-row items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8'>
            {/* Form Section */}
            <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl bg-gray-200 p-4 sm:p-6 lg:p-8 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none h-auto md:h-[550px] lg:h-[550px]'>
                <LoginForm />
            </div>
            
            {/* Info Section */}
            <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl flex flex-col gap-3 sm:gap-4 bg-dark-green text-white p-4 sm:p-6 lg:p-8 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none h-auto md:h-[550px] lg:h-[550px]'>
                <h1 className='text-2xl sm:text-3xl lg:text-4xl font-semibold'>Profilga Kirish</h1>
                <p className='text-sm sm:text-base text-gray-200 leading-relaxed'>
                    Biz bilan birga o&apos;z dam olish maskaningizdan daromad qilishni boshlang
                </p>
                <div className="w-full h-48 sm:h-56 md:flex-1 relative mt-4 sm:mt-6">
                    <Image
                        src="/ready/ready.jpg"
                        alt="Ready"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginClient
