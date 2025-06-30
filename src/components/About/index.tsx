import React from 'react'
import AboutBanner from '../Banners/AboutBanner'
import TitleButtons from '../Button/TitleButtons';
import { useRouter } from 'next/navigation';

const banners = [
    { id: 1, title: 'Plyajdagi dam olish', paragraph: 'Yumshoq qum, mayin to‘lqinlar va to‘liq xotirjamlik.', img: "/about/beach.jpg" },
    { id: 2, title: 'Wellness maskanlari', paragraph: 'Yoga, meditatsiya va spa xizmatlari.', img: "/about/wellness.jpg" },
    { id: 3, title: 'Kabina zonalari', paragraph: 'Tabiat qo‘ynida mashinangizni to‘xtatib, xotirjam dam oling.', img: "/about/cabine.jpg" },
    { id: 4, title: 'Eko sayohatlar', paragraph: 'Tabiiy go‘zalliklarni o‘rganing va atrof-muhitni asrang.', img: "/about/eco.jpg" },
];

const AboutSection = () => {
    const router = useRouter()
    return (
        <div className='mt-25'>
            <div className='w-[60%] mx-auto flex flex-col items-center justify-between gap-5 px-25' data-aos="fade-down">
                <TitleButtons label='Biz haqimizda' customClasses='text-green-700 bg-green-50' />
                <h1 className='text-[38px] font-semibold text-center'>Biz bilan shaharning shovqin-suronidan uzoqlashish uchun eng ideal dam olish joyini kashf eting.</h1>
                <p className='text-center leading-[30px]'>Zenly – bu shahar tashqarisidagi osoyishta dam olish joylariga yo‘l. Siz kamping, sog‘lomlashtiruvchi dam olish maskanlari yoki plyaj bo‘yidagi joylarni izlayapsizmi – Zenly sizga tabiatga boy maskanlarni topish, bron qilish va lazzatlanishda yordam beradi. Do‘stlaringiz, oilangiz yoki yolg‘iz o‘zingiz bilan ajoyib xotiralar yarating.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-18 px-4" data-aos="fade-up">
                {banners.map((banner) => (
                    <div key={banner.id} className="w-full md:w-[45%] lg:w-[22%] mb-6 cursor-pointer" onClick={() => router.push(`/posts?area_id=${banner.id}`)}>
                        <AboutBanner title={banner.title} paragraph={banner.paragraph} img={banner.img} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AboutSection