import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../../../assets/css/pages.module.css';
import { usePostByIdHook } from '../../../../hooks/Posts/usePosts';
import Features from '../../../Mircro/Features/Features';
import Gallery from '../../../Mircro/Gallery/Gallery';
import Rating from '../../../Mircro/Rating/Rating';
import DelModal from '../../Modals/DelModal';
import Modal from '../../Modals/Modal';
import SwiperDefault from '../../../Mircro/Swiper/SwiperDefault';

const DetailedPosts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [openCommentModal, setOpenCommentModal] = useState(false);

    const postId = Number(id) || 0;

    const banners = [
        { id: 1, title: 'Plyajdagi dam olish' },
        { id: 2, title: 'Wellness maskanlari' },
        { id: 3, title: 'Kabina zonalari' },
        { id: 4, title: 'Eko sayohatlar' },
    ];

    const { post, loading, error, deletePost } = usePostByIdHook(postId);

    // Use comments from post data instead of separate API call
    const comments = post?.comments || [];
    const commentsLoading = loading;

    console.log('Post data:', post); // Debug log
    console.log('Comments from post:', comments); // Debug log

    const handleDelete = async () => {
        try {
            await deletePost();
            setDeleteModalOpen(false);
            navigate('/dashboard');
        } catch (error) {
            console.error('Delete error:', error);
            alert("O'chirishda xatolik yuz berdi.");
        }
    };

    const handleBack = () => {
        navigate('/posts');
    };

    if (!postId) return null;
    
    if (loading) return (
        <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <div className={styles.loadingText}>Loading post data...</div>
        </div>
    );

    if (error || !post) return (
        <div className={styles.pageContainer}>
            <div className={styles.emptyState}>
                <div className={styles.emptyStateIcon}>⚠️</div>
                <h2 className={styles.emptyStateTitle}>Error Loading Post</h2>
                <p className={styles.emptyStateDescription}>
                    {error || 'Post not found'}
                </p>
                <button onClick={handleBack} className={styles.primaryButton} style={{ marginTop: '1rem' }}>
                    Back to Posts
                </button>
            </div>
        </div>
    );

    const areaTitle = banners.find(b => b.id === post.area_id)?.title ?? 'Nomaʼlum tur';

    return (
        <div className={styles.pageContainer}>
            {/* Page Header */}
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>{post.title}</h1>
                    <p className={styles.pageDescription}>
                        {post.small_description}
                    </p>
                </div>
                <div className={styles.cardActions}>
                    <button onClick={handleBack} className={styles.secondaryButton}>
                        ← Back to Posts
                    </button>
                    <button onClick={() => navigate(`/posts/${post.id}/edit`)} className={styles.primaryButton}>
                        ✏️ Edit Post
                    </button>
                    <button onClick={() => setDeleteModalOpen(true)} className={styles.dangerButton}>
                        🗑️ Delete Post
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                {/* Gallery Section */}
                <div className={styles.contentCard}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1.5rem 0' }}>
                        📸 Gallery
                    </h2>
                    <Gallery postId={post.id} mainImg={post.img} />
                </div>

                {/* Post Information */}
                <div className={styles.contentCard}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1.5rem 0' }}>
                        📋 Post Information
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Rating</span>
                            <Rating
                                rating={post.avg_rating || 0}
                                size="small"
                                showRatingNumber={true}
                                showRatingText={false}
                            />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Price (Daily)</span>
                            <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '1.125rem' }}>${post.price_daily}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Location</span>
                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>{post.location}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Capacity</span>
                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>{post.members} people</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Property Type</span>
                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>{areaTitle}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f8f9fa', borderRadius: '0.5rem' }}>
                            <span style={{ fontWeight: '500', color: '#6c757d' }}>Views</span>
                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>{post.view_count}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Description */}
            <div className={styles.contentCard} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1rem 0' }}>
                    📝 Description
                </h2>
                <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#495057', margin: 0 }}>
                    {post.description}
                </p>
            </div>

            {/* Features Section */}
            <div className={styles.contentCard} style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: '0 0 1.5rem 0' }}>
                    ✨ Available Features
                </h2>
                <Features postId={post.id} />
            </div>

            {/* Comments Section */}
            <div className={styles.contentCard}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#2c3e50', margin: 0 }}>
                        💬 Comments ({comments.length})
                    </h2>
                    <button 
                        onClick={() => setOpenCommentModal(true)} 
                        className={styles.primaryButton}
                    >
                        View All Comments
                    </button>
                </div>
                {comments.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {comments.slice(0, 3).map((comment, index) => (
                            <div key={comment.id || index} style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '0.5rem', borderLeft: '4px solid #667eea' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '600', color: '#2c3e50' }}>{comment.name}</span>
                                    <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}
                                    </span>
                                </div>
                                <p style={{ margin: 0, color: '#495057' }}>{comment.text}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ color: '#6c757d', textAlign: 'center', padding: '2rem' }}>
                        No comments yet
                    </p>
                )}
            </div>


            {/* Modals */}
            <DelModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Post"
                message="Are you sure you want to delete this post? This action cannot be undone."
                confirmText="Delete Post"
                cancelText="Cancel"
            />

            <Modal
                isOpen={openCommentModal}
                onClose={() => setOpenCommentModal(false)}
                title="User Comments"
                size="large"
            >
                <div style={{ padding: '1rem' }}>
                    {commentsLoading ? (
                        <div style={{ textAlign: 'center', padding: '2rem' }}>
                            <div className={styles.loadingSpinner}></div>
                            <p>Loading comments...</p>
                        </div>
                    ) : Array.isArray(comments) && comments.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {comments.map((comment, index) => (
                                <div key={comment.id || index} style={{ 
                                    padding: '1.5rem', 
                                    background: '#f8f9fa', 
                                    borderRadius: '0.75rem',
                                    borderLeft: '4px solid #667eea'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                        <h4 style={{ margin: 0, fontWeight: '600', color: '#2c3e50' }}>{comment.name}</h4>
                                        <span style={{ fontSize: '0.875rem', color: '#6c757d' }}>
                                            {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, lineHeight: '1.6', color: '#495057' }}>{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                            <p>No comments yet</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default DetailedPosts;