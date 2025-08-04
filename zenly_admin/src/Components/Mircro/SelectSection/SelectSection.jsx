import React from 'react';
import ButtonDefault from '../Button/ButtonDefault';
import styles from '../../../assets/css/index.module.css';
import ReusableTable from '../Tables/ReusableTable';

function SelectSection() {
    const data = [
        { id: 1, name: 'Alice', email: 'alice@gmail.com' },
        { id: 2, name: 'Bob', email: 'bob@yahoo.com' },
    ];

    const columns = [
        { header: 'Name', key: 'name' },
        { header: 'Email', key: 'email' },
    ];

    const handleEdit = (id) => {
        console.log('Edit:', id);
    };

    const handleDelete = (id) => {
        console.log('Delete:', id);
    };

    const getViewPath = (id) => `/users/${id}`;
    return (
        <div>
            <div className={styles.selectSection}>
                <ButtonDefault>
                    Postlatlari
                </ButtonDefault>
                <ButtonDefault>
                    Buyurtmalari
                </ButtonDefault>
                <ButtonDefault>
                    Commentlari
                </ButtonDefault>
                <ButtonDefault>
                    Reytinglari
                </ButtonDefault>
                <ButtonDefault>
                    Ko'rilgan postlar
                </ButtonDefault>
            </div>
            <ReusableTable
                data={data}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                getViewPath={getViewPath}
            />
        </div>
    );
}

export default SelectSection;