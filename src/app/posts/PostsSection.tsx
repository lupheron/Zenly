'use client'

import React, { useState, useEffect } from 'react'
import SearchPosts from './search/SearchPosts'
import NavbarSection from '@/src/components/Navbar/NavbarSection'
import PostsContainer from './postscontainer/page'
import Filter from '../filters/page'
import { useSearchParams } from 'next/navigation'

const PostsSection = () => {
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [posts, setPosts] = useState<any[]>([])
    const searchParams = useSearchParams()

    const areaId = searchParams.get('area_id')

    useEffect(() => {
        const fetchPosts = async () => {
            let url = ''
            if (selectedAmenities.length === 0 && !areaId) {
                url = 'http://zenlyserver.test/api/posts'
            } else if (selectedAmenities.length === 0 && areaId) {
                url = `http://zenlyserver.test/api/posts?area_id=${areaId}`
            } else if (selectedAmenities.length > 0 && areaId) {
                const params = selectedAmenities.map(a => `amenities[]=${encodeURIComponent(a)}`).join('&')
                url = `http://zenlyserver.test/api/posts/filter?area_id=${areaId}&${params}`
            } else {
                const params = selectedAmenities.map(a => `amenities[]=${encodeURIComponent(a)}`).join('&')
                url = `http://zenlyserver.test/api/posts/filter?${params}`
            }

            const res = await fetch(url)
            const data = await res.json()
            setPosts(data.data)
        }

        fetchPosts()
    }, [selectedAmenities, areaId])

    return (
        <div>
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
