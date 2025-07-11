import React from 'react'
import PageHeader from '../components/PageHeader'
import AboutSection from '../components/About'
import ReadySection from '../components/ReadySection'
import PopularActivity from '../components/PopActivitiy'
import Comments from '../components/Comments'
import PageFooter from '../components/PageFooter'
import NavbarSection from '../components/Navbar/NavbarSection'
import Comment from '../components/LeaveComment/Comment'

const LandingPage = () => {
    return (
        <div className='relative'>
            <Comment />
            <NavbarSection />
            <PageHeader />
            <AboutSection />
            <ReadySection />
            <PopularActivity />
            <Comments />
            <PageFooter />
        </div>
    )
}

export default LandingPage