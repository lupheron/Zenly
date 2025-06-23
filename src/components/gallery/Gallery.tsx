'use client'

import { useGalleryByPostId } from '@/src/hooks/gallery/useGalleryByPostId'
import Image from 'next/image'
import React, { useState, useEffect, useMemo } from 'react'

interface GalleryProps {
    postId: number
    mainImg: string
}

const Gallery: React.FC<GalleryProps> = ({ postId, mainImg }) => {
    const { data: galleryImages = [], isLoading } = useGalleryByPostId(postId)
    const [displayedImage, setDisplayedImage] = useState<string>(mainImg)

    // Memoize the combined images array
    const allImages = useMemo(() => [
        { id: 'main', img: mainImg },
        ...galleryImages
    ], [mainImg, galleryImages])

    // Reset displayed image when mainImg changes
    useEffect(() => {
        setDisplayedImage(mainImg)
    }, [mainImg])

    const handleImageClick = (clickedImg: string) => {
        setDisplayedImage(clickedImg)
    }

    if (isLoading) return <p>Yuklanmoqda...</p>

    return (
        <div className="flex flex-col gap-4 items-center">
            {/* Main displayed image */}
            <div className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden">
                <Image
                    src={displayedImage}
                    alt="Main display"
                    fill
                    className="object-cover"
                    priority
                    unoptimized={process.env.NODE_ENV !== 'production'}
                />
            </div>

            {/* Thumbnail gallery */}
            <div className="flex gap-4 overflow-x-auto py-2 w-full px-4">
                {allImages.map((image) => (
                    <div
                        key={image.id}
                        className={`flex-shrink-0 w-20 h-16 relative rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${displayedImage === image.img
                                ? 'border-blue-500 scale-105'
                                : 'border-transparent hover:scale-105'
                            }`}
                        onClick={() => handleImageClick(image.img)}
                    >
                        <Image
                            src={image.img}
                            alt={`Thumbnail ${image.id}`}
                            fill
                            className="object-cover"
                            sizes="80px"
                            unoptimized={process.env.NODE_ENV !== 'production'}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Gallery