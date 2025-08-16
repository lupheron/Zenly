import React, { useState, useRef } from 'react';
import { useGalleryByPostId } from '../../../../hooks/Gallery/useGallery';
import Modal from '../../Modals/Modal';
import ButtonDefault from '../../../Mircro/Button/ButtonDefault';
import api from '../../../../hooks/axios';
import styles from '../../../../assets/css/components.module.css';

function GalleryForm({ postId, onGalleryChange }) {
    const { galleryImages, loading, error } = useGalleryByPostId(postId);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);

        const handleDeleteImage = async (imageId) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                const response = await api.delete(`/admin/gallery/${imageId}`);

                if (response.data.status === 200) {
                    // Trigger refresh of gallery
                    if (onGalleryChange) {
                        onGalleryChange();
                    }
                } else {
                    alert('Failed to delete image');
                }
            } catch (error) {
                console.error('Error deleting image:', error);
                alert('Error deleting image');
            }
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            
            setSelectedFile(file);
        }
    };

    const handleAddImage = async () => {
        if (!selectedFile) {
            alert('Please select an image file');
            return;
        }

        if (galleryImages && galleryImages.length >= 5) {
            alert('Maximum 5 images allowed');
            return;
        }

                setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('img', selectedFile);
            formData.append('post_id', postId);
            formData.append('user_id', localStorage.getItem('admin_id'));

            const response = await api.post('/admin/gallery', formData);

            if (response.data.status === 201) {
                setSelectedFile(null);
                setIsAddModalOpen(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                // Trigger refresh of gallery
                if (onGalleryChange) {
                    onGalleryChange();
                }
            } else {
                alert('Failed to add image');
            }
        } catch (error) {
            console.error('Error adding image:', error);
            alert('Error adding image');
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
            
            {/* Gallery Images Grid */}
            <div className={styles.galleryGrid}>
                {galleryImages && galleryImages.length > 0 ? (
                    galleryImages.map((image) => (
                        <div key={image.id} className={styles.galleryItem}>
                            <img 
                                src={image.img} 
                                alt="Gallery" 
                                className={styles.galleryImage}
                            />
                            <button
                                onClick={() => handleDeleteImage(image.id)}
                                className={styles.deleteImageButton}
                                title="Delete image"
                            >
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No images added yet.</p>
                )}
                
                {/* Add Image Button */}
                {canAddMore && (
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className={styles.addImageButton}
                        title="Add new image"
                    >
                        +
                    </button>
                )}
            </div>

            {/* Add Image Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Image"
                size="small"
            >
                <div className={styles.addImageForm}>
                    <div className={styles.fileInputContainer}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className={styles.fileInput}
                        />
                        {selectedFile && (
                            <p className={styles.selectedFile}>
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
            </Modal>
        </div>
    );
}

export default GalleryForm;