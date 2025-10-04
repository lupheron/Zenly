import LoginForm from '@/src/components/Forms/LoginForm'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const LoginClient = () => {
    return (
        <div>
            <Link
                href="/"
                className="bg-white/95 backdrop-blur-sm rounded-lg mt-10 ml-5 w-30 px-3 py-2 shadow-lg hover:bg-white transition-colors duration-200 flex items-center gap-2"
            >
                <ArrowBackIcon className="text-gray-700 w-5 h-5" />
                <span className="text-gray-700 font-medium text-sm">Qaytish</span>
            </Link>
             <div className='flex flex-col md:flex-row lg:items-center lg:justify-center p-4 sm:p-6 lg:p-8 w-full max-w-full overflow-x-hidden lg:mt-30'>
                <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl bg-gray-200 p-4 sm:p-6 lg:p-8 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none h-70 md:h-[550px] lg:h-[550px] overflow-hidden'>
                    <LoginForm />
                </div>

                <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl flex flex-col gap-3 sm:gap-4 bg-dark-green text-white p-4 sm:p-6 lg:p-8 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none h-120 md:h-[550px] lg:h-[550px] overflow-hidden'>
                    <h1 className='text-2xl sm:text-3xl lg:text-4xl font-semibold'>Profilga Kirish</h1>
                    <p className='text-sm sm:text-base text-gray-200 leading-relaxed'>
                        Biz bilan birga o&apos;z dam olish maskaningizdan daromad qilishni boshlang
                    </p>
                    <div className="w-full h-120 sm:h-56 md:flex-1 relative mt-4 sm:mt-6">
                        <Image
                            src="/ready/ready.jpg"
                            alt="Ready"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginClient
