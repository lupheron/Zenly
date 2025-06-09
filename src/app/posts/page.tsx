"use client"
import React from 'react'
import SearchPosts from './search/SearchPosts'
import NavbarSection from '@/src/components/Navbar/NavbarSection'
import PostsContainer from './postscontainer/page'

const PostsSection = () => {
    return (
        <div>
            <NavbarSection />
            <SearchPosts />
            <PostsContainer />
        </div>
    )
}

export default PostsSection