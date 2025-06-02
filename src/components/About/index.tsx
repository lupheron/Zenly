import React from 'react'
import AboutBanner from '../Banners/AboutBanner'

const banners = [
    {
        title: 'Plyajdagi dam olish',
        paragraph: 'Yumshoq qum, mayin to‘lqinlar va to‘liq xotirjamlik.',
        img: "/about/beach.jpg",
    },
    {
        title: 'Wellness maskanlari',
        paragraph: 'Yoga, meditatsiya va spa xizmatlari.',
        img: "/about/wellness.jpg",
    },
    {
        title: 'Vanlife zonalari',
        paragraph: 'Tabiyat qo‘ynida mashinangizni to‘xtatib, xotirjam dam oling.',
        img: "/about/van.jpg",
    },
    {
        title: 'Eko sayohatlar',
        paragraph: 'Tabiiy go‘zalliklarni o‘rganing va atrof-muhitni asrang.',
        img: "/about/eco.jpg",
    },
];

const AboutSection = () => {
    return (
        <div className='mt-25'>
            <div className='w-[60%] mx-auto flex flex-col items-center justify-between gap-5 px-25'>
                <div className='w-50 h-10 rounded flex justify-center items-center bg-green-50 text-dark-green'>
                    <p className='text-green-700'>About Company</p>
                </div>
                <h1 className='text-[38px] font-semibold text-center'>Biz bilan shaharning shovqin-suronidan uzoqlashish uchun eng ideal dam olish joyini kashf eting.</h1>
                <p className='text-center leading-[30px]'>Zenly – bu shahar tashqarisidagi osoyishta dam olish joylariga yo‘l. Siz kamping, sog‘lomlashtiruvchi dam olish maskanlari yoki plyaj bo‘yidagi joylarni izlayapsizmi – Zenly sizga tabiatga boy maskanlarni topish, bron qilish va lazzatlanishda yordam beradi. Do‘stlaringiz, oilangiz yoki yolg‘iz o‘zingiz bilan ajoyib xotiralar yarating.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 mt-18 px-4">
                {banners.map((banner, index) => (
                    <div key={index} className="w-full md:w-[45%] lg:w-[22%] mb-6">
                        <AboutBanner
                            title={banner.title}
                            paragraph={banner.paragraph}
                            img={banner.img}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AboutSection