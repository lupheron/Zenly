import React from 'react';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';

const data = [
    {
        title: "Telefon Raqam",
        icon: PhoneIcon,
        info: "+998 (50) 883-99-11"
    },
    {
        title: "Manzil",
        icon: BusinessIcon,
        info: "O'zbekiston, Samarqand"
    },
    {
        title: "Email",
        icon: EmailIcon,
        info: "nuriddinovsuxrob27@gmail.com"
    }
];

const Contact = () => {
    return (
        <div className="flex flex-col items-center mt-20 px-4 text-center">
            <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                data-aos="fade-down"
            >
                Biz Bilan Bog&apos;lanish
            </h1>

            <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-8 md:gap-24 mt-10">
                {data.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="text-center"
                            data-aos="fade-up"
                            data-aos-delay={index * 150}
                        >
                            <h2 className="text-xl sm:text-2xl font-semibold mb-2">{item.title}</h2>
                            <div className="flex items-center justify-center gap-2 mt-2">
                                <Icon />
                                <p className="text-lg">{item.info}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Contact;
