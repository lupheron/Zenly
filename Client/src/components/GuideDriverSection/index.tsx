'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/src/contexts/LanguageContext'

const GuideDriverSection = () => {
    const router = useRouter()
    const { t } = useLanguage()

    return (
        <div className="w-full py-16 px-4 bg-gradient-to-br from-blue-50 to-green-50 mt-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10" data-aos="fade-down">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 max-w-3xl mx-auto mb-4">
                        {t('guideDriver.title')}
                        <span className="block text-green-600 mt-2">{t('guideDriver.subtitle')}</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" data-aos="fade-up">
                    <div
                        onClick={() => router.push('/drivers')}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                                {t('guideDriver.driverTitle')}
                            </h3>
                            <p className="text-gray-600 text-base sm:text-lg mb-6">
                                {t('guideDriver.driverDesc')}
                            </p>
                            <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                <span>{t('guideDriver.more')}</span>
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div
                        onClick={() => router.push('/guides')}
                        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                    >
                        <div className="p-8 sm:p-10">
                            <div className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full mb-6 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                                {t('guideDriver.guideTitle')}
                            </h3>
                            <p className="text-gray-600 text-base sm:text-lg mb-6">
                                {t('guideDriver.guideDesc')}
                            </p>
                            <div className="flex items-center text-green-600 font-semibold group-hover:translate-x-2 transition-transform duration-300">
                                <span>{t('guideDriver.more')}</span>
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GuideDriverSection
