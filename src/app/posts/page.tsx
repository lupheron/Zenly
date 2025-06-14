"use client"
import React from 'react'
import SearchPosts from './search/SearchPosts'
import NavbarSection from '@/src/components/Navbar/NavbarSection'
import PostsContainer from './postscontainer/page'
import Filter from '../filters/page'

const PostsSection = () => {
    return (
        <div>
            <NavbarSection />
            <SearchPosts />
            <div className='flex justify-between items-start gap-10 p-5 mt-10 bg-light-gray'>
                <Filter />
                <PostsContainer />
            </div>
        </div>
    )
}

export default PostsSection