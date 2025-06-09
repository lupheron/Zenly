"use client"
import React from 'react'
import SearchPosts from './search/SearchPosts'
import NavbarSection from '@/src/components/Navbar/NavbarSection'

const PostsSection = () => {
    return (
        <div>
            <NavbarSection />
            <SearchPosts />
        </div>
    )
}

export default PostsSection