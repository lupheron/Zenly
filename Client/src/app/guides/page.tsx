'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useGuides } from '@/src/hooks/guides/useGuides'
import GuideCard from '@/src/components/Cart/GuideCard'
import NavbarSection from '@/src/components/Navbar/NavbarSection'
import PageFooter from '@/src/components/PageFooter'
import BottomNavigation from '@/src/components/BottomNavigation/BottomNavigation'

const GuidesPage = () => {
    const router = useRouter()
    const { data: guides, isLoading, error } = useGuides()

    return (
        <div className='relative min-h-screen pb-20 lg:pb-0'>
            <NavbarSection />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center text-green-600 hover:text-green-700 mb-6 cursor-pointer"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Orqaga
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                        Gidlar
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Professional gidlarimiz bilan tarixiy joylarni kashf eting
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500">Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.</p>
                    </div>
                ) : guides && guides.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                        {guides.map((guide) => (
                            <GuideCard key={guide.id} guide={guide} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">Hozircha gidlar mavjud emas</p>
                    </div>
                )}
            </div>

            <PageFooter />
            <BottomNavigation />
        </div>
    )
}

export default GuidesPage
