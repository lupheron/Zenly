import React, { useState, useEffect, useMemo } from 'react';
import styles from '../../../assets/css/components.module.css';
import { useGalleryByPostId } from '../../../hooks/Gallery/useGallery';

const Gallery = ({ postId, mainImg }) => {
    const { galleryImages = [], loading } = useGalleryByPostId(postId);
    const [displayedImage, setDisplayedImage] = useState('');
    const [imageError, setImageError] = useState(false);

    const formatImageUrl = (imgPath) => {
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

    const handleImageClick = (clickedImg) => {
        setDisplayedImage(clickedImg);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handleImageLoad = () => {
        setImageError(false);
    };

    if (loading) return <p className={styles.loading}>Yuklanmoqda...</p>;

    return (
        <div className={styles.galleryContainer}>
            {/* Main Display Image */}
            <div className={styles.mainImageContainer}>
                {displayedImage && !imageError ? (
                    <img
                        src={displayedImage}
                        alt="Main display"
                        className={styles.mainImage}
                        onError={handleImageError}
                        onLoad={handleImageLoad}
                    />
                ) : (
                    <div className={styles.noImagePlaceholder}>
                        <svg className={styles.noImageIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21,15 16,10 5,21" />
                        </svg>
                        <span>Rasm mavjud emas</span>
                    </div>
                )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.filter(img => img.img).length > 1 && (
                <div className={styles.thumbnailContainer}>
                    <div className={styles.thumbnailScroll}>
                        {allImages.filter(img => img.img).map((image) => (
                            <div
                                key={image.id}
                                className={`${styles.thumbnailWrapper} ${displayedImage === image.img ? styles.activeThumbnail : ''
                                    }`}
                                onClick={() => handleImageClick(image.img)}
                            >
                                <img
                                    src={image.img}
                                    alt={`Thumbnail ${image.id}`}
                                    className={styles.thumbnailImage}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;