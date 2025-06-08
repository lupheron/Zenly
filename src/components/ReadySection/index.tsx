import Image from 'next/image'
import React from 'react'
import ButtonDefault from '../Button/ButtonDefault'

const ReadySection = () => {
    return (
        <div className='w-full h-100 relative mt-30 z-1'>
            <div className='w-full h-full absolute inset-0'>
                <Image
                    src={"/ready/ready.jpg"}
                    alt='Adventure background'
                    fill
                    className='object-fill brightness-50'
                />
            </div>

            <div className='relative z-10 h-full flex flex-col justify-center items-center gap-5 text-white' data-aos="fade-down">
                <h1 className='w-200 text-center text-5xl font-bold mb-5'>Haqiqiy sarguzasht bilan sayohat qilishga tayyormisiz?</h1>
                <ButtonDefault
                    label='Hoziroq bron qiling'
                    isDisabled={false}
                    onClick={() => { }}
                />
            </div>
        </div>
    )
}

export default ReadySection