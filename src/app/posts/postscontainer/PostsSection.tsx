'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchPosts from '../search/SearchPosts';
import Filter from '../../filters/page';
import PostsContainer from './page';

interface Post {
    id: number;
    img: string;
    title: string;
    small_description: string;
    location: string;
    price_daily: number;
}

const PostsSection = () => {
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
    const [posts, setPosts] = useState<Post[]>([])
    const [searchFilters, setSearchFilters] = useState<{ location: string; sort: string; guests: string }>({
        location: '',
        sort: '',
        guests: ''
    });

    const searchParams = useSearchParams()
    const areaId = searchParams.get('area_id')

    const fetchPosts = async () => {
        let url = ''

        const amenitiesParam = selectedAmenities.map(a => `amenities[]=${encodeURIComponent(a)}`).join('&')
        const searchParamParts = []

        if (searchFilters.location) searchParamParts.push(`location=${searchFilters.location}`)
        if (searchFilters.sort) searchParamParts.push(`sort=${searchFilters.sort}`)
        if (searchFilters.guests) searchParamParts.push(`guests=${searchFilters.guests}`)
        if (areaId) searchParamParts.push(`area_id=${areaId}`)
        if (amenitiesParam) searchParamParts.push(amenitiesParam)

        const paramString = searchParamParts.join('&')

        if (paramString) {
            url = `http://zenlyserver.test/api/posts/filter?${paramString}`
        } else {
            url = `http://zenlyserver.test/api/posts`
        }

        const res = await fetch(url)
        const data = await res.json()
        setPosts(data.data)
    }

    useEffect(() => {
        fetchPosts()
    }, [selectedAmenities, areaId, searchFilters])

    return (
        <div>
            <SearchPosts onSearch={(params) => setSearchFilters(params)} />
            <div className="flex justify-between items-start gap-10 p-5 mt-10 bg-light-gray">
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
