import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLoginStore from '../../../hooks/Auth/useLogin';
import { useUserByIdStore } from '../../../hooks/Users/useUserById';
import styles from '../../../assets/css/index.module.css';
import ButtonDefault from '../../../Components/Mircro/Button/ButtonDefault';
import DelModal from '../../../Components/Macro/Modals/DelModal';
import Modal from '../../../Components/Macro/Modals/Modal';
import EditUserForm from '../../../Components/Macro/Forms/Users/EditUserForm';
import UsersPosts from '../../../Components/Macro/Posts/UsersPosts';
import SelectSection from '../../../Components/Mircro/SelectSection/SelectSection';
import BookingRequest from '../../../Components/Macro/Bookings/BookingRequest';

function DetailedUser() {
    const [activeTab, setActiveTab] = useState('posts');
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser, logout, loading } = useLoginStore();
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

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleBack = () => {
        navigate('/dashboard');
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
            // Show success message or refresh data
            alert('User updated successfully!');
        } catch (error) {
            console.error('Update failed:', error);
            alert('Failed to update user. Please try again.');
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

        console.log('getImageUrl called with:', imagePath);

        // If it's already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath;
        }

        // If the path starts with 'uploads/', use the /files/ route
        if (imagePath.startsWith('uploads/')) {
            const pathWithoutUploads = imagePath.replace('uploads/', '');
            const fullUrl = `${baseUrl}/files/${pathWithoutUploads}`;
            console.log('Image URL:', fullUrl, 'Original path:', imagePath);
            return fullUrl;
        }

        // Otherwise, assume it's just the filename and construct the path
        const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
        const fullUrl = `${baseUrl}/files/${cleanPath}`;
        console.log('Image URL:', fullUrl, 'Original path:', imagePath);
        return fullUrl;
    };

    // Function to handle image error
    const handleImageError = (e) => {
        console.log('Image failed to load:', e.target.src);
        setImageError(true);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                Loading...
            </div>
        );
    }

    if (loadingUser) {
        return (
            <div className={styles.loadingContainer}>
                Loading user data...
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.dashboardContainer}>
                <div className={styles.mainContent}>
                    <div className={styles.header}>
                        <h1 className={styles.dashboardTitle}>User Details</h1>
                        <button
                            onClick={handleLogout}
                            className={styles.logoutButton}
                        >
                            Logout
                        </button>
                    </div>
                    <div className={styles.errorContainer}>
                        Error: {error}
                    </div>
                    <button
                        onClick={handleBack}
                        className={styles.backButton}
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={styles.dashboardTitle}>User Details</h1>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutButton}
                    >
                        Logout
                    </button>
                </div>

                {currentUser && (
                    <div className={styles.userInfo}>
                        <h2 className={styles.userWelcome}>
                            Welcome, {currentUser.name} {currentUser.surename}!
                        </h2>
                    </div>
                )}

                {userData ? (
                    <div className={styles.userDetailsContainer}>
                        {console.log('User data:', userData)}
                        {console.log('User image path:', userData.img)}
                        <h2 className={styles.userDetailsTitle}>
                            User Information
                        </h2>

                        {/* Profile Image Section */}
                        <div className={styles.profileSection}>
                            <div className={styles.profileImageContainer}>
                                {userData.img && !imageError ? (
                                    <img
                                        src={getImageUrl(userData.img)}
                                        alt={`${userData.fullname}'s profile`}
                                        className={styles.profileImage}
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <div className={styles.profileAvatar}>
                                        {userData.fullname ? userData.fullname.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            <div className={styles.profileInfo}>
                                <h3 className={styles.profileName}>
                                    {userData.fullname}
                                </h3>
                                <p className={styles.profileDetail}>
                                    <strong>Username:</strong> {userData.username}
                                </p>
                                <p className={styles.profileDetail}>
                                    <strong>User ID:</strong> {userData.id}
                                </p>
                            </div>
                        </div>

                        {/* User Details Grid */}
                        <div className={styles.userDetailsGrid}>
                            {/* Contact Information */}
                            <div className={styles.infoCard}>
                                <h4 className={styles.infoCardTitle}>Contact Information</h4>
                                <p className={styles.infoCardText}>
                                    <strong>Phone:</strong> {userData.phone || 'Not provided'}
                                </p>
                                <p className={styles.infoCardText}>
                                    <strong>Address:</strong> {userData.address || 'Not provided'}
                                </p>
                            </div>

                            {/* Account Status */}
                            <div className={styles.infoCard}>
                                <h4 className={styles.infoCardTitle}>Account Status</h4>
                                <p className={styles.infoCardText}>
                                    <strong>User Type:</strong>
                                    <span className={userData.type === 'admin' ? styles.statusAdmin : styles.statusUser}>
                                        {userData.type === 1 ? 'Client' : 'User'}
                                    </span>
                                </p>
                                <p className={styles.infoCardText}>
                                    <strong>VIP Status:</strong>
                                    <span className={userData.vip_status ? styles.statusVip : styles.statusRegular}>
                                        {userData.vip_status}
                                    </span>
                                </p>
                                <p className={styles.infoCardText}>
                                    <strong>Account Status:</strong>
                                    <span className={userData.deleted_at ? styles.statusDeleted : styles.statusActive}>
                                        {userData.deleted_at ? 'Deleted' : 'Active'}
                                    </span>
                                </p>
                            </div>

                            {/* Timestamps */}
                            <div className={styles.infoCard}>
                                <h4 className={styles.infoCardTitle}>Account Timestamps</h4>
                                <p className={styles.infoCardText}>
                                    <strong>Created:</strong> {formatDate(userData.created_at)}
                                </p>
                                <p className={styles.infoCardText}>
                                    <strong>Last Updated:</strong> {formatDate(userData.updated_at)}
                                </p>
                                {userData.deleted_at && (
                                    <p className={styles.infoCardText}>
                                        <strong>Deleted:</strong> {formatDate(userData.deleted_at)}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className={styles.infoCard}>
                            <h4 className={styles.infoCardTitle}>Additional Information</h4>
                            <p className={styles.infoCardText}>
                                <strong>Remember Token:</strong> {userData.remember_token ? 'Set' : 'Not set'}
                            </p>
                        </div>
                        <div>
                            <h2>Foydalanuvchiga tegishli aktivlar :</h2>
                            <SelectSection activeTab={activeTab} setActiveTab={setActiveTab} />

                            {/* 🔽 Conditionally render based on tab */}
                            {activeTab === 'posts' && <UsersPosts />}
                            {activeTab === 'orders' && <BookingRequest />}
                        </div>
                    </div>
                ) : (
                    <div className={styles.noDataContainer}>
                        <p className={styles.noDataText}>
                            No user data available.
                        </p>
                    </div>
                )}

                <div className={styles.userDetailedButtons}>
                    <ButtonDefault
                        onClick={handleBack}
                        children={"Back to Dashboard"}
                    />

                    <ButtonDefault
                        children={"Foydalanuvchini tahrirlash"}
                        variant={"yellow"}
                        onClick={handleEditClick}
                    />

                    <ButtonDefault
                        children={"Foydalanuvchini o'chirish"}
                        variant={"red"}
                        onClick={handleDeleteClick}
                    />
                </div>

                {/* Delete Confirmation Modal */}
                <DelModal
                    isOpen={showDeleteModal}
                    onClose={handleDeleteCancel}
                    onConfirm={handleDeleteConfirm}
                    title="Delete User"
                    message={`Are you sure you want to delete ${userData?.fullname || 'this user'}?`}
                    confirmText="Delete User"
                    cancelText="Cancel"
                />

                {/* Edit User Modal */}
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
        </div>
    );
}

export default DetailedUser;