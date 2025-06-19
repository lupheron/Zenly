'use client'

import { usePostRating } from '@/src/hooks/rating/useRating'
import StarRatings from 'react-star-ratings'
import React from 'react'

const Rating = ({ postId }: { postId: number }) => {
    const { data, isLoading, error } = usePostRating(postId)

    if (isLoading) return <p className="text-sm text-gray-400">Yuklanmoqda...</p>
    if (error || data === undefined) return <p className="text-sm text-red-500">Reyting yo'q</p>

    return (
        <div className="flex items-center gap-2">
            <StarRatings
                rating={data}
                starRatedColor="gold"
                numberOfStars={5}
                starDimension="20px"
                starSpacing="2px"
                name={`rating-${postId}`}
            />
            <span className="text-sm text-gray-600">({data.toFixed(1)})</span>
        </div>
    )
}

export default Rating
