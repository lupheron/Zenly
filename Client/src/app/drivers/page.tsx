'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useDrivers } from '@/src/hooks/drivers/useDrivers'
import DriverCard from '@/src/components/Cart/DriverCard'
import NavbarSection from '@/src/components/Navbar/NavbarSection'
import PageFooter from '@/src/components/PageFooter'
import BottomNavigation from '@/src/components/BottomNavigation/BottomNavigation'
import { useLanguage } from '@/src/contexts/LanguageContext'

const DriversPage = () => {
    const router = useRouter()
    const { data: drivers, isLoading, error } = useDrivers()
    const { t } = useLanguage()

    return (
        <div className='relative min-h-screen pb-20 lg:pb-0'>
            <NavbarSection />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-20">
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6 cursor-pointer"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {t('drivers.back')}
                </button>

                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                        {t('drivers.title')}
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {t('drivers.description')}
                    </p>
                </div>

                {isLoading ? (
                    <div className="text-center py-20">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="mt-4 text-gray-600">{t('drivers.loading')}</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-500">{t('drivers.error')}</p>
                    </div>
                ) : drivers && drivers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
                        {drivers.map((driver) => (
                            <DriverCard key={driver.id} driver={driver} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">{t('drivers.noDrivers')}</p>
                    </div>
                )}
            </div>

            <PageFooter />
            <BottomNavigation />
        </div>
    )
}

export default DriversPage
