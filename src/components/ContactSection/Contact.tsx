import React from 'react'
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';

let data = [
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
        <div className='flex flex-col items-center mt-30'>
            <h1 className="text-5xl font-bold mb-6">Biz Bilan Bog'lanish</h1>

            <div className='flex items-center justify-between gap-45 mt-10'>
                {data.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div key={index} className="mb-4">
                            <h2 className="text-2xl font-semibold">{item.title}</h2>
                            <div className='flex items-center gap-3 mt-3'>
                                <Icon />
                                <p className='text-xl'>{item.info}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Contact;
