import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import { usePostViewsStore } from '../../../hooks/PostViews/usePostViews';

function PostViews() {
    const { id: userId } = useParams();
    const {
        views,
        loading,
        error,
        getViewsByUser,
        clearViews
    } = usePostViewsStore();

    useEffect(() => {
        if (userId) {
            getViewsByUser(userId);
        }
        return () => clearViews();
    }, [userId]);

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Post Title', key: 'post_title' },
        { header: 'Rate Owner', key: 'viewer_fullname' },
        { header: 'View', key: 'clicked' },
        { header: 'Created At', key: 'created_at' },
    ];

    if (loading) {
        return <div className={styles.loadingContainer}>Loading views...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    if (!views || views.length === 0) {
        return (
            <div className={styles.noPostsContainer}>
                <h3>Views</h3>
                <p>No views found for this user.</p>
            </div>
        );
    }

    return (
        <div className={styles.userPostsSection}>
            <h3 className={styles.sectionTitle}>
                Views ({views.length})
            </h3>

            <ReusableTable
                data={views}
                columns={columns}
                onEdit={(id) => console.log("Edit views", id)}
                onDelete={(id) => console.log("Delete views", id)}
                getViewPath={(id) => `/admin/booking-requests/view/${id}`} // Optional
            />
        </div>
    );
}

export default PostViews;