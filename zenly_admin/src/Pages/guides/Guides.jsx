import React, { useState } from 'react';
import GuidesTable from '../../Components/Macro/Tables/GuidesTable';
import CreateGuideForm from '../../Components/Macro/Forms/Guides/CreateGuideForm';
import ButtonDefault from '../../Components/Mircro/Button/ButtonDefault';
import Modal from '../../Components/Macro/Modals/Modal';
import DelModal from '../../Components/Macro/Modals/DelModal';
import AlertDefault from '../../Components/Mircro/Alert/AlertDefault';
import { useGuidesStore } from '../../hooks/Guides/useGuides';
import styles from '../../assets/css/pages.module.css';

function Guides() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedGuides, setSelectedGuides] = useState([]);
    const { createGuide, deleteGuides, loading } = useGuidesStore();

    const handleCreateGuide = async (guideData) => {
        const result = await createGuide(guideData);
        if (result.success) {
            setShowCreateModal(false);
            AlertDefault.success('Guide created successfully!');
        } else {
            AlertDefault.error(`Failed to create guide: ${result.error}`);
        }
    };

    const handleCreateCancel = () => {
        setShowCreateModal(false);
    };

    const handleSelectionChange = (selectedRows) => {
        setSelectedGuides(selectedRows);
    };

    const handleBulkDelete = () => {
        if (selectedGuides.length === 0) return;
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const result = await deleteGuides(selectedGuides);
            if (result.success) {
                setSelectedGuides([]);
                setShowDeleteModal(false);
                AlertDefault.success(`Successfully deleted ${selectedGuides.length} guide${selectedGuides.length > 1 ? 's' : ''}!`);
            } else {
                AlertDefault.error(`Failed to delete guides: ${result.error}`);
            }
        } catch (error) {
            AlertDefault.error(`Error deleting guides: ${error.message}`);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Guides Management</h1>
                    <p className={styles.pageDescription}>
                        Manage all guides, view their details, and perform administrative actions.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {selectedGuides.length > 0 && (
                        <ButtonDefault
                            variant="danger"
                            onClick={handleBulkDelete}
                            style={{
                                backgroundColor: '#dc3545',
                                borderColor: '#dc3545',
                                color: 'white',
                                animation: 'slideIn 0.3s ease-out'
                            }}
                        >
                            Delete Selected ({selectedGuides.length})
                        </ButtonDefault>
                    )}
                    <ButtonDefault
                        variant="primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create Guide
                    </ButtonDefault>
                </div>
            </div>

            <div className={styles.contentCard}>
                <GuidesTable onSelectionChange={handleSelectionChange} />
            </div>

            <Modal
                isOpen={showCreateModal}
                onClose={handleCreateCancel}
                title="Create New Guide"
                size="large"
                closeOnOverlayClick={false}
            >
                <CreateGuideForm
                    onSubmit={handleCreateGuide}
                    onCancel={handleCreateCancel}
                    loading={loading}
                />
            </Modal>

            <DelModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Guides"
                message={`Are you sure you want to delete ${selectedGuides.length} guide${selectedGuides.length > 1 ? 's' : ''}?`}
                confirmText="Delete"
                cancelText="Cancel"
            />

            <style jsx>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}

export default Guides;