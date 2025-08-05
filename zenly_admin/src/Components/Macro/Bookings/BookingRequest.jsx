// src/pages/Admin/BookingRequest.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import styles from '../../../assets/css/index.module.css';
import { useBookingRequest } from '../../../hooks/Booking/useBookingRequest';

function BookingRequest() {
    const { id: userId } = useParams();
    const {
        bookingRequests,
        loading,
        error,
        getBookingRequestsByUser,
        clearBookingRequests
    } = useBookingRequest();

    useEffect(() => {
        if (userId) {
            getBookingRequestsByUser(userId);
        }
        return () => clearBookingRequests();
    }, [userId]);

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

    if (!bookingRequests || bookingRequests.length === 0) {
        return (
            <div className={styles.noPostsContainer}>
                <h3>Booking Requests</h3>
                <p>No booking requests found for this user.</p>
            </div>
        );
    }

    return (
        <div className={styles.userPostsSection}>
            <h3 className={styles.sectionTitle}>
                Booking Requests ({bookingRequests.length})
            </h3>

            <ReusableTable
                data={bookingRequests}
                columns={columns}
                onEdit={(id) => console.log("Edit booking request", id)}
                onDelete={(id) => console.log("Delete booking request", id)}
                getViewPath={(id) => `/admin/booking-requests/view/${id}`} // Optional
            />
        </div>
    );
}

export default BookingRequest;
