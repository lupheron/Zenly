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
    const [displayedImage, setDisplayedImage] = useState<string>('')
    const [imageError, setImageError] = useState(false)

    const formatImageUrl = (imgPath: string | null | undefined): string => {
        if (!imgPath) return '';
        if (imgPath.startsWith('http')) return imgPath;
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        return `http://zenlyserver.test/${cleanPath}`;
    };

    const allImages = useMemo(() => [
        { id: 'main', img: formatImageUrl(mainImg) },
        ...galleryImages.map(img => ({
            ...img,
            img: formatImageUrl(img.img)
        }))
    ], [mainImg, galleryImages]);

    useEffect(() => {
        if (mainImg) {
            const formattedUrl = formatImageUrl(mainImg);
            setDisplayedImage(formattedUrl);
            setImageError(false);
        } else {
            setDisplayedImage('');
        }
    }, [mainImg]);

    const handleImageClick = (clickedImg: string) => {
        setDisplayedImage(clickedImg);
        setImageError(false);
    }

    if (isLoading) return <p>Yuklanmoqda...</p>

    return (
        <div className="flex flex-col gap-4 items-center">
            <div className="w-full h-64 md:h-96 relative rounded-xl overflow-hidden bg-gray-100">
                {displayedImage && !imageError ? (
                    <Image
                        src={displayedImage}
                        alt="Main display"
                        fill
                        className="object-cover"
                        priority
                        onError={() => setImageError(true)}
                        onLoad={() => setImageError(false)}
                        unoptimized={process.env.NODE_ENV !== 'production'}
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Rasm mavjud emas
                    </div>
                )}
            </div>

            <div className="flex gap-4 overflow-x-auto py-2 w-full px-4">
                {allImages.filter(img => img.img).map((image) => (
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
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.style.display = 'none'
                            }}
                            onLoad={() => setImageError(false)}
                            unoptimized={process.env.NODE_ENV !== 'production'}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Gallery