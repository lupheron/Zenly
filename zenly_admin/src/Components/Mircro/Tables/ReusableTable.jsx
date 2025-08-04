import React, { useState } from 'react';
import styles from "../../../assets/css/components.module.css";
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ReusableTable = ({ data, columns, onEdit, onDelete, getViewPath }) => {
    const [selectedRows, setSelectedRows] = useState([]);
    const navigate = useNavigate();

    const toggleSelect = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedRows.length === data.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data.map((row) => row.id));
        }
    };

    const handleBulkDelete = () => {
        onDelete(selectedRows); // Open modal via parent
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedRows.length === data.length}
                                onChange={toggleSelectAll}
                            />
                        </th>
                        {columns.map((col) => (
                            <th key={col.key}>{col.header}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.includes(row.id)}
                                    onChange={() => toggleSelect(row.id)}
                                />
                            </td>
                            {columns.map((col) => (
                                <td key={col.key}>{row[col.key]}</td>
                            ))}
                            <td className={styles.actions}>
                                <VisibilityIcon
                                    className={styles.EyeIcon}
                                    titleAccess="View"
                                    onClick={() => navigate(getViewPath(row.id))}
                                />
                                <EditIcon
                                    className={styles.EditIcon}
                                    titleAccess="Edit"
                                    onClick={() => onEdit(row.id)}
                                />
                                <DeleteIcon
                                    className={styles.DelIcon}
                                    titleAccess="Delete"
                                    onClick={() => onDelete(row.id)} // This now opens your DelModal
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedRows.length > 0 && (
                <button className={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
                    Delete Selected ({selectedRows.length})
                </button>
            )}
        </div>
    );
};

export default ReusableTable;
