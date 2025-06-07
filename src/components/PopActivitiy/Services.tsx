import React from 'react'
import ServicesCart from '../Cart/ServicesCart'
import GppGoodIcon from '@mui/icons-material/GppGood';
import CompassCalibrationIcon from '@mui/icons-material/CompassCalibration';
import PhishingIcon from '@mui/icons-material/Phishing';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import PoolIcon from '@mui/icons-material/Pool';

const Services = () => {
    const services = [
        {
            icon: <GppGoodIcon fontSize="large" />,
            title: "Eng yaxshi xavfsizlik",
            paragraph: "Sizning tinchingiz uchun 24/7 kuzatiladigan xavfsizlik."
        },
        {
            icon: <CompassCalibrationIcon fontSize="large" />,
            title: "Bepul Internet",
            paragraph: "Tabiat quchog'ida tez internet bilan bog'laning."
        },
        {
            icon: <PoolIcon fontSize="large" />,
            title: "Suzish",
            paragraph: "Ochiq osmon ostida toza suvda yangilaning."
        },
        {
            icon: <DirectionsBikeIcon fontSize="large" />,
            title: "Tog' velosipedi",
            paragraph: "Tabiat ichida sayr qilish uchun manzarali yo'llar."
        },
        {
            icon: <PhishingIcon fontSize="large" />,
            title: "Baliq ovlash",
            paragraph: "Tinch joylarda ilgak tashlab dam oling."
        },
        {
            icon: <SelfImprovementIcon fontSize="large" />,
            title: "JIM va Yoga",
            paragraph: "Tana va ruhni uyg'unlashtirish uchun tinichlik darslari."
        }
    ]

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 px-85'>
            {services.map((service, index) => (
                <ServicesCart
                    key={index}
                    icon={service.icon}
                    title={service.title}
                    paragraph={service.paragraph}
                />
            ))}
        </div>
    )
}

export default Services