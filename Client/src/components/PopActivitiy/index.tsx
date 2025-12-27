import React, { useState } from 'react';
import SwiperDefault from '../Swiper/SwiperDefault';
import SerivecesBanner from '../Banners/SerivecesBanner';
import TitleButtons from '../Button/TitleButtons';
import Services from './Services';
import { useTopRatedPosts, Post as TopRatedPost } from '@/src/hooks/posts/usePosts';
import { useRouter } from 'next/navigation';
import InputDefault from '../FormElements/Input/InputDefault';
import LabelDefault from '../FormElements/label/LabelDefault';
import { useMonuments } from '@/src/hooks/monuments/Monuments';
import MonumentCard from '../Cart/MonumentCard';
import { useLanguage } from '@/src/contexts/LanguageContext';

const PopularActivity = () => {
    const { data: topRatedPosts, isLoading } = useTopRatedPosts();
    const { data: monuments, isLoading: monumentsLoading } = useMonuments();
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();
    const { t } = useLanguage();

    // Filter monuments based on search query - only search after 3 letters
    const filteredMonuments = monuments?.filter(monument => {
        // If search query is less than 3 characters, show all monuments
        if (searchQuery.length < 3) {
            return true;
        }
        // Search by monument name only
        return monument.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="popular-activities mt-20 px-60" id='activities'>
            <div className="w-50 mx-auto mb-20" data-aos="fade-down">
                <TitleButtons label={t('monuments.title')} customClasses="text-green-700 bg-green-50" />
            </div>

            <div className="mb-6 flex flex-col gap-2">
                <LabelDefault label={t('monuments.selectCity')} htmlFor="search" />
                <InputDefault
                    type="text"
                    name="search"
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('monuments.search')}
                    customClasses='w-full'
                />
            </div>

            <div className="mb-10">
                {monumentsLoading ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500">{t('monuments.loading')}</p>
                    </div>
                ) : filteredMonuments && filteredMonuments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-start">
                        {filteredMonuments.map((monument) => (
                            <MonumentCard
                                key={monument.id}
                                img={monument.img}
                                name={monument.name}
                                description={monument.description}
                                location={monument.location}
                                onClick={() => {
                                    // You can add navigation or modal logic here
                                    console.log('Monument clicked:', monument.id);
                                }}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">{t('monuments.noMonuments')}</p>
                    </div>
                )}
            </div>

            <Services />
        </div>
    );
};

export default PopularActivity;