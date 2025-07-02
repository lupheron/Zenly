import React from 'react'
import Breadcrumb from '../BreadCrumb/Breadcrumb'
import NavbarSection from '../Navbar/NavbarSection'

const MainContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <NavbarSection />
            <div className="p-5">
                <Breadcrumb />
                {children}
            </div>
        </div>
    )
}

export default MainContainer
