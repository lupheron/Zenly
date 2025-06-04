import React, { ReactNode } from 'react';
import { Swiper, SwiperSlide, SwiperProps } from 'swiper/react';
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface CustomSwiperProps extends Omit<SwiperProps, 'children'> {
    children: ReactNode | ReactNode[];
    slidesPerView?: number | 'auto';
    spaceBetween?: number;
    freeMode?: boolean;
    pagination?: boolean | { clickable?: boolean };
    modules?: any[];
    className?: string;
}

const SwiperDefault: React.FC<CustomSwiperProps> = ({
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
            className={className}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            {...props}
        >
            {React.Children.map(children, (child, index) => (
                <SwiperSlide key={index} className='px-5'>{child}</SwiperSlide>
            ))}
        </Swiper>
    );
};

export default SwiperDefault;