import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../../../assets/css/index.module.css';
import { usePostByIdHook } from '../../../../hooks/Posts/usePosts';
import Features from '../../../Mircro/Features/Features';
import ButtonDefault from '../../../Mircro/Button/ButtonDefault';
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
        navigate('/dashboard');
    };

    if (!postId) return null;
    if (loading) return (
        <div className={styles.loadingContainer}>
            <p>Yuklanmoqda...</p>
        </div>
    );

    if (error || !post) return (
        <div className={styles.errorContainer}>
            <p>Xatolik yuz berdi yoki post topilmadi</p>
            <ButtonDefault onClick={handleBack}>
                Orqaga qaytish
            </ButtonDefault>
        </div>
    );

    const areaTitle = banners.find(b => b.id === post.area_id)?.title ?? 'Nomaʼlum tur';

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.mainContent}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.dashboardTitle}>Post Details</h1>
                    <ButtonDefault onClick={handleBack}>
                        Orqaga
                    </ButtonDefault>
                </div>

                {/* Main Content */}
                <div className={styles.detailedPostContainer}>
                    <div className={styles.postDetailsWrapper}>
                        {/* Left Section - Gallery */}
                        <div className={styles.gallerySection}>
                            <Gallery postId={post.id} mainImg={post.img} />
                        </div>

                        {/* Right Section - Details */}
                        <div className={styles.detailsSection}>
                            <h1 className={styles.postMainTitle}>{post.title}</h1>
                            <p className={styles.postSmallDescription}>{post.small_description}</p>
                            <p className={styles.postFullDescription}>{post.description}</p>

                            {/* Features Section */}
                            <div className={styles.featuresSection}>
                                <h2 className={styles.sectionTitle}>Mavjud Bo'lgan Imkoniyatlar:</h2>
                                <Features postId={post.id} />
                            </div>

                            {/* Post Information Grid */}
                            <div className={styles.postInfoGrid}>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Reyting:</span>
                                    <Rating
                                        rating={post.avg_rating || 0}
                                        size="small"
                                        showRatingNumber={true}
                                        showRatingText={false}
                                    />
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Narxi:</span>
                                    <span className={styles.infoValue}>${post.price_daily}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Manzil:</span>
                                    <span className={styles.infoValue}>{post.location}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Odam Soni:</span>
                                    <span className={styles.infoValue}>{post.members}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Maskan turi:</span>
                                    <span className={styles.infoValue}>{areaTitle}</span>
                                </div>
                                <div className={styles.infoItem}>
                                    <span className={styles.infoLabel}>Ko'rilgan Soni:</span>
                                    <span className={styles.infoValue}>{post.view_count}</span>
                                </div>
                            </div>

                            {/* Comments Button */}
                            <ButtonDefault
                                onClick={() => setOpenCommentModal(true)}
                                variant="orange"
                                customClasses={styles.commentsButton}
                            >
                                Komentlarni ko'rish ({comments.length})
                            </ButtonDefault>

                            {/* Action Buttons */}
                            <div className={styles.actionButtons}>
                                <ButtonDefault
                                    onClick={() => navigate(`/posts/${post.id}/edit`)}
                                    variant="blue"
                                >
                                    Tahrirlash
                                </ButtonDefault>
                                <ButtonDefault
                                    onClick={() => setDeleteModalOpen(true)}
                                    variant="red"
                                >
                                    O'chirish
                                </ButtonDefault>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <DelModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Postni o'chirish"
                message="Haqiqatan ham ushbu postni o'chirmoqchimisiz?"
                confirmText="O'chirish"
                cancelText="Bekor qilish"
            />

            {/* Comments Modal */}
            <Modal
                isOpen={openCommentModal}
                onClose={() => setOpenCommentModal(false)}
                title="Foydalanuvchilar fikri"
                size="large"
            >
                <div className={styles.commentsContainer}>
                    {commentsLoading ? (
                        <p className={styles.loadingText}>Yuklanmoqda...</p>
                    ) : Array.isArray(comments) && comments.length > 0 ? (
                        <SwiperDefault
                            slidesPerView={1}
                            spaceBetween={20}
                            pagination={{ clickable: true }}
                            className={styles.commentsSwiper}
                        >
                            {comments.map((comment, index) => (
                                <div key={comment.id || index} className={styles.commentItem}>
                                    <div className={styles.commentHeader}>
                                        <h4 className={styles.commentAuthor}>{comment.name}</h4>
                                        <span className={styles.commentDate}>
                                            {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}
                                        </span>
                                    </div>
                                    <p className={styles.commentText}>{comment.text}</p>
                                </div>
                            ))}
                        </SwiperDefault>
                    ) : (
                        <p className={styles.noCommentsText}>Hozircha hech qanday fikr mavjud emas.</p>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default DetailedPosts;