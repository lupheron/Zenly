import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePostByIdHook } from '../../../../hooks/Posts/usePosts';
import FeaturesForm from '../Feature/FeaturesForm';
import GalleryForm from '../Gallery/GalleryForm';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import SelectDefault from '../../../Mircro/FormElements/Select/SelectDefault';
import ButtonDefault from '../../../Mircro/Button/ButtonDefault';
import Modal from '../../Modals/Modal';
import AlertDefault from '../../../Mircro/Alert/AlertDefault';
import styles from '../../../../assets/css/components.module.css';

function PostEditForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const postId = Number(id) || 0;
    
    const { post, loading, error, getPostById, updatePost } = usePostByIdHook(postId);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        small_description: '',
        description: '',
        location: '',
        members: '',
        price_daily: '',
        area_id: '',
        status: '1'
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [selectedMainImage, setSelectedMainImage] = useState(null);
    const [mainImageFile, setMainImageFile] = useState(null);
    const fileInputRef = useRef(null);

    // Area types for the select dropdown
    const areaTypes = [
        { value: '1', label: 'Plyajdagi dam olish' },
        { value: '2', label: 'Wellness maskanlari' },
        { value: '3', label: 'Kabina zonalari' },
        { value: '4', label: 'Eko sayohatlar' }
    ];

    // Status options
    const statusOptions = [
        { value: '1', label: 'Active' },
        { value: '0', label: 'Inactive' }
    ];

    // Load post data when component mounts or post changes
    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                small_description: post.small_description || '',
                description: post.description || '',
                location: post.location || '',
                members: post.members || '',
                price_daily: post.price_daily || '',
                area_id: post.area_id ? post.area_id.toString() : '',
                status: post.status ? post.status.toString() : '1'
            });
            setSelectedMainImage(post.img);
        }
    }, [post]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle main image selection
    const handleMainImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                AlertDefault.warning('File size must be less than 5MB');
                return;
            }
            
            // Check file type
            if (!file.type.startsWith('image/')) {
                AlertDefault.warning('Please select an image file');
                return;
            }
            
            setMainImageFile(file);
            
            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedMainImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Convert file to base64 for API
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const base64 = reader.result.split(',')[1]; // Remove data:image/...;base64, prefix
                resolve(base64);
            };
            reader.onerror = error => reject(error);
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.title || !formData.description || !formData.location) {
            AlertDefault.warning('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            let postData = {
                ...formData,
                area_id: parseInt(formData.area_id),
                members: parseInt(formData.members),
                price_daily: parseFloat(formData.price_daily),
                status: parseInt(formData.status)
            };

            // Add main image if selected
            if (mainImageFile) {
                const base64Image = await fileToBase64(mainImageFile);
                postData.img = base64Image;
            }

            await updatePost(postData);
            AlertDefault.success('Post updated successfully!');
            
            // Reset image states
            setMainImageFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error updating post:', error);
            AlertDefault.error(`Failed to update post: ${error.message || 'Unknown error'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle feature changes
    const handleFeatureChange = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Handle gallery changes
    const handleGalleryChange = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/dashboard');
    };

    if (!postId) return null;
    
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Loading post data...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className={styles.errorContainer}>
                <p>Error loading post: {error?.message || 'Post not found'}</p>
                <ButtonDefault onClick={handleBack}>
                    Back to Dashboard
                </ButtonDefault>
            </div>
        );
    }

    return (
        <div className={styles.postEditForm}>
            <div className={styles.formHeader}>
                <h1>Edit Post</h1>
                <ButtonDefault onClick={handleBack} variant="gray">
                    Back to Dashboard
                </ButtonDefault>
            </div>

            <form onSubmit={handleSubmit} className={styles.editForm}>
                <div className={styles.formGrid}>
                    {/* Left Column - Post Details */}
                    <div className={styles.formColumn}>
                        <h2>Post Details</h2>
                        
                        <InputDefault
                            label="Title *"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Enter post title"
                            showLabel={true}
                            required={true}
                        />

                        <InputDefault
                            label="Small Description *"
                            name="small_description"
                            value={formData.small_description}
                            onChange={handleInputChange}
                            placeholder="Enter short description"
                            showLabel={true}
                            required={true}
                        />

                        <div className={styles.textareaContainer}>
                            <label className={styles.inputLabel}>
                                Full Description *
                                <span style={{ color: '#dc3545' }}> *</span>
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Enter full description"
                                required
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>

                        <InputDefault
                            label="Location *"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter location"
                            showLabel={true}
                            required={true}
                        />

                        <InputDefault
                            label="Number of Members"
                            name="members"
                            type="number"
                            value={formData.members}
                            onChange={handleInputChange}
                            placeholder="Enter number of members"
                            showLabel={true}
                        />

                        <InputDefault
                            label="Daily Price"
                            name="price_daily"
                            type="number"
                            step="0.01"
                            value={formData.price_daily}
                            onChange={handleInputChange}
                            placeholder="Enter daily price"
                            showLabel={true}
                        />

                        <SelectDefault
                            label="Area Type"
                            name="area_id"
                            value={formData.area_id}
                            onChange={handleInputChange}
                            options={areaTypes}
                            placeholder="Select area type"
                            showLabel={true}
                        />

                        <SelectDefault
                            label="Status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            options={statusOptions}
                            placeholder="Select status"
                            showLabel={true}
                        />

                        {/* Main Image Section */}
                        <div className={styles.mainImageSection}>
                            <label className={styles.inputLabel}>
                                Main Image
                            </label>
                            <div className={styles.mainImageContainer}>
                                {selectedMainImage && (
                                    <div className={styles.currentImage}>
                                        <img 
                                            src={selectedMainImage} 
                                            alt="Current main image" 
                                            className={styles.mainImagePreview}
                                        />
                                        <span className={styles.currentImageLabel}>Current Image</span>
                                    </div>
                                )}
                                <div className={styles.imageUploadSection}>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMainImageSelect}
                                        className={styles.imageFileInput}
                                    />
                                    {mainImageFile && (
                                        <p className={styles.selectedImageFile}>
                                            Selected: {mainImageFile.name}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.formActions}>
                            <ButtonDefault
                                type="submit"
                                disabled={isSubmitting}
                                variant="blue"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Post'}
                            </ButtonDefault>
                        </div>
                    </div>

                    {/* Right Column - Features and Gallery */}
                    <div className={styles.formColumn}>
                        <h2>Post Components</h2>
                        
                        {/* Features Section */}
                        <div className={styles.componentSection}>
                            <FeaturesForm 
                                postId={postId} 
                                onFeatureChange={handleFeatureChange}
                                key={`features-${refreshTrigger}`}
                            />
                        </div>

                        {/* Gallery Section */}
                        <div className={styles.componentSection}>
                            <GalleryForm 
                                postId={postId} 
                                onGalleryChange={handleGalleryChange}
                                key={`gallery-${refreshTrigger}`}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default PostEditForm;