import BookingForm from '@/src/components/Forms/BookingForm'
import React from 'react'

interface SearchPostsProps {
    onSearch: (params: { location: string; sort: string; guests: string }) => void;
}

const SearchPosts: React.FC<SearchPostsProps> = ({ onSearch }) => {
    return (
        <div className="mt-10">
            <BookingForm onSearch={onSearch} />
        </div>
    );
};

export default SearchPosts;
