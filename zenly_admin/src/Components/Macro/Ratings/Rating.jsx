import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import { useRating } from '../../../hooks/Rating/useRating';

function Rating() {
    const { id: userId } = useParams();
    const {
        rating,
        loading,
        error,
        getRatingsByUser,
        clearRatings
    } = useRating();

    useEffect(() => {
        if (userId) {
            getRatingsByUser(userId);
        }
        return () => clearRatings();
    }, [userId]);

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Post Title', key: 'post_title' },
        { header: 'Rate Owner', key: 'rater_fullname' },
        { header: 'Rating', key: 'rating' },
        { header: 'Created At', key: 'created_at' },
    ];

    if (loading) {
        return <div className={styles.loadingContainer}>Loading ratings...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    if (!rating || rating.length === 0) {
        return (
            <div className={styles.noPostsContainer}>
                <h3>Ratings</h3>
                <p>No ratings found for this user.</p>
            </div>
        );
    }

    return (
        <div className={styles.userPostsSection}>
            <h3 className={styles.sectionTitle}>
                Ratings ({rating.length})
            </h3>

            <ReusableTable
                data={rating}
                columns={columns}
                onEdit={(id) => console.log("Edit rating", id)}
                onDelete={(id) => console.log("Delete rating", id)}
                getViewPath={(id) => `/admin/booking-requests/view/${id}`} // Optional
            />
        </div>
    );
}

export default Rating;