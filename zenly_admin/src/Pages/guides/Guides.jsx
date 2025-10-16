import React, { useState } from 'react';
import GuidesTable from '../../Components/Macro/Tables/GuidesTable';
import CreateGuideForm from '../../Components/Macro/Forms/Guides/CreateGuideForm';
import ButtonDefault from '../../Components/Mircro/Button/ButtonDefault';
import Modal from '../../Components/Macro/Modals/Modal';
import { useGuidesStore } from '../../hooks/Guides/useGuides';
import styles from '../../assets/css/pages.module.css';

function Guides() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const { createGuide, loading } = useGuidesStore();

    const handleCreateGuide = async (guideData) => {
        const result = await createGuide(guideData);
        if (result.success) {
            setShowCreateModal(false);
            // Success message could be shown here
        } else {
            // Error message could be shown here
            console.error('Failed to create guide:', result.error);
        }
    };

    const handleCreateCancel = () => {
        setShowCreateModal(false);
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
                <ButtonDefault
                    variant="primary"
                    onClick={() => setShowCreateModal(true)}
                >
                    Create Guide
                </ButtonDefault>
            </div>

            <div className={styles.contentCard}>
                <GuidesTable />
            </div>

            {/* Create Guide Modal */}
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
        </div>
    );
}

export default Guides;