import React from 'react'
import TitleButtons from '../Button/TitleButtons'
import SwiperDefault from '../Swiper/SwiperDefault'
import CommentCart from '../Cart/CommentCart'
import Image from 'next/image'

const Comments = () => {
    const comments = [
        {
            comTitle: "Ajoyib tajriba!",
            comment: "Bu sayohat mening hayotimdagi eng yaxshi tajribalardan biri edi. Ajoyib tabiat manzaralari, qulay transport va ajoyib mehmonxona xizmatlari. Yo'lboshchilarimiz juda bilimdon va har bir sayyohga alohida e'tibor berishdi. Kelgusi yilda yana shu guruh bilan safar qilishni istayman!",
            nameTitle: "Azizbek Q."
        },
        {
            comTitle: "Tavsiya etaman",
            comment: "Oilam bilan birinchi marta qilgan sayohatimizda juda ko'p yaxshi taassurotlar qoldirdi. Bolalar uchun maxsus dasturlar tashkil etilgani, toza xonalar va mazali milliy taomlar hammasini juda yoqdi. Xavfsizlik va qulaylik yuqori darajada edi. Rahmat!",
            nameTitle: "Dilfuza R."
        },
        {
            comTitle: "Zor xizmat",
            comment: "Professional jamoa tomonidan mukammal tashkil etilgan sayohat. Har bir kun yangi va qiziqarli tajribalar bilan to'ldirilgan. Transport, ovqatlanish va ko'rgazma joylarida hech qanday muammo bo'lmadi. Tanishlarimga ham sizni tavsiya qilgan bo'lardim!",
            nameTitle: "Shoxruh M."
        },
        {
            comTitle: "Hayotiy sayohat",
            comment: "10 kunlik bu safar mening hayotimdagi eng esda qolarli voqealaridan biriga aylandi. Har bir detal mukammal o'ylab topilgan, yo'lboshchilarimiz esa har qanday savolimizga javob berishdi. Tabiatning go'zalligi esa alohida taassurot qoldirdi!",
            nameTitle: "Malika T."
        },
        {
            comTitle: "Mukammal tashkilot",
            comment: "Ishim tufayli ko'p sayohat qilganman, lekin bu safar alohida edi. Vaqt rejasi aniq bajarildi, barcha obro'li joylarga borib chiqdik. Mehmonxonalar toza va qulay edi. Xizmat sifatiga ijobiy baho qo'yaman!",
            nameTitle: "Javlon K."
        }
    ];

    return (
        <div className='py-20 mt-20 bg-dark-green text-white'>
            <div
                data-aos="fade-top"
                className='mb-20 flex flex-col text-center items-center'
            >
                <TitleButtons label='Biz haqimizdagi fikrlar' customClasses='text-white bg-orange' />
                <h1 className='text-6xl font-semibold mt-5'>Biz haqimizda mijozlarning fikrlari</h1>
            </div>

            <div className='flex items-center justify-center gap-10 px-10' data-aos="fade-right">
                <div className='w-1/2'>
                    <Image
                        width={600}
                        height={450}
                        src="/comments/comments.jpg"
                        alt='Mijozlar fikrlari'
                        className='rounded-lg object-cover w-full h-full'
                    />
                </div>

                <div className='w-1/2 p-10 rounded-lg' data-aos="fade-left">
                    <SwiperDefault
                        slidesPerView={1}
                        spaceBetween={30}
                        className='w-full'
                        autoplay={{ delay: 8000 }}
                        pagination={false}
                    >
                        {comments.map((comment, index) => (
                            <CommentCart
                                key={index}
                                comTitle={comment.comTitle}
                                comment={comment.comment}
                                nameTitle={comment.nameTitle}
                            />
                        ))}
                    </SwiperDefault>
                </div>
            </div>
        </div>
    )
}

export default Comments