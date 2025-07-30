import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLoginStore from '../hooks/Auth/useLogin';
import Users from './users/Users';
import styles from '../assets/css/index.module.css';

function Dashboard() {
    const navigate = useNavigate();
    const { user, logout, loading } = useLoginStore();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                Loading...
            </div>
        );
    }

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <h1 className={styles.dashboardTitle}>Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className={styles.logoutButton}
                        disabled={loading}
                    >
                        {loading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>

                {user && (
                    <div className={styles.userInfo}>
                        <h2 className={styles.userWelcome}>
                            Welcome, {user.name} {user.surename}!
                        </h2>
                        <div className={styles.userDetails}>
                            <div><strong>Username:</strong> {user.username}</div>
                            <div><strong>Status:</strong>
                                <span className={user.status ? styles.statusActive : styles.statusInactive}>
                                    {user.status ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div><strong>Account Created:</strong> {new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                )}

                <div className={styles.statsGrid}>
                    <div className={`${styles.statCard} ${styles.statCardBlue}`}>
                        <h3 className={styles.statTitleBlue}>Quick Stats</h3>
                        <p className={styles.statContent}>
                            Your admin dashboard is ready. Add more features and statistics here.
                        </p>
                    </div>

                    <div className={`${styles.statCard} ${styles.statCardPurple}`}>
                        <h3 className={styles.statTitlePurple}>Recent Activity</h3>
                        <p className={styles.statContent}>
                            No recent activity to display.
                        </p>
                    </div>

                    <div className={`${styles.statCard} ${styles.statCardGreen}`}>
                        <h3 className={styles.statTitleGreen}>System Status</h3>
                        <p className={styles.statContent}>
                            All systems are running normally.
                        </p>
                    </div>
                </div>

                {/* Users Section */}
                <div className={styles.usersSection}>
                    <h2 className={styles.usersTitle}>Users Management</h2>
                    <Users />
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 