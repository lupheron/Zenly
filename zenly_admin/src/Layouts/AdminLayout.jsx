import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useLoginStore from '../hooks/Auth/useLogin';
import styles from '../assets/css/layout.module.css';

function AdminLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useLoginStore();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/users', label: 'Users', icon: '👥' },
        { path: '/guides', label: 'Guide', icon: '📚' },
        { path: '/drivers', label: 'Driver', icon: '🚗' },
        { path: '/posts', label: 'Posts', icon: '📝' },
    ];

    const isActive = (path) => {
        if (path === '/dashboard') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
                <div className={styles.sidebarHeader}>
                    <div className={styles.logo}>
                        <span className={styles.logoIcon}>🏔️</span>
                        {sidebarOpen && <span className={styles.logoText}>Zenly Admin</span>}
                    </div>
                </div>

                <nav className={styles.sidebarNav}>
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={`${styles.navItem} ${isActive(item.path) ? styles.navItemActive : ''}`}
                            title={!sidebarOpen ? item.label : ''}
                        >
                            <span className={styles.navIcon}>{item.icon}</span>
                            {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className={styles.sidebarFooter}>
                    {user && (
                        <div className={styles.userInfo}>
                            <div className={styles.userAvatar}>
                                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
                            </div>
                            {sidebarOpen && (
                                <div className={styles.userDetails}>
                                    <div className={styles.userName}>{user.name} {user.surename}</div>
                                    <div className={styles.userRole}>Administrator</div>
                                </div>
                            )}
                        </div>
                    )}
                    <button 
                        onClick={handleLogout} 
                        className={styles.logoutBtn}
                        title={!sidebarOpen ? 'Logout' : ''}
                    >
                        <span className={styles.logoutIcon}>🚪</span>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className={styles.mainArea}>
                {/* Top Header */}
                <header className={styles.topHeader}>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)} 
                        className={styles.menuToggle}
                        aria-label="Toggle sidebar"
                    >
                        <span className={styles.menuToggleIcon}>
                            {sidebarOpen ? '◀' : '▶'}
                        </span>
                    </button>
                    <div className={styles.headerRight}>
                        <div className={styles.breadcrumb}>
                            {location.pathname.split('/').filter(Boolean).map((path, index, arr) => (
                                <span key={index} className={styles.breadcrumbItem}>
                                    {index > 0 && <span className={styles.breadcrumbSeparator}>/</span>}
                                    {path}
                                </span>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className={styles.pageContent}>
                    {children}
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;

