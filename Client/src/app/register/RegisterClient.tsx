import Image from 'next/image'
import React from 'react'

const RegisterClient = () => {
    return (
        <div className='w-full max-w-md lg:max-w-lg xl:max-w-xl flex flex-col gap-3 sm:gap-4 bg-dark-green text-white p-4 sm:p-6 lg:p-8 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none h-auto md:h-[700px] lg:h-[670px]'>
            <h1 className='text-2xl sm:text-3xl lg:text-4xl font-semibold'>Ro&apos;yxatdan O&apos;tish</h1>
            <p className='text-sm sm:text-base text-gray-200 leading-relaxed'>
                Biz bilan birga o&apos;z dam olish maskaningizdan daromad qilishni boshlang
            </p>
            <div className="w-full h-48 sm:h-80 relative mt-4 sm:mt-6">
                <Image
                    src="/ready/ready.jpg"
                    alt="Ready"
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
        </div>
    )
}

export default RegisterClient