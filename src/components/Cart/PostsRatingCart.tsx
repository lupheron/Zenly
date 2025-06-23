'use client'

import React, { useState } from 'react'
import Rating from '../Rating/Rating'
import { usePosts } from '@/src/hooks/posts/usePosts'
import Pagination from '../pagination/Pagination'

const PostsRatingCart = () => {
    const { data: posts, isLoading, error } = usePosts()
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 3

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !posts) return <p>Xatolik yuz berdi</p>

    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)
    const totalPages = Math.ceil(posts.length / postsPerPage)

    return (
        <div className='bg-white p-6 rounded-xl shadow-xl w-150'>
            <h1 className="text-xl font-semibold mb-4">Postlarning reytinglari</h1>

            {currentPosts.map((post) => (
                <div key={post.id} className="border p-4 rounded mb-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-medium">{post.title}</h2>
                        <Rating postId={post.id} />
                    </div>
                </div>
            ))}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    )
}

export default PostsRatingCart
