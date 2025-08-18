import React, { useState } from 'react';
import { useFeatures } from '../../../../hooks/Features/useFeatures';
import Modal from '../../Modals/Modal';
import InputDefault from '../../../Mircro/FormElements/Input/InputDefault';
import ButtonDefault from '../../../Mircro/Button/ButtonDefault';
import DelModal from '../../Modals/DelModal';
import AlertDefault from '../../../Mircro/Alert/AlertDefault';
import api from '../../../../hooks/axios';
import styles from '../../../../assets/css/components.module.css';

function FeaturesForm({ postId, onFeatureChange }) {
    const { features, loading, error } = useFeatures(postId);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [featureToDelete, setFeatureToDelete] = useState(null);
    const [newFeatureName, setNewFeatureName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDeleteFeature = async (featureId) => {
        const feature = features.find(f => f.id === featureId);
        setFeatureToDelete(feature);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteFeature = async () => {
        if (!featureToDelete) return;
        
        try {
            const response = await api.delete(`/admin/features/${featureToDelete.id}`);

            if (response.data.status === 200) {
                AlertDefault.success('Feature deleted successfully');
                // Trigger refresh of features
                if (onFeatureChange) {
                    onFeatureChange();
                }
            } else {
                AlertDefault.error('Failed to delete feature');
            }
        } catch (error) {
            console.error('Error deleting feature:', error);
            AlertDefault.error('Error deleting feature');
        } finally {
            setIsDeleteModalOpen(false);
            setFeatureToDelete(null);
        }
    };

    const handleAddFeature = async () => {
        if (!newFeatureName.trim()) {
            AlertDefault.warning('Please enter a feature name');
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
                AlertDefault.success('Feature added successfully');
                setNewFeatureName('');
                setIsAddModalOpen(false);
                // Trigger refresh of features
                if (onFeatureChange) {
                    onFeatureChange();
                }
            } else {
                AlertDefault.error('Failed to add feature');
            }
        } catch (error) {
            console.error('Error adding feature:', error);
            AlertDefault.error('Error adding feature');
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
                        <div key={feature.id} className={styles.featureFormItem}>
                            <span className={styles.featureFormName}>{feature.name}</span>
                            <button
                                onClick={() => handleDeleteFeature(feature.id)}
                                className={styles.deleteFeatureButton}
                                title="Delete feature"
                                type='button'
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
                    type='button'
                >
                    +
                </button>
            </div>

            {/* Add Feature Modal */}
            {isAddModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        minWidth: '400px'
                    }}>
                        <h3>Add New Feature</h3>
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
                    </div>
                </div>
            )}

            {/* Delete Feature Modal */}
            <DelModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setFeatureToDelete(null);
                }}
                onConfirm={confirmDeleteFeature}
                title="Delete Feature"
                message={`Are you sure you want to delete the feature "${featureToDelete?.name}"?`}
                confirmText="Delete"
                cancelText="Cancel"
            />
        </div>
    );
}

export default FeaturesForm;