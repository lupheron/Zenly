import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import { usePostViewsStore } from '../../../hooks/PostViews/usePostViews';
import DelModal from '../../Macro/Modals/DelModal';
import Modal from '../Modals/Modal';
import EditPostViewsForm from '../Forms/PostViews/EditPostViewsForm';

function PostViews() {
    const { id: userId } = useParams();
    const { views, loading, error, getViewsByUser, clearViews, deleteView, updateView } = usePostViewsStore();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIds, setDeleteIds] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedView, setSelectedView] = useState(null);

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

    const handleEdit = (id) => {
        const viewToEdit = views.find(v => v.id === id);
        setSelectedView(viewToEdit);
        setEditModalOpen(true);
    };

    const handleUpdate = async (data) => {
        await updateView(selectedView.id, data);
        await getViewsByUser(userId);
        setEditModalOpen(false);
        setSelectedView(null);
    };

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Post Title', key: 'post_title' },
        { header: 'Viewer', key: 'viewer_fullname' },
        { header: 'Clicked', key: 'clicked' },
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
                onEdit={handleEdit}
                onDelete={(ids) => {
                    const selected = Array.isArray(ids) ? ids : [ids];
                    setDeleteIds(selected);
                    setDeleteModalOpen(true);
                }}
                getViewPath={(id) => `/admin/post-views/view/${id}`}
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

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit View"
                size="medium"
            >
                {selectedView && (
                    <EditPostViewsForm
                        initialData={selectedView}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
}

export default PostViews;
