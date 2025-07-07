'use client'

import PostsCart from '@/src/components/Cart/PostsCart'
import { useRouter } from 'next/navigation';
import React from 'react'

interface Post {
    id: number;
    img: string;
    title: string;
    small_description: string;
    location: string;
    price_daily: number;
}

interface PostsContainerProps {
    posts: Post[];
}

const PostsContainer: React.FC<PostsContainerProps> = ({ posts }) => {
    const router = useRouter()
    return (
        <div className="w-full sm:px-6 max-w-[90%] sm:max-w-[85%] md:max-w-[100%] lg:max-w-[75%] xl:max-w-[70%] mx-auto">
            <div className='grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-2 gap-4 md:gap-6 w-full max-w-screen-2xl mx-auto'>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id} className='w-full h-full'>
                            <PostsCart
                                src={post.img}
                                title={post.title}
                                small_description={post.small_description}
                                location={post.location}
                                rating={post.id}
                                price_daily={post.price_daily}
                                onClick={() => router.push(`/posts/${post.id}`)}
                                postId={post.id}
                                customClasses='w-full h-full'
                            />
                        </div>
                    ))
                ) : (
                    <div className='col-span-full py-10'>
                        <p className='text-center text-red-900 font-bold text-lg md:text-xl lg:text-2xl tracking-[1px]'>
                            Bu turdagi dam olish maskanlari hali mavjud emas!
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostsContainer