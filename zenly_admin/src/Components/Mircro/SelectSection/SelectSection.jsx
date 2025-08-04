import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ButtonDefault from '../Button/ButtonDefault';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../Tables/ReusableTable';
import { usePosts } from '../../../hooks/Posts/usePosts';
import DelModal from '../../Macro/Modals/DelModal';

function SelectSection() {
    const { id: userId } = useParams(); // userId from route
    const [activeTab, setActiveTab] = useState('posts');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteIds, setDeleteIds] = useState([]);

    const {
        userPosts,
        getUserPosts,
        deletePost,
        clearUserPosts,
        loading,
        error,
    } = usePosts();

    useEffect(() => {
        if (activeTab === 'posts' && userId) {
            getUserPosts(userId);
        }

        return () => {
            clearUserPosts();
        };
    }, [activeTab, userId, getUserPosts, clearUserPosts]);

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

    const handleEdit = (id) => {
        console.log('Edit Post ID:', id);
        // Example: navigate(`/admin/posts/edit/${id}`);
    };

    const handleDelete = async () => {
        try {
            for (const id of deleteIds) {
                await deletePost(id);
            }
            await getUserPosts(userId);
            setDeleteIds([]);
            setDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting post(s):', error);
        }
    };

    const getViewPath = (id) => `/posts/${id}`; // Update if needed

    return (
        <div>
            <div className={styles.selectSection}>
                <ButtonDefault onClick={() => setActiveTab('posts')}>
                    Postlatlari
                </ButtonDefault>
                <ButtonDefault onClick={() => setActiveTab('orders')}>
                    Buyurtmalari
                </ButtonDefault>
                <ButtonDefault onClick={() => setActiveTab('comments')}>
                    Commentlari
                </ButtonDefault>
                <ButtonDefault onClick={() => setActiveTab('ratings')}>
                    Reytinglari
                </ButtonDefault>
                <ButtonDefault onClick={() => setActiveTab('views')}>
                    Ko'rilgan postlar
                </ButtonDefault>
            </div>

            {activeTab === 'posts' && (
                <>
                    <h3 className={styles.sectionTitle}>User Posts</h3>
                    {loading ? (
                        <p>Loading...</p>
                    ) : error ? (
                        <p style={{ color: 'red' }}>Error: {error}</p>
                    ) : (
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
                    )}
                </>
            )}

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

export default SelectSection;
