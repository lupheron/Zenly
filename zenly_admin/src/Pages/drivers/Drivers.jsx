import React, { useState } from 'react';
import DriversTable from '../../Components/Macro/Tables/DriversTable';
import CreateDriverForm from '../../Components/Macro/Forms/Drivers/CreateDriverForm';
import EditDriverForm from '../../Components/Macro/Forms/Drivers/EditDriverForm';
import ButtonDefault from '../../Components/Mircro/Button/ButtonDefault';
import Modal from '../../Components/Macro/Modals/Modal';
import DelModal from '../../Components/Macro/Modals/DelModal';
import AlertDefault from '../../Components/Mircro/Alert/AlertDefault';
import { useDriversStore } from '../../hooks/Drivers/useDrivers';
import styles from '../../assets/css/pages.module.css';

function Drivers() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDrivers, setSelectedDrivers] = useState([]);
    const [editingDriver, setEditingDriver] = useState(null);
    const { createDriver, updateDriver, deleteDrivers, loading } = useDriversStore();

    const handleCreateDriver = async (driverData) => {
        const result = await createDriver(driverData);
        if (result.success) {
            setShowCreateModal(false);
            AlertDefault.success('Driver created successfully!');
        } else {
            AlertDefault.error(`Failed to create driver: ${result.error}`);
        }
    };

    const handleCreateCancel = () => {
        setShowCreateModal(false);
    };

    const handleEditDriver = (driver) => {
        setEditingDriver(driver);
        setShowEditModal(true);
    };

    const handleUpdateDriver = async (driverData) => {
        const result = await updateDriver(editingDriver.id, driverData);
        if (result.success) {
            setShowEditModal(false);
            setEditingDriver(null);
            AlertDefault.success('Driver updated successfully!');
        } else {
            AlertDefault.error(`Failed to update driver: ${result.error}`);
        }
    };

    const handleEditCancel = () => {
        setShowEditModal(false);
        setEditingDriver(null);
    };

    const handleSelectionChange = (selectedRows) => {
        setSelectedDrivers(selectedRows);
    };

    const handleBulkDelete = () => {
        if (selectedDrivers.length === 0) return;
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const result = await deleteDrivers(selectedDrivers);
            if (result.success) {
                setSelectedDrivers([]);
                setShowDeleteModal(false);
                AlertDefault.success(`Successfully deleted ${selectedDrivers.length} driver${selectedDrivers.length > 1 ? 's' : ''}!`);
            } else {
                AlertDefault.error(`Failed to delete drivers: ${result.error}`);
            }
        } catch (error) {
            AlertDefault.error(`Error deleting drivers: ${error.message}`);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>Drivers Management</h1>
                    <p className={styles.pageDescription}>
                        Manage all drivers, view their details, and perform administrative actions.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {selectedDrivers.length > 0 && (
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
                            Delete Selected ({selectedDrivers.length})
                        </ButtonDefault>
                    )}
                    <ButtonDefault
                        variant="primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Create Driver
                    </ButtonDefault>
                </div>
            </div>

            <div className={styles.contentCard}>
                <DriversTable onSelectionChange={handleSelectionChange} onEdit={handleEditDriver} />
            </div>

            <Modal
                isOpen={showCreateModal}
                onClose={handleCreateCancel}
                title="Create New Driver"
                size="large"
                closeOnOverlayClick={false}
            >
                <CreateDriverForm
                    onSubmit={handleCreateDriver}
                    onCancel={handleCreateCancel}
                    loading={loading}
                />
            </Modal>

            <Modal
                isOpen={showEditModal}
                onClose={handleEditCancel}
                title="Edit Driver"
                size="large"
                closeOnOverlayClick={false}
            >
                <EditDriverForm
                    driver={editingDriver}
                    onSubmit={handleUpdateDriver}
                    onCancel={handleEditCancel}
                    loading={loading}
                />
            </Modal>

            <DelModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Delete Drivers"
                message={`Are you sure you want to delete ${selectedDrivers.length} driver${selectedDrivers.length > 1 ? 's' : ''}?`}
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

export default Drivers;