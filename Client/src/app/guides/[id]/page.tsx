'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useGuide } from '@/src/hooks/guides/useGuides'
import NavbarSection from '@/src/components/Navbar/NavbarSection'
import PageFooter from '@/src/components/PageFooter'
import BottomNavigation from '@/src/components/BottomNavigation/BottomNavigation'
import Image from 'next/image'

const GuideProfilePage = () => {
    const params = useParams()
    const router = useRouter()
    const id = params?.id as string
    const { data: guide, isLoading, error } = useGuide(id)

    const formatImageUrl = (imgPath: string | null | undefined): string => {
        if (!imgPath) return '/no-image.jpg'
        if (imgPath.startsWith('http')) return imgPath
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
        return `http://zenlyserver.test/${cleanPath}`
    }

    if (isLoading) {
        return (
            <div className='relative min-h-screen pb-20 lg:pb-0'>
                <NavbarSection />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !guide) {
        return (
            <div className='relative min-h-screen pb-20 lg:pb-0'>
                <NavbarSection />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <p className="text-red-500 text-lg">Gid topilmadi</p>
                        <button
                            onClick={() => router.push('/guides')}
                            className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer"
                        >
                            Orqaga
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='relative min-h-screen pb-20 lg:pb-0 bg-gray-50'>
            <NavbarSection />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                <button
                    onClick={() => router.push('/guides')}
                    className="flex items-center text-green-600 hover:text-green-700 mb-6 cursor-pointer"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Orqaga
                </button>

                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                        {/* Profile Photo */}
                        <div className="md:col-span-1">
                            <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                                <Image
                                    src={formatImageUrl(guide.profile_photo)}
                                    alt={`${guide.first_name} ${guide.last_name}`}
                                    fill
                                    className='object-cover'
                                    unoptimized={process.env.NODE_ENV !== 'production'}
                                />
                            </div>
                            {guide.rating && (
                                <div className='flex items-center justify-center gap-2 mt-4 bg-yellow-50 py-3 rounded-lg'>
                                    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className='text-2xl font-bold'>{guide.rating.toFixed(1)}</span>
                                </div>
                            )}
                        </div>

                        {/* Guide Info */}
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                                    {guide.first_name} {guide.last_name}
                                </h1>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {guide.location}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Mutaxassislik</p>
                                    <p className="text-lg font-semibold text-gray-800">{guide.specialization}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Tajriba</p>
                                    <p className="text-lg font-semibold text-gray-800">{guide.experience_years} yil</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg sm:col-span-2">
                                    <p className="text-sm text-gray-600">Tillar</p>
                                    <p className="text-lg font-semibold text-gray-800">{guide.languages}</p>
                                </div>
                            </div>

                            {guide.bio && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-3">Haqida</h2>
                                    <p className="text-gray-600 leading-relaxed">{guide.bio}</p>
                                </div>
                            )}

                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Holat</p>
                                        <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${guide.available === 'yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {guide.available === 'yes' ? 'Mavjud' : 'Band'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600 mb-2">Aloqa</p>
                                <p className="text-gray-800 font-medium">{guide.phone}</p>
                                <p className="text-gray-800">{guide.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PageFooter />
            <BottomNavigation />
        </div>
    )
}

export default GuideProfilePage
