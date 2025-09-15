import React from 'react'
import PageHeader from '../components/PageHeader'
import AboutSection from '../components/About'
import ReadySection from '../components/ReadySection'
import PopularActivity from '../components/PopActivitiy'
import Comments from '../components/Comments'
import PageFooter from '../components/PageFooter'
import NavbarSection from '../components/Navbar/NavbarSection'
import BottomNavigation from '../components/BottomNavigation/BottomNavigation'

const LandingPage = () => {
    return (
        <div className='relative mr-0 pb-20 lg:pb-0'>
            <NavbarSection />
            <PageHeader />
            <AboutSection />
            <ReadySection />
            <PopularActivity />
            <Comments />
            <PageFooter />
            <BottomNavigation />
        </div>
    )
}

export default LandingPage