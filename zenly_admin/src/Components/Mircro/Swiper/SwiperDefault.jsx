import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

import styles from '../../../assets/css/components.module.css';

const SwiperDefault = ({
    children,
    slidesPerView = 3,
    spaceBetween = 30,
    freeMode = true,
    pagination = { clickable: true },
    modules = [FreeMode, Pagination, Autoplay],
    className = '',
    ...props
}) => {
    return (
        <Swiper
            slidesPerView={slidesPerView}
            spaceBetween={spaceBetween}
            freeMode={freeMode}
            pagination={pagination}
            modules={modules}
            className={`${styles.swiperWrapper} ${className}`}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            {...props}
        >
            {React.Children.map(children, (child, index) => (
                <SwiperSlide key={index} className={styles.slide}>
                    {child}
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SwiperDefault;
