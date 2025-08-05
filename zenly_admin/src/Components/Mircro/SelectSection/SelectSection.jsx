import React from 'react';
import { useParams } from 'react-router-dom';
import ButtonDefault from '../Button/ButtonDefault';
import styles from '../../../assets/css/index.module.css';

function SelectSection({ activeTab, setActiveTab }) {
    const { id: userId } = useParams();

    return (
        <div className={styles.selectSection}>
            <ButtonDefault onClick={() => setActiveTab('posts')}>
                Postlatlari
            </ButtonDefault>
            <ButtonDefault onClick={() => setActiveTab('orders')}>
                Buyurtmalari
            </ButtonDefault>
            <ButtonDefault onClick={() => setActiveTab('comments')}>
                Commentlari
            </ButtonDefault>
            <ButtonDefault onClick={() => setActiveTab('ratings')}>
                Reytinglari
            </ButtonDefault>
            <ButtonDefault onClick={() => setActiveTab('views')}>
                Ko'rilgan postlar
            </ButtonDefault>
        </div>
    );
}

export default SelectSection;
