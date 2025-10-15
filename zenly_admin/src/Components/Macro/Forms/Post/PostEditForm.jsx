import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePostByIdHook } from '../../../../hooks/Posts/usePosts';
import FeaturesForm from '../Feature/FeaturesForm';
import GalleryForm from '../Gallery/GalleryForm';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import SelectDefault from '../../../Mircro/FormElements/Select/SelectDefault';
import AlertDefault from '../../../Mircro/Alert/AlertDefault';
import styles from '../../../../assets/css/pages.module.css';

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
        navigate(`/posts/${postId}`);
    };

    if (!postId) return null;
    
    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <div className={styles.loadingText}>Loading post data...</div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.emptyState}>
                    <div className={styles.emptyStateIcon}>⚠️</div>
                    <h2 className={styles.emptyStateTitle}>Error Loading Post</h2>
                    <p className={styles.emptyStateDescription}>
                        {error?.message || 'Post not found'}
                    </p>
                    <button onClick={handleBack} className={styles.primaryButton} style={{ marginTop: '1rem' }}>
                        Back to Post
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
                    <h1 className={styles.pageTitle}>Edit Post</h1>
                    <p className={styles.pageDescription}>
                        Update post information, features, and gallery images
                    </p>
                </div>
                <div className={styles.cardActions}>
                    <button onClick={handleBack} className={styles.secondaryButton}>
                        ← Back to Post
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        className={styles.primaryButton}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '💾 Saving...' : '💾 Save Changes'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: '2rem' }}>
                    {/* Left Column - Post Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className={styles.contentCard}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1.5rem 0', paddingBottom: '0.75rem', borderBottom: '2px solid #f0f0f0' }}>
                                📝 Post Details
                            </h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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

                                <div>
                                    <label style={{ 
                                        display: 'block', 
                                        marginBottom: '0.5rem', 
                                        fontWeight: '500', 
                                        color: '#2c3e50',
                                        fontSize: '0.9375rem'
                                    }}>
                                        Full Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Enter full description"
                                        required
                                        rows={6}
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #dee2e6',
                                            borderRadius: '0.5rem',
                                            fontSize: '1rem',
                                            resize: 'vertical',
                                            fontFamily: 'Quicksand, sans-serif',
                                            lineHeight: '1.5'
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

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <InputDefault
                                        label="Number of Members"
                                        name="members"
                                        type="number"
                                        value={formData.members}
                                        onChange={handleInputChange}
                                        placeholder="Enter capacity"
                                        showLabel={true}
                                    />

                                    <InputDefault
                                        label="Daily Price ($)"
                                        name="price_daily"
                                        type="number"
                                        step="0.01"
                                        value={formData.price_daily}
                                        onChange={handleInputChange}
                                        placeholder="0.00"
                                        showLabel={true}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
                                </div>
                            </div>
                        </div>

                        {/* Main Image Section */}
                        <div className={styles.contentCard}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1.5rem 0', paddingBottom: '0.75rem', borderBottom: '2px solid #f0f0f0' }}>
                                📸 Main Image
                            </h2>
                            
                            {selectedMainImage && (
                                <div style={{ marginBottom: '1rem' }}>
                                    <img 
                                        src={selectedMainImage} 
                                        alt="Current main image" 
                                        style={{
                                            width: '100%',
                                            maxHeight: '300px',
                                            objectFit: 'cover',
                                            borderRadius: '0.5rem',
                                            border: '2px solid #f0f0f0'
                                        }}
                                    />
                                    <p style={{ 
                                        fontSize: '0.875rem', 
                                        color: '#6c757d', 
                                        marginTop: '0.5rem',
                                        textAlign: 'center'
                                    }}>
                                        Current Image
                                    </p>
                                </div>
                            )}
                            
                            <div>
                                <label style={{
                                    display: 'inline-block',
                                    padding: '0.75rem 1.5rem',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    transition: 'transform 0.2s ease'
                                }}>
                                    📁 Choose New Image
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleMainImageSelect}
                                        style={{ display: 'none' }}
                                    />
                                </label>
                                {mainImageFile && (
                                    <p style={{ 
                                        fontSize: '0.875rem', 
                                        color: '#10b981', 
                                        marginTop: '0.75rem',
                                        fontWeight: '500'
                                    }}>
                                        ✓ Selected: {mainImageFile.name}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Features and Gallery */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Features Section */}
                        <div className={styles.contentCard}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1.5rem 0', paddingBottom: '0.75rem', borderBottom: '2px solid #f0f0f0' }}>
                                ✨ Features
                            </h2>
                            <FeaturesForm 
                                postId={postId} 
                                onFeatureChange={handleFeatureChange}
                                key={`features-${refreshTrigger}`}
                            />
                        </div>

                        {/* Gallery Section */}
                        <div className={styles.contentCard}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1.5rem 0', paddingBottom: '0.75rem', borderBottom: '2px solid #f0f0f0' }}>
                                🖼️ Gallery
                            </h2>
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