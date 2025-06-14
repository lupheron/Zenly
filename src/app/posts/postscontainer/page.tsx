import PostsCart from '@/src/components/Cart/PostsCart'
import React from 'react'

const PostsContainer = () => {
    return (
        <div className='grid grid-cols-2 gap-2 w-[85%]'>
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
    )
}

export default PostsContainer