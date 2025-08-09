import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import { usePostViewsStore } from '../../../hooks/PostViews/usePostViews';
import DelModal from '../../Macro/Modals/DelModal';

function PostViews() {
    const { id: userId } = useParams();
    const { views, loading, error, getViewsByUser, clearViews, deleteView } = usePostViewsStore();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIds, setDeleteIds] = useState([]);

    useEffect(() => {
        if (userId) {
            getViewsByUser(userId);
        }
        return () => clearViews();
    }, [userId]);

    const handleDelete = async () => {
        try {
            for (const id of deleteIds) {
                await deleteView(id);
            }
            await getViewsByUser(userId);
            setDeleteIds([]);
            setDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting view(s):', err);
        }
    };

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
                onDelete={(ids) => {
                    const selected = Array.isArray(ids) ? ids : [ids];
                    setDeleteIds(selected);
                    setDeleteModalOpen(true);
                }}
                getViewPath={(id) => `/admin/booking-requests/view/${id}`}
            />

            {/* Delete Modal */}
            <DelModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeleteIds([]);
                }}
                onConfirm={handleDelete}
                title="Ko'rish yozuvini o'chirish"
                message={
                    deleteIds.length > 1
                        ? `Haqiqatan ham ushbu ${deleteIds.length} ta yozuvni o'chirmoqchimisiz?`
                        : "Haqiqatan ham ushbu yozuvni o'chirmoqchimisiz?"
                }
                confirmText="O'chirish"
                cancelText="Bekor qilish"
            />
        </div>
    );
}

export default PostViews;
