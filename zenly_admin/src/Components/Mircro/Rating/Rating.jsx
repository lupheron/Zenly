import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../../assets/css/components.module.css';

const Rating = ({
    rating = 0,
    maxRating = 5,
    size = 'medium',
    showRatingText = true,
    showRatingNumber = true,
    interactive = false,
    onRatingChange = null,
    precision = 0.5, // 0.5 for half stars, 1 for whole stars only
    className = '',
    starColor = '#fbbf24',
    emptyStarColor = '#d1d5db',
    textColor = '#6b7280'
}) => {
    const [hoverRating, setHoverRating] = React.useState(0);

    // Size configurations
    const sizeConfig = {
        small: { width: 12, height: 12, fontSize: '0.75rem' },
        medium: { width: 16, height: 16, fontSize: '0.875rem' },
        large: { width: 20, height: 20, fontSize: '1rem' },
        xlarge: { width: 24, height: 24, fontSize: '1.125rem' }
    };

    const currentSize = sizeConfig[size] || sizeConfig.medium;

    // Handle star click for interactive rating
    const handleStarClick = (value) => {
        if (interactive && onRatingChange) {
            onRatingChange(value);
        }
    };

    // Handle star hover for interactive rating
    const handleStarHover = (value) => {
        if (interactive) {
            setHoverRating(value);
        }
    };

    // Handle mouse leave for interactive rating
    const handleMouseLeave = () => {
        if (interactive) {
            setHoverRating(0);
        }
    };

    // Calculate which rating to display (hover rating for interactive, actual rating otherwise)
    const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

    // Generate stars array
    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= maxRating; i++) {
            const isFilled = i <= Math.floor(displayRating);
            const isHalfFilled = !isFilled && i <= Math.ceil(displayRating) && displayRating % 1 !== 0;
            const isEmpty = !isFilled && !isHalfFilled;

            // Calculate the fill percentage for partial stars
            let fillPercentage = 0;
            if (isFilled) {
                fillPercentage = 100;
            } else if (isHalfFilled) {
                fillPercentage = (displayRating - Math.floor(displayRating)) * 100;
            }

            stars.push(
                <div
                    key={i}
                    className={`${styles.starWrapper} ${interactive ? styles.interactive : ''}`}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => handleStarHover(i)}
                    style={{ cursor: interactive ? 'pointer' : 'default' }}
                >
                    <svg
                        width={currentSize.width}
                        height={currentSize.height}
                        viewBox="0 0 24 24"
                        className={styles.star}
                    >
                        <defs>
                            <linearGradient id={`star-fill-${i}`}>
                                <stop offset={`${fillPercentage}%`} stopColor={starColor} />
                                <stop offset={`${fillPercentage}%`} stopColor={emptyStarColor} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            fill={`url(#star-fill-${i})`}
                            stroke={isEmpty ? emptyStarColor : starColor}
                            strokeWidth="0.5"
                        />
                    </svg>
                </div>
            );
        }

        return stars;
    };

    return (
        <div
            className={`${styles.ratingContainer} ${className}`}
            onMouseLeave={handleMouseLeave}
        >
            <div className={styles.starsContainer}>
                {renderStars()}
            </div>

            {(showRatingText || showRatingNumber) && (
                <div className={styles.ratingInfo}>
                    {showRatingNumber && (
                        <span
                            className={styles.ratingNumber}
                            style={{
                                fontSize: currentSize.fontSize,
                                color: textColor
                            }}
                        >
                            {rating.toFixed(1)}
                        </span>
                    )}
                    {showRatingText && (
                        <span
                            className={styles.ratingText}
                            style={{
                                fontSize: currentSize.fontSize,
                                color: textColor
                            }}
                        >
                            ({maxRating} {maxRating === 1 ? 'star' : 'stars'})
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

Rating.propTypes = {
    rating: PropTypes.number,
    maxRating: PropTypes.number,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
    showRatingText: PropTypes.bool,
    showRatingNumber: PropTypes.bool,
    interactive: PropTypes.bool,
    onRatingChange: PropTypes.func,
    precision: PropTypes.number,
    className: PropTypes.string,
    starColor: PropTypes.string,
    emptyStarColor: PropTypes.string,
    textColor: PropTypes.string
};

export default Rating;