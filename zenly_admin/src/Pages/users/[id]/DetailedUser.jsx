import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserByIdStore } from '../../../hooks/Users/useUserById';
import styles from '../../../assets/css/pages.module.css';
import ButtonDefault from '../../../Components/Mircro/Button/ButtonDefault';
import DelModal from '../../../Components/Macro/Modals/DelModal';
import Modal from '../../../Components/Macro/Modals/Modal';
import EditUserForm from '../../../Components/Macro/Forms/Users/EditUserForm';
import UsersPosts from '../../../Components/Macro/Posts/UsersPosts';
import SelectSection from '../../../Components/Mircro/SelectSection/SelectSection';
import BookingRequest from '../../../Components/Macro/Bookings/BookingRequest';
import Rating from '../../../Components/Macro/Ratings/Rating';
import PostViews from '../../../Components/Macro/PostViews/PostViews';
import Comments from '../../../Components/Macro/Comments/Comment';

function DetailedUser() {
    const [activeTab, setActiveTab] = useState('posts');
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: userData, loading: loadingUser, error, getUserById, clearUser, deleteUser, updateUser, updateLoading } = useUserByIdStore();
    const [imageError, setImageError] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        if (id) {
            getUserById(id);
        }

        return () => {
            clearUser();
        };
    }, [id, getUserById, clearUser]);

    const handleBack = () => {
        navigate('/users');
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        if (userData) {
            deleteUser(userData.id);
            setShowDeleteModal(false);
            navigate('/dashboard');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const handleEditClick = () => {
        setShowEditModal(true);
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
    };

    const handleEditSubmit = async (formData) => {
        try {
            await updateUser(userData.id, formData);
            setShowEditModal(false);

            // Refresh user data after successful update
            await getUserById(userData.id);

            // Show success message
            alert('User updated successfully!');

        } catch (error) {
            console.error('Update failed:', error);

            // Show more detailed error message
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update user. Please try again.';
            alert(`Update failed: ${errorMessage}`);
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not available';
        return new Date(dateString).toLocaleString();
    };

    // Function to get image URL
    const getImageUrl = (imagePath) => {
        if (!imagePath) return null;
        const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';

        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // If the path starts with 'uploads/', use the /files/ route
        if (imagePath.startsWith('uploads/')) {
            const pathWithoutUploads = imagePath.replace('uploads/', '');
            const fullUrl = `${baseUrl}/files/${pathWithoutUploads}`;
            return fullUrl;
        }

        // Otherwise, assume it's just the filename and construct the path
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        const fullUrl = `${baseUrl}/files/${cleanPath}`;
        return fullUrl;
    };

    // Function to handle image error
    const handleImageError = (e) => {
        setImageError(true);
    };

    if (loadingUser) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <div className={styles.loadingText}>Loading user data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>⚠️</div>
                    <h2 className={styles.emptyStateTitle}>Error Loading User</h2>
                    <p className={styles.emptyStateDescription}>{error}</p>
                    <button onClick={handleBack} className={styles.primaryButton} style={{ marginTop: '1rem' }}>
                        Back to Users
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>User Details</h1>
                    <p className={styles.pageDescription}>
                        View and manage user information and activities
                    </p>
                </div>
                <div className={styles.cardActions}>
                    <button onClick={handleBack} className={styles.secondaryButton}>
                        ← Back to Users
                    </button>
                    <button onClick={handleEditClick} className={styles.primaryButton}>
                        ✏️ Edit User
                    </button>
                    <button onClick={handleDeleteClick} className={styles.dangerButton}>
                        🗑️ Delete User
                    </button>
                </div>
            </div>

            {userData ? (
                <>
                    {/* Profile Card */}
                    <div className={styles.contentCard} style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                            {/* Profile Image */}
                            <div style={{ flexShrink: 0 }}>
                                {userData.img && !imageError ? (
                                    <img
                                        src={getImageUrl(userData.img)}
                                        alt={`${userData.fullname}'s profile`}
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            border: '4px solid #f0f0f0'
                                        }}
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '3rem',
                                        fontWeight: '700'
                                    }}>
                                        {userData.fullname ? userData.fullname.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            
                            {/* Profile Info */}
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#2c3e50', margin: '0 0 0.5rem 0' }}>
                                    {userData.fullname}
                                </h2>
                                <p style={{ fontSize: '1rem', color: '#6c757d', margin: '0 0 1rem 0' }}>
                                    @{userData.username} • ID: {userData.id}
                                </p>
                                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        background: userData.deleted_at ? '#fee' : '#e8f5e9',
                                        color: userData.deleted_at ? '#c62828' : '#2e7d32'
                                    }}>
                                        {userData.deleted_at ? '❌ Deleted' : '✅ Active'}
                                    </span>
                                    <span style={{
                                        padding: '0.375rem 0.75rem',
                                        borderRadius: '0.375rem',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        background: '#e3f2fd',
                                        color: '#1565c0'
                                    }}>
                                        {userData.type === 1 ? '👤 Client' : '👤 User'}
                                    </span>
                                    {userData.vip_status && (
                                        <span style={{
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '0.375rem',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
                                            color: '#b8860b'
                                        }}>
                                            ⭐ {userData.vip_status}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                        {/* Contact Information */}
                        <div className={styles.contentCard}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1rem 0', paddingBottom: '0.75rem', borderBottom: '2px solid #f0f0f0' }}>
                                📞 Contact Information
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: '0.25rem' }}>Phone</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '500', color: '#2c3e50' }}>
                                        {userData.phone || 'Not provided'}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: '0.25rem' }}>Address</div>
                                    <div style={{ fontSize: '1rem', fontWeight: '500', color: '#2c3e50' }}>
                                        {userData.address || 'Not provided'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Timestamps */}
                        <div className={styles.contentCard}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1rem 0', paddingBottom: '0.75rem', borderBottom: '2px solid #f0f0f0' }}>
                                📅 Account Timestamps
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: '0.25rem' }}>Created</div>
                                    <div style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#2c3e50' }}>
                                        {formatDate(userData.created_at)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: '0.25rem' }}>Last Updated</div>
                                    <div style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#2c3e50' }}>
                                        {formatDate(userData.updated_at)}
                                    </div>
                                </div>
                                {userData.deleted_at && (
                                    <div>
                                        <div style={{ fontSize: '0.8125rem', color: '#6c757d', marginBottom: '0.25rem' }}>Deleted</div>
                                        <div style={{ fontSize: '0.9375rem', fontWeight: '500', color: '#c62828' }}>
                                            {formatDate(userData.deleted_at)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* User Activities */}
                    <div className={styles.contentCard}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1.5rem 0' }}>
                            User Activities & Assets
                        </h3>
                        <SelectSection activeTab={activeTab} setActiveTab={setActiveTab} />
                        <div style={{ marginTop: '1.5rem' }}>
                            {activeTab === 'posts' && <UsersPosts />}
                            {activeTab === 'orders' && <BookingRequest />}
                            {activeTab === 'ratings' && <Rating />}
                            {activeTab === 'views' && <PostViews />}
                            {activeTab === 'comments' && <Comments />}
                        </div>
                    </div>
                </>
            ) : (
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>👤</div>
                    <h2 className={styles.emptyStateTitle}>No User Data</h2>
                    <p className={styles.emptyStateDescription}>
                        The requested user information could not be found.
                    </p>
                </div>
            )}

            {/* Modals */}
            <DelModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete User"
                message={`Are you sure you want to delete ${userData?.fullname || 'this user'}? This action cannot be undone.`}
                confirmText="Delete User"
                cancelText="Cancel"
            />

            <Modal
                isOpen={showEditModal}
                onClose={handleEditCancel}
                title="Edit User"
                size="large"
                closeOnOverlayClick={false}
            >
                <EditUserForm
                    userData={userData}
                    onSubmit={handleEditSubmit}
                    onCancel={handleEditCancel}
                    loading={updateLoading}
                />
            </Modal>
        </div>
    );
}

export default DetailedUser;