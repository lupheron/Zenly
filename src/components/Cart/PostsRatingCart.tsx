'use client'

import React from 'react'
import Rating from '../Rating/Rating'
import { usePosts } from '@/src/hooks/posts/usePosts'

const PostsRatingCart = () => {
    const { data: posts, isLoading, error } = usePosts()

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !posts) return <p>Xatolik yuz berdi</p>

    return (
        <div className='bg-white p-6 rounded-xl shadow-xl w-150'>
            <h1 className="text-xl font-semibold mb-4">Postlarning reytinglari</h1>

            {posts.map((post) => (
                <div key={post.id} className="border p-4 rounded mb-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">{post.title}</h2>
                        <Rating postId={post.id} />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PostsRatingCart
