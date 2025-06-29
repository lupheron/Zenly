'use client'

import { useFeatures } from '@/src/hooks/features/useFeatures'
import React, { useState } from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface FeatureProps {
    postId: number
}

const Features: React.FC<FeatureProps> = ({ postId }) => {
    const { data: features, isLoading, error } = useFeatures(postId)
    const [showAll, setShowAll] = useState(false)

    if (isLoading) return <div>Loading...</div>
    if (error) {
        if (error.status === 404) {
            return <div>{error.message}</div>;
        }
        return <div>Error loading features.</div>;
    }
    if (!features || features.length === 0) return <div>No features available.</div>

    const firstSix = features.slice(0, 6)
    const remaining = features.slice(6)

    return (
        <div>
            <div className="grid grid-cols-2 gap-2">
                {firstSix.map((feature, index) => (
                    <div key={index} className="flex gap-3 p-2 border rounded">
                        <CheckCircleIcon className='text-green-600' />
                        {feature.name}
                    </div>
                ))}
            </div>

            {showAll && remaining.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {remaining.map((feature, index) => (
                        <div key={index + 6} className="flex gap-3 p-2 border rounded">
                            <CheckCircleIcon className='text-green-600' />
                            {feature.name}
                        </div>
                    ))}
                </div>
            )}

            {remaining.length > 0 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="text-blue-500 underline mt-3 block cursor-pointer"
                >
                    {showAll ? "Kamrog'ini ko'rish" : "Hammasini ko'rish"}
                </button>
            )}
        </div>
    )
}

export default Features
