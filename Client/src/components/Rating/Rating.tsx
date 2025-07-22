'use client'

import { usePostRating, useCreateRating, useUserRating } from '@/src/hooks/rating/useRating'
import { useUser } from '@/src/hooks/users/useUser'
import StarRatings from 'react-star-ratings'
import React, { useState } from 'react'
import ReusableModal from '../Modal/ReusableModal'

interface RatingProps {
    postId: number
    postUserId?: number
    allowRating?: boolean
}

const Rating: React.FC<RatingProps> = ({
    postId,
    postUserId,
    allowRating = true
}) => {
    const { data: averageRating, isLoading, error } = usePostRating(postId)
    const { data: userRatingData } = useUserRating(postId)
    const { data: currentUser } = useUser()
    const createRating = useCreateRating()

    const [userRating, setUserRating] = useState<number>(0)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [showHoverText, setShowHoverText] = useState(false)
    const [selfRateError, setSelfRateError] = useState(false)

    const canRate = allowRating &&
        currentUser &&
        userRatingData &&
        !userRatingData.has_rated &&
        postUserId !== currentUser.id

    const handleRatingChange = (newRating: number) => {
        setUserRating(newRating)
    }

    const handleSubmitRating = async () => {
        if (userRating === 0 || isSubmitting) return
        setIsSubmitting(true)
        try {
            await createRating.mutateAsync({ post_id: postId, rating: userRating })
            setShowModal(false)
        } catch (error) {
            console.error('Error submitting rating:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleCancelRating = () => {
        setUserRating(0)
        setShowModal(false)
        setSelfRateError(false)
    }

    const handleStarClick = () => {
        if (canRate) {
            setShowModal(true)
        }
    }

    if (isLoading) return <p className="text-sm text-gray-400">Yuklanmoqda...</p>
    if (error || averageRating === undefined) return <p className="text-sm text-red-500">Reyting yo&apos;q</p>

    return (
        <>
            <div className="flex flex-col xl:flex-col gap-2">
                <div
                    className="relative"
                    onMouseEnter={() => canRate && setShowHoverText(true)}
                    onMouseLeave={() => setShowHoverText(false)}
                    onClick={canRate ? handleStarClick : undefined}
                    style={{ cursor: canRate ? 'pointer' : 'default' }}
                >
                    <StarRatings
                        rating={averageRating}
                        starRatedColor="gold"
                        numberOfStars={5}
                        starDimension="17px"
                        starSpacing="2px"
                        name={`rating-display-${postId}`}
                    />

                    <span className="text-sm text-gray-600 ml-3">({averageRating.toFixed(1)})</span>

                    {showHoverText && canRate && (
                        <div className="absolute top-6 left-0 bg-white border border-gray-200 rounded-md px-2 py-1 shadow-lg z-10">
                            <span className="text-sm text-blue-600 whitespace-nowrap">Baho berish</span>
                        </div>
                    )}
                </div>


                {userRatingData?.has_rated && userRatingData?.user_rating && (
                    <span className="text-sm text-green-600">Sizning bahoyingiz: {userRatingData.user_rating}/5</span>
                )}

                {currentUser && postUserId === currentUser.id && (
                    <span className="text-sm text-gray-500">O&apos;z postlaringizga baho bera olmaysiz</span>
                )}
            </div>

            <ReusableModal
                open={showModal}
                onClose={handleCancelRating}
                title="Baho berish"
                width={400}
            >
                {selfRateError ? (
                    <div className="text-center text-red-600 py-6">Siz o&apos;z postlaringizga baho bera olmaysiz!</div>
                ) : (
                    <div className="space-y-4">
                        <div className="text-center">
                            <p className="text-gray-700 mb-4">Bahongizni bering:</p>
                            <div className="flex justify-center">
                                <StarRatings
                                    rating={userRating}
                                    starRatedColor="gold"
                                    starHoverColor="gold"
                                    starEmptyColor="lightgray"
                                    changeRating={handleRatingChange}
                                    numberOfStars={5}
                                    starDimension="30px"
                                    starSpacing="5px"
                                    name={`rating-input-${postId}`}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 justify-center">
                            <button
                                onClick={handleSubmitRating}
                                disabled={userRating === 0 || isSubmitting}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                            >
                                {isSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                            </button>
                            <button
                                onClick={handleCancelRating}
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors duration-200"
                            >
                                Bekor qilish
                            </button>
                        </div>
                    </div>
                )}
            </ReusableModal>
        </>
    )
}

export default Rating