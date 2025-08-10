import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import { useRating } from '../../../hooks/Rating/useRating';
import DelModal from '../../Macro/Modals/DelModal';
import Modal from '../../Macro/Modals/Modal';
import EditRatingForm from '../Forms/Rating/EditRatingForm';

function Rating() {
    const { id: userId } = useParams();
    const { rating, loading, error, getRatingsByUser, clearRatings, deleteRating, updateRating } = useRating();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIds, setDeleteIds] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState(null);

    useEffect(() => {
        if (userId) getRatingsByUser(userId);
        return () => clearRatings();
    }, [userId]);

    const handleDelete = async () => {
        try {
            for (const id of deleteIds) {
                await deleteRating(id);
            }
            await getRatingsByUser(userId);
            setDeleteIds([]);
            setDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting rating(s):', err);
        }
    };

    const handleEdit = (id) => {
        const ratingToEdit = rating.find(r => r.id === id);
        setSelectedRating(ratingToEdit);
        setEditModalOpen(true);
    };

    const handleUpdate = async (data) => {
        await updateRating(selectedRating.id, data);
        await getRatingsByUser(userId);
        setEditModalOpen(false);
        setSelectedRating(null);
    };

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Post Title', key: 'post_title' },
        { header: 'Rate Owner', key: 'rater_fullname' },
        { header: 'Rating', key: 'rating' },
        { header: 'Created At', key: 'created_at' },
    ];

    if (loading) return <div className={styles.loadingContainer}>Loading ratings...</div>;
    if (error) return <div className={styles.errorContainer}>Error: {error}</div>;
    if (!rating.length) {
        return (
            <div className={styles.noPostsContainer}>
                <h3>Ratings</h3>
                <p>No ratings found for this user.</p>
            </div>
        );
    }

    return (
        <div className={styles.userPostsSection}>
            <h3 className={styles.sectionTitle}>Ratings ({rating.length})</h3>

            <ReusableTable
                data={rating}
                columns={columns}
                onEdit={handleEdit}
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
                title="Ratingni o'chirish"
                message={
                    deleteIds.length > 1
                        ? `Haqiqatan ham ushbu ${deleteIds.length} ta reytingni o'chirmoqchimisiz?`
                        : "Haqiqatan ham ushbu reytingni o'chirmoqchimisiz?"
                }
                confirmText="O'chirish"
                cancelText="Bekor qilish"
            />

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Rating"
                size="medium"
            >
                {selectedRating && (
                    <EditRatingForm
                        initialData={selectedRating}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
}

export default Rating;
