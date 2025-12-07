import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

interface DriverCardProps {
    driver: {
        id: number
        first_name: string
        last_name: string
        profile_photo: string | null
        vehicle_type: string
        vehicle_model: string
        price_per_day: number
        language: string
        rating: number | null
        experience_years: number
        location: string
    }
}

const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
    const router = useRouter()

    const formatImageUrl = (imgPath: string | null | undefined): string => {
        if (!imgPath) return '/no-image.jpg'
        if (imgPath.startsWith('http')) return imgPath
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
        return `http://zenlyserver.test/${cleanPath}`
    }

    return (
        <div
            onClick={() => router.push(`/drivers/${driver.id}`)}
            className="w-full bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
        >
            <div className="relative w-full aspect-[4/3]">
                <Image
                    src={formatImageUrl(driver.profile_photo)}
                    alt={`${driver.first_name} ${driver.last_name}`}
                    fill
                    className='rounded-t-xl object-cover'
                    unoptimized={process.env.NODE_ENV !== 'production'}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>

            <div className='p-4 sm:p-5'>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-lg sm:text-xl font-bold'>
                        {driver.first_name} {driver.last_name}
                    </h2>

                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                        </svg>
                        <span>{driver.vehicle_type} - {driver.vehicle_model}</span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{driver.experience_years} yil tajriba</span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{driver.location}</span>
                    </div>

                    {driver.rating && (
                        <div className='flex items-center gap-1'>
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className='font-semibold'>{driver.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>

                <div className='mt-4 pt-4 border-t border-gray-100'>
                    <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-500'>Kunlik narx</span>
                        <span className='text-xl font-bold text-green-600'>${driver.price_per_day}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DriverCard
