import React, { useState } from 'react';
import { useFeatures } from '../../../../hooks/Features/useFeatures';
import Modal from '../../Modals/Modal';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import ButtonDefault from '../../../Mircro/Button/ButtonDefault';
import api from '../../../../hooks/axios';
import styles from '../../../../assets/css/components.module.css';

function FeaturesForm({ postId, onFeatureChange }) {
    const { features, loading, error } = useFeatures(postId);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newFeatureName, setNewFeatureName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

        const handleDeleteFeature = async (featureId) => {
        if (window.confirm('Are you sure you want to delete this feature?')) {
            try {
                const response = await api.delete(`/admin/features/${featureId}`);

                if (response.data.status === 200) {
                    // Trigger refresh of features
                    if (onFeatureChange) {
                        onFeatureChange();
                    }
                } else {
                    alert('Failed to delete feature');
                }
            } catch (error) {
                console.error('Error deleting feature:', error);
                alert('Error deleting feature');
            }
        }
    };

    const handleAddFeature = async () => {
        if (!newFeatureName.trim()) {
            alert('Please enter a feature name');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/admin/features', {
                post_id: postId,
                user_id: localStorage.getItem('admin_id'),
                name: newFeatureName.trim()
            });

            if (response.data.status === 201) {
                setNewFeatureName('');
                setIsAddModalOpen(false);
                // Trigger refresh of features
                if (onFeatureChange) {
                    onFeatureChange();
                }
            } else {
                alert('Failed to add feature');
            }
        } catch (error) {
            console.error('Error adding feature:', error);
            alert('Error adding feature');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div>Loading features...</div>;
    }

    if (error) {
        return <div>Error loading features: {error.message}</div>;
    }

    return (
        <div className={styles.featuresForm}>
            <h3>Features</h3>
            
            {/* Features List */}
            <div className={styles.featuresList}>
                {features && features.length > 0 ? (
                    features.map((feature) => (
                        <div key={feature.id} className={styles.featureItem}>
                            <span className={styles.featureName}>{feature.name}</span>
                            <button
                                onClick={() => handleDeleteFeature(feature.id)}
                                className={styles.deleteButton}
                                title="Delete feature"
                            >
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No features added yet.</p>
                )}
                
                {/* Add Feature Button */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className={styles.addFeatureButton}
                    title="Add new feature"
                >
                    +
                </button>
            </div>

            {/* Add Feature Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Add New Feature"
                size="small"
            >
                <div className={styles.addFeatureForm}>
                    <InputDefault
                        label="Feature Name"
                        placeholder="Enter feature name"
                        value={newFeatureName}
                        onChange={(e) => setNewFeatureName(e.target.value)}
                        showLabel={true}
                        required={true}
                    />
                    
                    <div className={styles.modalActions}>
                        <ButtonDefault
                            onClick={handleAddFeature}
                            disabled={isSubmitting}
                            variant="blue"
                        >
                            {isSubmitting ? 'Adding...' : 'Add Feature'}
                        </ButtonDefault>
                        <ButtonDefault
                            onClick={() => setIsAddModalOpen(false)}
                            variant="gray"
                        >
                            Cancel
                        </ButtonDefault>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default FeaturesForm;