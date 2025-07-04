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
        <div className='grid grid-cols-4 gap-2 w-[85%]'>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <PostsCart
                        key={post.id}
                        src={post.img}
                        title={post.title}
                        small_description={post.small_description}
                        location={post.location}
                        rating={post.id}
                        price_daily={post.price_daily}
                        onClick={() => router.push(`/posts/${post.id}`)}
                        postId={post.id}
                        customClasses=''
                    />
                ))
            ) : (
                <p className='col-span-4 text-center text-red-900 font-bold text-2xl tracking-[1px]'>
                    Bu turdagi dam olish maskanlari hali mavjud emas!
                </p>
            )}
        </div>
    )
}

export default PostsContainer
