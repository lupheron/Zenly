import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../hooks/Auth/useLogin';
import UsersTable from '../Components/Macro/Tables/UsersTable';
import styles from '../assets/css/pages.module.css';
import axios from '../hooks/axios';

function Dashboard() {
    const navigate = useNavigate();
    const { user } = useLoginStore();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0,
        totalComments: 0,
        totalBookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            // Fetch basic stats - adjust these endpoints based on your API
            const usersResponse = await axios.get('/users');
            const postsResponse = await axios.get('/posts');
            
            setStats({
                totalUsers: usersResponse.data?.data?.length || 0,
                totalPosts: postsResponse.data?.data?.length || 0,
                totalComments: 0, // Add if you have this endpoint
                totalBookings: 0 // Add if you have this endpoint
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            {/* Welcome Section */}
            {user && (
                <div className={styles.welcomeCard}>
                    <h1 className={styles.welcomeTitle}>
                        Welcome back, {user.name} {user.surename}! 👋
                    </h1>
                    <p className={styles.welcomeSubtitle}>
                        Here's what's happening with your platform today.
                    </p>
                    <div className={styles.welcomeInfo}>
                        <div className={styles.welcomeInfoItem}>
                            <span className={styles.welcomeInfoLabel}>Username</span>
                            <span className={styles.welcomeInfoValue}>@{user.username}</span>
                        </div>
                        <div className={styles.welcomeInfoItem}>
                            <span className={styles.welcomeInfoLabel}>Account Status</span>
                            <span className={styles.welcomeInfoValue}>
                                {user.status ? '✅ Active' : '❌ Inactive'}
                            </span>
                        </div>
                        <div className={styles.welcomeInfoItem}>
                            <span className={styles.welcomeInfoLabel}>Member Since</span>
                            <span className={styles.welcomeInfoValue}>
                                {new Date(user.created_at).toLocaleDateString('en-US', { 
                                    month: 'short', 
                                    year: 'numeric' 
                                })}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            {loading ? (
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <div className={styles.loadingText}>Loading statistics...</div>
                </div>
            ) : (
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
                                👥
                            </div>
                        </div>
                        <h2 className={styles.statValue}>{stats.totalUsers}</h2>
                        <p className={styles.statLabel}>Total Users</p>
                        <div className={`${styles.statChange} ${styles.statChangePositive}`}>
                            <span>↗</span>
                            <span>View all users</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
                                📝
                            </div>
                        </div>
                        <h2 className={styles.statValue}>{stats.totalPosts}</h2>
                        <p className={styles.statLabel}>Total Posts</p>
                        <div className={`${styles.statChange} ${styles.statChangePositive}`}>
                            <span>↗</span>
                            <span>Active content</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
                                💬
                            </div>
                        </div>
                        <h2 className={styles.statValue}>{stats.totalComments}</h2>
                        <p className={styles.statLabel}>Total Comments</p>
                        <div className={`${styles.statChange} ${styles.statChangePositive}`}>
                            <span>↗</span>
                            <span>User engagement</span>
                        </div>
                    </div>

                    <div className={styles.statCard}>
                        <div className={styles.statHeader}>
                            <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
                                📅
                            </div>
                        </div>
                        <h2 className={styles.statValue}>{stats.totalBookings}</h2>
                        <p className={styles.statLabel}>Total Bookings</p>
                        <div className={`${styles.statChange} ${styles.statChangePositive}`}>
                            <span>↗</span>
                            <span>Reservations made</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className={styles.contentCard}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.cardTitle}>Quick Actions</h2>
                </div>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <button 
                        className={styles.primaryButton}
                        onClick={() => navigate('/users')}
                    >
                        Manage Users
                    </button>
                    <button 
                        className={styles.secondaryButton}
                        onClick={() => navigate('/posts')}
                    >
                        Manage Posts
                    </button>
                </div>
            </div>

            {/* Recent Users Table */}
            <div className={styles.tableSection}>
                <h2 className={styles.sectionTitle}>Recent Users</h2>
                <div className={styles.contentCard}>
                    <UsersTable />
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 