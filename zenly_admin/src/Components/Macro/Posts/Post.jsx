import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import ButtonDefault from '../../Mircro/Button/ButtonDefault';
import Rating from '../../Mircro/Rating/Rating';

const PostsCart = ({
    src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400",
    title = "Beautiful Mountain Resort",
    small_description = "Experience breathtaking views and luxury accommodations in this stunning mountain retreat.",
    location = "Aspen, Colorado",
    rating = 4.5,
    price_daily = 299,
    onClick = null,
    customClasses = '',
    postId = 1,
}) => {
    const navigate = useNavigate();

    const formatImageUrl = (imgPath) => {
        if (!imgPath) return '/no-image.jpg';
        if (imgPath.startsWith('http')) return imgPath;
        const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        return `http://zenlyserver.test/${cleanPath}`;
    };

    const formattedSrc = formatImageUrl(src);

    const handleReadMoreClick = async () => {
        if (onClick) {
            navigate(`/posts/${postId}`);
        } else {
            onClick();
        }

    };

    return (
        <div className={`${styles.postCard} ${customClasses}`}>
            <div className={styles.imageContainer}>
                <img
                    src={formattedSrc}
                    alt="Post Image"
                    className={styles.postImage}
                    onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400";
                    }}
                />
            </div>

            <div className={styles.postContent}>
                <div className={styles.postInfo}>
                    <h2 className={styles.postTitle}>{title}</h2>
                    <p className={styles.postDescription}>{small_description}</p>
                    <p className={styles.postLocation}>
                        <svg className={styles.locationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                    </p>
                    <div className={styles.ratingWrapper}>
                        <Rating
                            rating={rating}
                            size="medium"
                            showRatingNumber={true}
                            showRatingText={false}
                            className={styles.postRating}
                        />
                    </div>
                </div>

                <div className={styles.priceSection}>
                    <div className={styles.priceInfo}>
                        <p className={styles.priceLabel}>From</p>
                        <h2 className={styles.priceAmount}>${price_daily}</h2>
                    </div>
                    <ButtonDefault
                        onClick={handleReadMoreClick}
                    >
                        Batafsil
                    </ButtonDefault>
                </div>
            </div>
        </div>
    );
};

export default PostsCart;