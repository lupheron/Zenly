import React from 'react'
import NavbarSection from '../Navbar/NavbarSection'
import IntroSection from './IntroSection'

const PageHeader = () => {
    return (
        <div className='bg-dark-green'>
            <NavbarSection />
            <IntroSection />
        </div>
    )
}

export default PageHeader