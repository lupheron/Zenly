import React from 'react';
import UsersTable from '../../Components/Macro/Tables/UsersTable';
import styles from '../../assets/css/pages.module.css';

function Users() {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Users Management</h1>
                <p className={styles.pageDescription}>
                    Manage all users, view their details, and perform administrative actions.
                </p>
            </div>

            <div className={styles.contentCard}>
                <UsersTable />
            </div>
        </div>
    );
}

export default Users;