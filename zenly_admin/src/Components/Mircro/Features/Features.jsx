import React, { useState } from 'react';
import { useFeatures } from '../../../hooks/Features/useFeatures';
import styles from '../../../assets/css/components.module.css';

const Features = ({ postId }) => {
    const { features, loading, error } = useFeatures(postId);
    const [showAll, setShowAll] = useState(false);

    if (loading) return <div className={styles.loading}>Loading...</div>;

    if (error) {
        if (error.status === 404) {
            return <div className={styles.error}>{error.message}</div>;
        }
        return <div className={styles.error}>Error loading features.</div>;
    }

    if (!features || features.length === 0) {
        return <div className={styles.noFeatures}>No features available.</div>;
    }

    const firstSix = features.slice(0, 6);
    const remaining = features.slice(6);

    return (
        <div className={styles.featuresContainer}>
            {/* First 6 features */}
            <div className={styles.featuresGrid}>
                {firstSix.map((feature, index) => (
                    <div key={index} className={styles.featureItem}>
                        <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className={styles.featureName}>{feature.name}</span>
                    </div>
                ))}
            </div>

            {/* Additional features (shown when expanded) */}
            {showAll && remaining.length > 0 && (
                <div className={`${styles.featuresGrid} ${styles.additionalFeatures}`}>
                    {remaining.map((feature, index) => (
                        <div key={index + 6} className={styles.featureItem}>
                            <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className={styles.featureName}>{feature.name}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Show more/less button */}
            {remaining.length > 0 && (
                <button
                    onClick={() => setShowAll(!showAll)}
                    className={styles.toggleButton}
                >
                    {showAll ? "Kamrog'ini ko'rish" : "Hammasini ko'rish"}
                </button>
            )}
        </div>
    );
};

export default Features;