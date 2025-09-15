import React, { useState } from 'react';
import TitleButtons from '../Button/TitleButtons';
import SwiperDefault from '../Swiper/SwiperDefault';
import CommentCart from '../Cart/CommentCart';
import Image from 'next/image';
import { useWebComments } from '@/src/hooks/comments/useWebComments';
import ReusableModal from '../Modal/ReusableModal';
import WebComment from '../Forms/Comments/WebComment';

const Comments = () => {
    const [openModal, setOpenModal] = useState(false);
    const { data } = useWebComments();

    return (
        <div className="py-20 mt-20 bg-dark-green text-white" id='coments'>
            <div data-aos="fade-top" className="mb-20 flex flex-col text-center items-center px-4">
                <TitleButtons 
                    label="Biz haqimizda fikringiz" 
                    customClasses="text-white bg-orange cursor-pointer hover:bg-orange-600 transition-colors duration-200" 
                    onClick={() => setOpenModal(true)}
                />
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold mt-5 max-w-[800px]">
                    Biz haqimizda mijozlarning fikrlari
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row items-center justify-center gap-10 px-4 md:px-10" data-aos="fade-right">
                <div className="w-full lg:w-1/2 max-w-[800px]">
                    <Image
                        width={600}
                        height={450}
                        src="/comments/comments.jpg"
                        alt="Mijozlar fikrlari"
                        className="rounded-lg object-cover w-full h-full"
                    />
                </div>

                <div className="w-full lg:w-1/2 p-6 md:p-10 max-w-[800px]" data-aos="fade-left">
                    <SwiperDefault
                        slidesPerView={1}
                        spaceBetween={30}
                        className="w-full"
                        autoplay={{ delay: 8000 }}
                        pagination={false}
                    >
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((comment, index) => (
                                <CommentCart
                                    key={index}
                                    comment={comment.comment}
                                    nameTitle={comment.title}
                                    commentor={comment.fullname}
                                />
                            ))
                        ) : (
                            <p className="text-center text-lg">Hozircha hech qanday fikr mavjud emas.</p>
                        )}
                    </SwiperDefault>
                </div>
            </div>
            
            {/* Comment Modal */}
            <ReusableModal
                onClose={() => setOpenModal(false)}
                open={openModal}
                title="Sayt haqida o'z fikringizni qoldiring!"
                width={600}
            >
                <WebComment onSuccess={() => setOpenModal(false)} closeModal={() => setOpenModal(false)} />
            </ReusableModal>
        </div>
    );
};

export default Comments;
