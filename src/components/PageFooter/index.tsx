import React from 'react'
import Contact from '../ContactSection/Contact'
import Image from 'next/image'
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import SocialMediaButton from '../Button/SocialMediaButton';

const smData = [
    {
        icon: <InstagramIcon sx={{ fontSize: 22}}/>,
        onClick: () => { window.open('https://instagram.com', '_blank') }
    },
    {
        icon: <FacebookIcon sx={{ fontSize: 22}}/>,
        onClick: () => { window.open('https://facebook.com', '_blank') }
    },
    {
        icon: <LinkedInIcon sx={{ fontSize: 22}}/>,
        onClick: () => { window.open('https://linkedin.com', '_blank') }
    },
    {
        icon: <XIcon sx={{ fontSize: 22}}/>,
        onClick: () => { window.open('https://twitter.com', '_blank') }
    }
]


const PageFooter = () => {
    return (
        <div>
            <Contact />

            <div className='w-full py-20 px-40 bg-light-gray mt-20'>
                <div>
                    <Image
                        width={150}
                        height={150}
                        src="/logo/black-logo-with-text.png"
                        alt=''
                    />
                    <p className='text-2xl'>Zenly — tabiat qo‘ynida hordiq chiqarish joylari va hashamatli maskanlar toping.</p>
                    <div className="flex gap-2 mt-10">
                        {smData.map((item, index) => (
                            <SocialMediaButton
                                key={index}
                                icon={item.icon}
                                onClick={item.onClick}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PageFooter