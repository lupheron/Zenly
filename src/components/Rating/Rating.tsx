'use client'

import { usePostRating } from '@/src/hooks/rating/useRating'
import StarRatings from 'react-star-ratings'
import React from 'react'

interface RatingProps {
    postId: number
    userId: string | null
}

const Rating = ({ postId, userId }: RatingProps) => {
    const { data, isLoading, error } = usePostRating(postId)

    if (isLoading) return <p className="text-sm text-gray-400">Yuklanmoqda...</p>
    if (error || !data) return <p className="text-sm text-red-500">Reyting yo'q</p>

    const userIdNumber = Number(userId)

    return (
        <div className="flex items-center gap-2">
            {data.user_id === userIdNumber && (
                <>
                    <StarRatings
                        rating={data.average_rating}
                        starRatedColor="gold"
                        numberOfStars={5}
                        starDimension="20px"
                        starSpacing="2px"
                        name={`rating-${postId}`}
                    />
                    <span className="text-sm text-gray-600">({data.average_rating.toFixed(1)})</span>
                </>
            )}
        </div>
    )
}

export default Rating
