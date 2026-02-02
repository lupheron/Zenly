import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import SearchPosts from '../search/SearchPosts';
import PostsContainer from './PostsContainer';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Drawer from '@mui/material/Drawer';
import Filter from '../../filters/Filter';
import { useLanguage } from '@/src/contexts/LanguageContext';

interface Post {
    id: number;
    img: string;
    title: string;
    small_description: string;
    location: string;
    price_daily: number;
    members: number;
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
    const [isSearchActive, setIsSearchActive] = useState(false);
    const { t } = useLanguage();

    const searchParams = useSearchParams()
    const areaId = searchParams.get('area_id')

    const fetchPosts = useCallback(async () => {
        let url = ''

        // Check if search is active (all required fields filled)
        const isValidSearch = searchFilters.location && searchFilters.sort && searchFilters.guests;

        if (isValidSearch) {
            // Use filter endpoint when search is active
            const amenitiesParam = selectedAmenities.map(a => `amenities[]=${encodeURIComponent(a)}`).join('&')
            const searchParamParts = []

            searchParamParts.push(`location=${encodeURIComponent(searchFilters.location)}`)
            searchParamParts.push(`sort=${encodeURIComponent(searchFilters.sort)}`)
            searchParamParts.push(`guests=${encodeURIComponent(searchFilters.guests)}`)

            if (areaId) searchParamParts.push(`area_id=${areaId}`)
            if (amenitiesParam) searchParamParts.push(amenitiesParam)

            const paramString = searchParamParts.join('&')
            url = `http://zenlyserver.test/api/posts/filter?${paramString}`
        } else {
            // Use regular posts endpoint when no search or incomplete search
            const searchParamParts = []
            const amenitiesParam = selectedAmenities.map(a => `amenities[]=${encodeURIComponent(a)}`).join('&')

            if (areaId) searchParamParts.push(`area_id=${areaId}`)
            if (amenitiesParam && selectedAmenities.length > 0) searchParamParts.push(amenitiesParam)

            const paramString = searchParamParts.join('&')
            url = paramString
                ? `http://zenlyserver.test/api/posts/filter?${paramString}`
                : `http://zenlyserver.test/api/posts`
        }

        try {
            const res = await fetch(url)
            const data = await res.json()
            setPosts(data.data || [])
        } catch (error) {
            console.error('Postlarni olishda xatolik:', error)
            setPosts([])
        }
    }, [selectedAmenities, areaId, searchFilters])

    useEffect(() => {
        fetchPosts()
    }, [fetchPosts])

    useEffect(() => {
        // Update search active status
        const isValidSearch = Boolean(searchFilters.location && searchFilters.sort && searchFilters.guests);
        setIsSearchActive(isValidSearch);
    }, [searchFilters])

    const handleSearch = (params: { location: string; sort: string; guests: string }) => {
        setSearchFilters(params);
    }

    const toggleMobileFilter = () => {
        setMobileFilterOpen(!mobileFilterOpen);
    };

    return (
        <div>
            <SearchPosts onSearch={handleSearch} />
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
                        <span className="text-md font-medium">{t('post.amenities')}</span>
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