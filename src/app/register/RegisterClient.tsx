import Image from 'next/image'
import React from 'react'

const RegisterClient = () => {
    return (
        <div className='w-150 h-full flex flex-col gap-2 bg-dark-green text-white p-5 rounded-r-2xl'>
            <h1 className='text-4xl font-semibold'>Ro&apos;yxatdan O&apos;tish</h1>
            <p className='text-gray'>Biz bilan birga o&apos;z dam olish maskaningizdan daromad qilishni boshlang</p>
            <div className="w-full h-full relative mt-5">
                <Image
                    src="/ready/ready.jpg"
                    alt="Ready"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    )
}

export default RegisterClient