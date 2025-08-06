import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import { useCommentsStore } from '../../../hooks/Comments/useComments';

function Comments() {
    const { id: userId } = useParams();
    const {
        comments,
        loading,
        error,
        getCommentsByUser,
        clearComments
    } = useCommentsStore();

    useEffect(() => {
        if (userId) {
            getCommentsByUser(userId);
        }
        return () => clearComments();
    }, [userId]);

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Post Title', key: 'post_title' },
        { header: 'Commentor', key: 'viewer_fullname' },
        { header: 'Text', key: 'text' },
        { header: 'Status', key: 'status' },
        { header: 'Created At', key: 'created_at' },
    ];

    if (loading) {
        return <div className={styles.loadingContainer}>Loading comments...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    if (!comments || comments.length === 0) {
        return (
            <div className={styles.noPostsContainer}>
                <h3>Comments</h3>
                <p>No comments found for this user.</p>
            </div>
        );
    }

    return (
        <div className={styles.userPostsSection}>
            <h3 className={styles.sectionTitle}>
                Comments ({comments.length})
            </h3>

            <ReusableTable
                data={comments}
                columns={columns}
                onEdit={(id) => console.log("Edit comments", id)}
                onDelete={(id) => console.log("Delete comments", id)}
                getViewPath={(id) => `/admin/booking-requests/view/${id}`} // Optional
            />
        </div>
    );
}

export default Comments;