import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchPosts from '../search/SearchPosts';
import PostsContainer from './page';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Drawer from '@mui/material/Drawer';
import Filter from '../../filters/Filter';

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
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [searchFilters, setSearchFilters] = useState<{ location: string; sort: string; guests: string }>({
        location: '',
        sort: '',
        guests: ''
    });

    const searchParams = useSearchParams()
    const areaId = searchParams.get('area_id')

    const fetchPosts = useCallback(async () => {
        let url = ''

        const amenitiesParam = selectedAmenities.map(a => `amenities[]=${encodeURIComponent(a)}`).join('&')
        const searchParamParts = []

        if (searchFilters.location) searchParamParts.push(`location=${searchFilters.location}`)
        if (searchFilters.sort) searchParamParts.push(`sort=${searchFilters.sort}`)
        if (searchFilters.guests) searchParamParts.push(`guests=${searchFilters.guests}`)
        if (areaId) searchParamParts.push(`area_id=${areaId}`)
        if (amenitiesParam) searchParamParts.push(amenitiesParam)

        const paramString = searchParamParts.join('&')

        url = paramString
            ? `http://zenlyserver.test/api/posts/filter?${paramString}`
            : `http://zenlyserver.test/api/posts`

        const res = await fetch(url)
        const data = await res.json()
        setPosts(data.data)
    }, [selectedAmenities, areaId, searchFilters])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    const toggleMobileFilter = () => {
        setMobileFilterOpen(!mobileFilterOpen);
    };

    return (
        <div>
            <SearchPosts onSearch={(params) => setSearchFilters(params)} />

            <div className="flex flex-col lg:flex-row justify-between items-start gap-6 lg:gap-10 p-4 lg:p-5 mt-6 lg:mt-10 bg-light-gray">

                <Filter
                    selectedAmenities={selectedAmenities}
                    onAmenitiesChange={setSelectedAmenities}
                    customClasses="hidden lg:block"
                />

                <div className="block lg:hidden mx-auto w-[90%] mb-4">
                    <button
                        onClick={toggleMobileFilter}
                        className="w-full h-15 flex items-center justify-center gap-3 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                        <AutoAwesomeIcon className="text-blue-600" />
                        <span className="text-md font-medium">Imkoniyatlar</span>
                    </button>

                    <Drawer
                        anchor="right"
                        open={mobileFilterOpen}
                        onClose={toggleMobileFilter}
                        PaperProps={{
                            sx: {
                                width: '80%',
                                maxWidth: 320,
                                padding: '20px'
                            }
                        }}
                    >
                        <Filter
                            selectedAmenities={selectedAmenities}
                            onAmenitiesChange={setSelectedAmenities}
                        />
                    </Drawer>
                </div>

                <PostsContainer posts={posts} />
            </div>
        </div>

    )
}

export default PostsSection