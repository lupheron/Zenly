import PostsCart from '@/src/components/Cart/PostsCart'
import React from 'react'

interface PostsContainerProps {
    posts: any[];
}

const PostsContainer: React.FC<PostsContainerProps> = ({ posts }) => {
    return (
        <div className='grid grid-cols-4 gap-2 w-[85%]'>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostsCart
                        key={post.id}
                        src={post.img}
                        title={post.title}
                        about={post.about}
                        location={post.location}
                        rating={post.id}
                        rateNumber={post.rateNumber}
                        price={post.price}
                        onClick={() => { }}
                        customClasses=''
                    />
                ))
            ) : (
                <p className='col-span-4 text-center'>No posts found.</p>
            )}
        </div>
    )
}

export default PostsContainer
