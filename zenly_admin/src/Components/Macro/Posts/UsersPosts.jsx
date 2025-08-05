import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import { usePosts } from '../../../hooks/Posts/usePosts';
import PostsCart from './Post';
import ReusableTable from '../../Mircro/Tables/ReusableTable';
import DelModal from '../../Macro/Modals/DelModal';

function UsersPosts() {
    const { id } = useParams();
    const {
        userPosts,
        getUserPosts,
        clearUserPosts,
        deletePost,
        loading,
        error,
    } = usePosts();

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIds, setDeleteIds] = useState([]);

    useEffect(() => {
        if (id) {
            getUserPosts(id);
        }
        return () => clearUserPosts();
    }, [id, getUserPosts, clearUserPosts]);

    const handleEdit = (postId) => {
        console.log('Edit Post ID:', postId);
        // You can navigate to edit page here
    };

    const handleDelete = async () => {
        try {
            for (const id of deleteIds) {
                await deletePost(id);
            }
            await getUserPosts(id);
            setDeleteIds([]);
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting post(s):', error);
        }
    };

    const getViewPath = (postId) => `/posts/${postId}`;

    const columns = [
        { header: 'ID', key: 'id' },
        { header: 'User_id', key: 'user_id' },
        { header: 'Area_id', key: 'area_id' },
        { header: 'Title', key: 'title' },
        { header: 'Small_D', key: 'small_description' },
        { header: 'Description', key: 'description' },
        { header: 'Members', key: 'members' },
        { header: 'Location', key: 'location' },
        { header: 'Price (Daily)', key: 'price_daily' },
        { header: 'Status', key: 'status' },
        { header: 'Created At', key: 'created_at' },
        { header: 'Updated At', key: 'updated_at' },
    ];

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <p>Loading user posts...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <p>Error loading posts: {error}</p>
            </div>
        );
    }

    if (!userPosts || userPosts.length === 0) {
        return (
            <div className={styles.noPostsContainer}>
                <h3>User Posts</h3>
                <p>This user hasn't created any posts yet.</p>
            </div>
        );
    }

    return (
        <div className={styles.userPostsSection}>
            <h3 className={styles.sectionTitle}>
                User Posts ({userPosts.length})
            </h3>

            {/* 🟢 Table View */}
            <ReusableTable
                data={userPosts}
                columns={columns}
                onEdit={handleEdit}
                onDelete={(ids) => {
                    const selected = Array.isArray(ids) ? ids : [ids];
                    setDeleteIds(selected);
                    setDeleteModalOpen(true);
                }}
                getViewPath={getViewPath}
            />

            {/* 🟢 Grid View */}
            <div className={styles.postsGrid}>
                {userPosts.map((post) => (
                    <PostsCart
                        key={post.id}
                        postId={post.id}
                        src={post.img}
                        title={post.title}
                        small_description={post.small_description}
                        location={post.location}
                        rating={parseFloat(post.avg_rating) || 0}
                        price_daily={post.price_daily}
                        onClick={() => {
                            console.log('Post clicked:', post.id);
                        }}
                    />
                ))}
            </div>

            {/* Delete Modal */}
            <DelModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setDeleteIds([]);
                }}
                onConfirm={handleDelete}
                title="Postni o'chirish"
                message={
                    deleteIds.length > 1
                        ? `Haqiqatan ham ushbu ${deleteIds.length} ta postni o'chirmoqchimisiz?`
                        : "Haqiqatan ham ushbu postni o'chirmoqchimisiz?"
                }
                confirmText="O'chirish"
                cancelText="Bekor qilish"
            />
        </div>
    );
}

export default UsersPosts;
