import React from 'react'

interface ServicesCartProps {
    icon: React.ReactNode,
    title: string,
    paragraph: string
}

const ServicesCart: React.FC<ServicesCartProps> = ({ icon, title, paragraph }) => {
    return (
        <div className='flex items-center gap-10 bg-light-gray p-5 rounded-lg transition-all duration-300 ease-in-out hover:shadow-lg border-2 border-transparent hover:border-green-400'>
            <div className="w-23 h-20 p-5 flex items-center justify-center text-5xl text-primary bg-white rounded-full transition-all duration-300 hover:bg-green-50 hover:text-green-700 border-2 border-transparent hover:border-green-400">
                {icon}
            </div>

            <div className='flex flex-col justify-center gap-4'>
                <h1 className='text-2xl font-semibold text-gray-800 group-hover:text-green-900'>{title}</h1>
                <p className='leading-[30px] text-gray-500 group-hover:text-gray-700'>{paragraph}</p>
            </div>
        </div>
    )
}

export default ServicesCart