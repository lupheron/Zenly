"use client"
import React, { useState, useEffect } from 'react'
import SearchPosts from './search/SearchPosts'
import NavbarSection from '@/src/components/Navbar/NavbarSection'
import PostsContainer from './postscontainer/page'
import Filter from '../filters/page'

const PostsSection = () => {
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [posts, setPosts] = useState<any[]>([])

    useEffect(() => {
        const fetchPosts = async () => {
            let url = ''
            if (selectedAmenities.length === 0) {
                // Fetch all posts if no amenities selected
                url = 'http://zenlyserver.test/api/posts'
            } else {
                // Fetch filtered posts
                const params = selectedAmenities.map(a => `amenities[]=${encodeURIComponent(a)}`).join('&')
                url = `http://zenlyserver.test/api/posts/filter?${params}`
            }
            const res = await fetch(url)
            const data = await res.json()
            setPosts(data.data)
        }

        fetchPosts()
    }, [selectedAmenities])

    return (
        <div>
            <NavbarSection />
            <SearchPosts />
            <div className='flex justify-between items-start gap-10 p-5 mt-10 bg-light-gray'>
                <Filter
                    selectedAmenities={selectedAmenities}
                    onAmenitiesChange={setSelectedAmenities}
                />
                <PostsContainer posts={posts} />
            </div>
        </div>
    )
}

export default PostsSection