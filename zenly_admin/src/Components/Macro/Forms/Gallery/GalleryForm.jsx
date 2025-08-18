import React, { useState, useRef } from 'react';
import { useGalleryByPostId } from '../../../../hooks/Gallery/useGallery';
import ButtonDefault from '../../../Mircro/Button/ButtonDefault';
import DelModal from '../../Modals/DelModal';
import AlertDefault from '../../../Mircro/Alert/AlertDefault';
import api from '../../../../hooks/axios';
import styles from '../../../../assets/css/components.module.css';

function GalleryForm({ postId, onGalleryChange }) {
    const { galleryImages, loading, error, getGalleryByPostId } = useGalleryByPostId(postId);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [imageToDelete, setImageToDelete] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const handleDeleteImage = async (imageId) => {
        const image = galleryImages.find(img => img.id === imageId);
        setImageToDelete(image);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteImage = async () => {
        if (!imageToDelete) return;

        try {
            const response = await api.delete(`/admin/gallery/${imageToDelete.id}`);

            if (response.data.status === 200) {
                AlertDefault.success('Image deleted successfully');
                // Refresh gallery
                await getGalleryByPostId(postId);
                if (onGalleryChange) onGalleryChange();
            } else {
                AlertDefault.error('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            AlertDefault.error('Error deleting image');
        } finally {
            setIsDeleteModalOpen(false);
            setImageToDelete(null);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                AlertDefault.warning('File size must be less than 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                AlertDefault.warning('Please select an image file');
                return;
            }

            setSelectedFile(file);
        }
    };

    const handleAddImage = async () => {
        if (!selectedFile) {
            AlertDefault.warning('Please select an image file');
            return;
        }

        if (galleryImages && galleryImages.length >= 5) {
            AlertDefault.warning('Maximum 5 images allowed');
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('img', selectedFile);
            formData.append('post_id', postId);
            formData.append('user_id', localStorage.getItem('admin_id'));

            const response = await api.post('/admin/gallery', formData);

            if (response.status === 201) {
                AlertDefault.success('Image added successfully');
                setSelectedFile(null);
                setIsAddModalOpen(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                await getGalleryByPostId(postId);
                if (onGalleryChange) onGalleryChange();
            } else {
                AlertDefault.error('Failed to add image');
            }
        } catch (error) {
            console.error('Error adding image:', error);
            AlertDefault.error('Error adding image');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading gallery...</div>;
    }

    if (error) {
        return <div>Error loading gallery: {error.message}</div>;
    }

    const canAddMore = !galleryImages || galleryImages.length < 5;

    return (
        <div className={styles.galleryForm}>
            <h3>Gallery Images ({galleryImages ? galleryImages.length : 0}/5)</h3>

            <div className={styles.galleryFormGrid}>
                {galleryImages && galleryImages.length > 0 ? (
                    galleryImages.map((image) => (
                        <div key={image.id} className={styles.galleryFormItem}>
                            <img
                                src={image.img}
                                alt="Gallery"
                                className={styles.galleryFormImage}
                            />
                            <button
                                onClick={() => handleDeleteImage(image.id)}
                                className={styles.deleteGalleryButton}
                                title="Delete image"
                                type='button'
                            >
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No images added yet.</p>
                )}

                {canAddMore && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className={styles.addGalleryButton}
                        title="Add new image"
                        type='button'
                    >
                        +
                    </button>
                )}
            </div>

            {/* Add Image Modal */}
            {isAddModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        minWidth: '400px'
                    }}>
                        <h3>Add New Image</h3>
                        <div className={styles.addGalleryForm}>
                            <div className={styles.galleryFileInputContainer}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className={styles.galleryFileInput}
                                />
                                {selectedFile && (
                                    <p className={styles.gallerySelectedFile}>
                                        Selected: {selectedFile.name}
                                    </p>
                                )}
                            </div>

                            <div className={styles.modalActions}>
                                <ButtonDefault
                                    onClick={handleAddImage}
                                    disabled={isSubmitting || !selectedFile}
                                    variant="blue"
                                >
                                    {isSubmitting ? 'Adding...' : 'Add Image'}
                                </ButtonDefault>
                                <ButtonDefault
                                    onClick={() => setIsAddModalOpen(false)}
                                    variant="gray"
                                >
                                    Cancel
                                </ButtonDefault>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Image Modal */}
            <DelModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setImageToDelete(null);
                }}
                onConfirm={confirmDeleteImage}
                title="Delete Image"
                message="Are you sure you want to delete this image?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
}

export default GalleryForm;