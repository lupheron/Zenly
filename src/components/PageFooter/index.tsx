import React from 'react';
import Contact from '../ContactSection/Contact';
import Image from 'next/image';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import SocialMediaButton from '../Button/SocialMediaButton';

const smData = [
    {
        icon: <InstagramIcon sx={{ fontSize: 22 }} />,
        onClick: () => { window.open('https://instagram.com', '_blank'); }
    },
    {
        icon: <FacebookIcon sx={{ fontSize: 22 }} />,
        onClick: () => { window.open('https://facebook.com', '_blank'); }
    },
    {
        icon: <LinkedInIcon sx={{ fontSize: 22 }} />,
        onClick: () => { window.open('https://linkedin.com', '_blank'); }
    },
    {
        icon: <XIcon sx={{ fontSize: 22 }} />,
        onClick: () => { window.open('https://twitter.com', '_blank'); }
    }
];

const footerList = [
    { id: 1, data: "Call center" },
    { id: 2, data: "Terms" },
    { id: 3, data: "Privacy&Policy" }
];

const PageFooter = () => {
    return (
        <div>
            <Contact />

            <div className='flex justify-between items-start w-full py-20 px-85 bg-light-gray mt-20'>
                <div className='flex flex-col justify-between w-130'>
                    <Image
                        width={200}
                        height={200}
                        src="/logo/black-logo-text.png"
                        alt="Zenly Logo"
                    />
                    <p className='text-xl mt-[-50px]'>
                        Zenly — tabiat qo‘ynida hordiq chiqarish joylari va hashamatli maskanlar toping.
                    </p>
                    <div className="flex gap-10 mt-10">
                        {smData.map((item, index) => (
                            <SocialMediaButton
                                key={index}
                                icon={item.icon}
                                onClick={item.onClick}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-10">
                    <h2 className='text-4xl mb-3 font-semibold'>Support</h2>
                    <ul>
                        {footerList.map((item) => (
                            <li key={item.id} className='mt-3 text-xl'>{item.data}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PageFooter;