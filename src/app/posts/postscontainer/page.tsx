import PostsCart from '@/src/components/Cart/PostsCart'
import React from 'react'
import Filter from '../../filters/page'

const PostsContainer = () => {
    return (
        <div className='flex justify-between bg-light-gray mt-10 p-5'>
            <div>
                <Filter />
            </div>
            <div className='grid grid-cols-3'>
                <PostsCart
                    src="/intro/intro1.jpg" // Replace with your backend image URL
                    title="Modern Apartment in Tashkent"
                    about="A beautiful, well-located apartment near the city center with all modern facilities."
                    location="Tashkent, Uzbekistan"
                    rating={4.5}
                    rateNumber={3465}
                    price={120}
                    onClick={() => { }}
                    customClasses=''
                />
            </div>
        </div>
    )
}

export default PostsContainer