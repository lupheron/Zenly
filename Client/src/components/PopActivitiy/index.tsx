import React from 'react';
import SwiperDefault from '../Swiper/SwiperDefault';
import SerivecesBanner from '../Banners/SerivecesBanner';
import TitleButtons from '../Button/TitleButtons';
import Services from './Services';
import { useTopRatedPosts, Post as TopRatedPost } from '@/src/hooks/posts/usePosts';

const PopularActivity = () => {
    const { data: topRatedPosts, isLoading } = useTopRatedPosts();

    return (
        <div className="popular-activities mt-20">
            <div className="w-50 mx-auto mb-20" data-aos="fade-down">
                <TitleButtons label="Mashhur servislar" customClasses="text-green-700 bg-green-50" />
            </div>

            <div data-aos="fade-down">
                {isLoading ? (
                    <div className="text-center py-10">Loading top rated posts...</div>
                ) : (
                    <SwiperDefault
                        pagination={false}
                        spaceBetween={5}
                        className="bg-gray-50 w-[75%]"
                        breakpoints={{
                            0: {
                                slidesPerView: 1
                            },
                            768: {
                                slidesPerView: 2
                            },
                            1040: {
                                slidesPerView: 3
                            }
                        }}
                    >
                        {topRatedPosts && topRatedPosts.map((post: TopRatedPost) => (
                            <SerivecesBanner
                                key={post.id}
                                title={post.title}
                                paragraph={post.small_description}
                                src={post.img}
                            />
                        ))}
                    </SwiperDefault>
                )}
            </div>

            <Services />
        </div>
    );
};

export default PopularActivity;