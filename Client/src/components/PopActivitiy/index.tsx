import React from 'react';
import SwiperDefault from '../Swiper/SwiperDefault';
import SerivecesBanner from '../Banners/SerivecesBanner';
import TitleButtons from '../Button/TitleButtons';
import Services from './Services';
import { useTopRatedPosts, Post as TopRatedPost } from '@/src/hooks/posts/usePosts';
import { useRouter } from 'next/navigation';

const PopularActivity = () => {
    const { data: topRatedPosts, isLoading } = useTopRatedPosts();
    const router = useRouter();

    return (
        <div className="popular-activities mt-20" id='activities'>
            <div className="w-50 mx-auto mb-20" data-aos="fade-down">
                <TitleButtons label="Mashhur servislar" customClasses="text-green-700 bg-green-50" />
            </div>

            <div data-aos="fade-down">
                {isLoading ? (
                    <div className="text-center py-10">Eng yaxshi postlar yuklanmoqda...</div>
                ) : (
                    <SwiperDefault
                        pagination={false}
                        spaceBetween={5}
                        className="bg-gray-50 rounded w-[75%] py-10"
                        breakpoints={{
                            0: {
                                slidesPerView: 1
                            },
                            768: {
                                slidesPerView: 2
                            },
                            1040: {
                                slidesPerView: 2
                            },
                            1280: {
                                slidesPerView: 3
                            }
                        }}
                    >
                        {topRatedPosts && topRatedPosts.map((post: TopRatedPost) => (
                            <div key={post.id} className="py-4">
                                <SerivecesBanner
                                    title={post.title}
                                    paragraph={post.small_description}
                                    src={post.img}
                                    onClick={() => router.push(`/posts/${post.id}`)}
                                />
                            </div>
                        ))}
                    </SwiperDefault>
                )}
            </div>

            <Services />
        </div>
    );
};

export default PopularActivity;