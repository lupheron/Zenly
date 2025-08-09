import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import { useCommentsStore } from '../../../hooks/Comments/useComments';
import DelModal from '../../Macro/Modals/DelModal';

function Comments() {
    const { id: userId } = useParams();
    const { comments, loading, error, getCommentsByUser, clearComments, deleteComment } = useCommentsStore();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIds, setDeleteIds] = useState([]);

    useEffect(() => {
        if (userId) {
            getCommentsByUser(userId);
        }
        return () => clearComments();
    }, [userId]);

    const handleDelete = async () => {
        try {
            for (const id of deleteIds) {
                await deleteComment(id);
            }
            await getCommentsByUser(userId);
            setDeleteIds([]);
            setDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting comment(s):', err);
        }
    };

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
                onDelete={(ids) => {
                    const selected = Array.isArray(ids) ? ids : [ids];
                    setDeleteIds(selected);
                    setDeleteModalOpen(true);
                }}
                getViewPath={(id) => `/admin/booking-requests/view/${id}`}
            />

            <DelModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeleteIds([]);
                }}
                onConfirm={handleDelete}
                title="Kommentariyani o'chirish"
                message={
                    deleteIds.length > 1
                        ? `Haqiqatan ham ushbu ${deleteIds.length} ta kommentariyani o'chirmoqchimisiz?`
                        : "Haqiqatan ham ushbu kommentariyani o'chirmoqchimisiz?"
                }
                confirmText="O'chirish"
                cancelText="Bekor qilish"
            />
        </div>
    );
}

export default Comments;
