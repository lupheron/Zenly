import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../../assets/css/index.module.css';
import { usePosts } from '../../../hooks/Posts/usePosts';
import PostsCart from './Post';

function UsersPosts() {
    const { id } = useParams(); // Get user ID from URL params
    const { userPosts, loading, error, getUserPosts, clearUserPosts } = usePosts();

    useEffect(() => {
        if (id) {
            getUserPosts(id);
        }

        // Cleanup when component unmounts
        return () => {
            clearUserPosts();
        };
    }, [id, getUserPosts, clearUserPosts]);

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
                            // Handle post click - navigate to post detail
                            console.log('Post clicked:', post.id);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default UsersPosts;