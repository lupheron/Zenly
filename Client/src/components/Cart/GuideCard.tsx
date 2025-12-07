import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'

interface GuideCardProps {
    guide: {
        id: number
        first_name: string
        last_name: string
        profile_photo: string | null
        specialization: string
        languages: string
        rating: number | null
        experience_years: number
        location: string
    }
}

const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
    const router = useRouter()

    const formatImageUrl = (imgPath: string | null | undefined): string => {
        if (!imgPath) return '/no-image.jpg'
        if (imgPath.startsWith('http')) return imgPath
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
        return `http://zenlyserver.test/${cleanPath}`
    }

    return (
        <div
            onClick={() => router.push(`/guides/${guide.id}`)}
            className="w-full bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden"
        >
            <div className="relative w-full aspect-[4/3]">
                <Image
                    src={formatImageUrl(guide.profile_photo)}
                    alt={`${guide.first_name} ${guide.last_name}`}
                    fill
                    className='rounded-t-xl object-cover'
                    unoptimized={process.env.NODE_ENV !== 'production'}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
            </div>

            <div className='p-4 sm:p-5'>
                <div className='flex flex-col gap-2'>
                    <h2 className='text-lg sm:text-xl font-bold'>
                        {guide.first_name} {guide.last_name}
                    </h2>

                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        <span className='line-clamp-1'>{guide.specialization}</span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                        </svg>
                        <span className='line-clamp-1'>{guide.languages}</span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span>{guide.experience_years} yil tajriba</span>
                    </div>

                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{guide.location}</span>
                    </div>

                    {guide.rating && (
                        <div className='flex items-center gap-1 mt-2'>
                            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className='font-semibold'>{guide.rating.toFixed(1)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default GuideCard
