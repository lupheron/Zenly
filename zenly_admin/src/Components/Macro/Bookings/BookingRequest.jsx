// src/pages/Admin/BookingRequest.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import styles from '../../../assets/css/index.module.css';
import { useBookingRequest } from '../../../hooks/Booking/useBookingRequest';
import DelModal from '../../Macro/Modals/DelModal';
import Modal from '../Modals/Modal';
import BookingEditForm from '../Forms/Booking/BookingEditForm';

function BookingRequest() {
    const { id: userId } = useParams();
    const {
        bookingRequests,
        loading,
        error,
        getBookingRequestsByUser,
        clearBookingRequests,
        deleteBookingRequest,
        updateBookingRequest // Make sure this is in your zustand hook
    } = useBookingRequest();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIds, setDeleteIds] = useState([]);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (userId) {
            getBookingRequestsByUser(userId);
        }
        return () => clearBookingRequests();
    }, [userId]);

    const handleDelete = async () => {
        try {
            for (const id of deleteIds) {
                await deleteBookingRequest(id);
            }
            await getBookingRequestsByUser(userId);
            setDeleteIds([]);
            setDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting booking request(s):', err);
        }
    };

    const handleEdit = (id) => {
        const booking = bookingRequests.find(b => b.id === id);
        if (booking) {
            setSelectedBooking(booking);
            setEditModalOpen(true);
        }
    };

    const handleUpdate = async (data) => {
        try {
            setSaving(true);
            await updateBookingRequest(selectedBooking.id, data);
            await getBookingRequestsByUser(userId);
            setEditModalOpen(false);
        } catch (err) {
            console.error("Error updating booking:", err);
        } finally {
            setSaving(false);
        }
    };

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'Post Title', key: 'post_title' },
        { header: 'Post Owner', key: 'post_owner_fullname' },
        { header: 'Requester Name', key: 'requester_fullname' },
        { header: 'Phone', key: 'requester_phone' },
        { header: 'Send Date', key: 'send_date' },
        { header: 'Status', key: 'status' }
    ];

    if (loading) {
        return <div className={styles.loadingContainer}>Loading booking requests...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>Error: {error}</div>;
    }

    return (
        <div className={styles.userPostsSection}>
            <h3 className={styles.sectionTitle}>
                Booking Requests ({bookingRequests.length})
            </h3>

            <ReusableTable
                data={bookingRequests}
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
                title="Booking so'rovini o'chirish"
                message={
                    deleteIds.length > 1
                        ? `Haqiqatan ham ushbu ${deleteIds.length} ta booking so'rovini o'chirmoqchimisiz?`
                        : "Haqiqatan ham ushbu booking so'rovini o'chirmoqchimisiz?"
                }
                confirmText="O'chirish"
                cancelText="Bekor qilish"
            />

            {/* Edit Modal */}
            <Modal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                title="Edit Booking Request"
                size="medium"
            >
                {selectedBooking && (
                    <BookingEditForm
                        initialData={selectedBooking}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditModalOpen(false)}
                        loading={saving}
                    />
                )}
            </Modal>
        </div>
    );
}


export default BookingRequest;
