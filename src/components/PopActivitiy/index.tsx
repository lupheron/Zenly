import React from 'react'
import SwiperDefault from '../Swiper/SwiperDefault'
import SerivecesBanner from '../Banners/SerivecesBanner'
import TitleButtons from '../Button/TitleButtons';

const PopularActivity = () => {
    const banners = [
        {
            title: 'Yoga Classes',
            paragraph: 'Relaxing yoga sessions for all skill levels in peaceful environment.',
            src: '/ready/relax.jpg'
        },
        {
            title: 'Meditation',
            paragraph: 'Guided meditation to help you find inner peace and clarity.',
            src: '/ready/relax.jpg'
        },
        {
            title: 'Spa Retreat',
            paragraph: 'Luxurious spa treatments to rejuvenate your body and mind.',
            src: '/ready/relax.jpg'
        },
        {
            title: 'Nature Walks',
            paragraph: 'Guided walks through beautiful natural landscapes to refresh.',
            src: '/ready/relax.jpg'
        },
        {
            title: 'Art Therapy',
            paragraph: 'Creative sessions to express yourself and reduce stress.',
            src: '/ready/relax.jpg'
        },
        {
            title: 'Sound Healing',
            paragraph: 'Therapeutic sound baths for deep relaxation and healing.',
            src: '/ready/relax.jpg'
        },
        {
            title: 'Breathwork',
            paragraph: 'Learn powerful breathing techniques to reduce anxiety.',
            src: '/ready/relax.jpg'
        },
        {
            title: 'Tai Chi',
            paragraph: 'Gentle movements to improve balance and mental focus.',
            src: '/ready/relax.jpg'
        },
        {
            title: 'Aromatherapy',
            paragraph: 'Essential oil treatments to enhance mood and wellbeing.',
            src: '/ready/relax.jpg'
        }
    ];
    return (
        <div className="popular-activities mt-20">
            <div className='w-50 mx-auto mb-20'>
                <TitleButtons label='Mashhur servislar' customClasses='text-green-700 bg-green-50' />
            </div>
            <SwiperDefault pagination={false} slidesPerView={3} spaceBetween={5} className='bg-gray-50 w-[70%]'>
                {banners.map((banner, index) => (
                    <SerivecesBanner
                        key={index}
                        title={banner.title}
                        paragraph={banner.paragraph}
                        src={banner.src}
                    />
                ))}
            </SwiperDefault>
        </div>
    )
}

export default PopularActivity