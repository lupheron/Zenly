'use client'

import { useFeatures } from '@/src/hooks/features/useFeatures'
import React, { useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { ApiError } from '@/src/utils/ApiError'
import { useLanguage } from '@/src/contexts/LanguageContext'

interface FeatureProps {
    postId: number
}

const Features: React.FC<FeatureProps> = ({ postId }) => {
    const { data: features, isLoading, error } = useFeatures(postId)
    const [showAll, setShowAll] = useState(false)
    const { t } = useLanguage()

    if (isLoading) return <div>{t('features.loading')}</div>
    if (error instanceof ApiError && error.status === 404) {
        return <div>{error.message}</div>
    }
    if (error) return <div>{t('features.errorLoading')}</div>
    if (!features || features.length === 0) return <div>{t('features.noFeatures')}</div>

    const getTranslatedFeatureName = (name: string) => {
        const mapping: { [key: string]: string } = {
            'Wi-Fi': 'amenities.wifi',
            'Tashqi va ichki oshxona': 'amenities.kitchen',
            'Shaxsiy hammom': 'amenities.bathroom',
            'Isitish / Konditsioner': 'amenities.climate',
            'Sauna / Issiq vannalar': 'amenities.spa',
            'Mangal / Kamin': 'amenities.bbq',
            'Avtoturargoh': 'amenities.parking',
            'Suzish havzasi': 'amenities.pool',
        }
        return mapping[name] ? t(mapping[name]) : name
    }

    const firstSix = features.slice(0, 6)
    const remaining = features.slice(6)

    return (
        <div>
            <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-2">
                {firstSix.map((feature, index) => (
                    <div key={index} className="flex gap-3 p-2 border rounded">
                        <CheckCircleIcon className="text-green-600" />
                        {getTranslatedFeatureName(feature.name)}
                    </div>
                ))}
            </div>

            {showAll && remaining.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-2 mt-2">
                    {remaining.map((feature, index) => (
                        <div key={index + 6} className="flex gap-3 p-2 border rounded">
                            <CheckCircleIcon className="text-green-600" />
                            {getTranslatedFeatureName(feature.name)}
                        </div>
                    ))}
                </div>
            )}

            {remaining.length > 0 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-500 underline mt-3 block cursor-pointer"
                >
                    {showAll ? t('features.showLess') : t('features.showAll')}
                </button>
            )}
        </div>
    )
}

export default Features
