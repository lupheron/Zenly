import React from 'react'
import PageHeader from '../components/PageHeader'
import AboutSection from '../components/About'
import GuideDriverSection from '../components/GuideDriverSection'
import PopularActivity from '../components/PopActivitiy'
import Comments from '../components/Comments'
import PageFooter from '../components/PageFooter'
import NavbarSection from '../components/Navbar/NavbarSection'
import BottomNavigation from '../components/BottomNavigation/BottomNavigation'
import MapMain from '../components/Map'

const LandingPage = () => {
    return (
        <div className='relative mr-0 pb-20 lg:pb-0'>
            <NavbarSection />
            <PageHeader />
            <AboutSection />
            <GuideDriverSection />
            <PopularActivity />
            <MapMain />
            <Comments />
            <PageFooter />
            <BottomNavigation />
        </div>
    )
}

export default LandingPage