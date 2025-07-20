'use client'

import React, { useState } from 'react'
import Rating from '../Rating/Rating'
import { usePosts } from '@/src/hooks/posts/usePosts'
import Pagination from '../pagination/Pagination'

const PostsRatingCart = () => {
    const { data: posts, isLoading, error } = usePosts()
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 3
    const user_id = typeof window !== "undefined" ? localStorage.getItem("user_id") : null

    if (isLoading) return <p>Yuklanmoqda...</p>
    if (error || !posts) return <p>Xatolik yuz berdi</p>

    // Filter posts where post.user_id matches the current user_id
    const userPosts = posts.filter((post) => String(post.user_id) === String(user_id))

    const indexOfLastPost = currentPage * postsPerPage
    const indexOfFirstPost = indexOfLastPost - postsPerPage
    const currentPosts = userPosts.slice(indexOfFirstPost, indexOfLastPost)
    const totalPages = Math.ceil(userPosts.length / postsPerPage)

    return (
        <div className='bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full h-full'>
            <h1 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Postlaringizning reytinglari</h1>

            {currentPosts.length === 0 ? (
                <p className="text-sm sm:text-base text-gray-500">Sizda postlar mavjud emas!</p>
            ) : (
                <div className="space-y-3 sm:space-y-4">
                    {currentPosts.map((post) => (
                        <div key={post.id} className="border border-gray-200 p-3 sm:p-4 rounded-lg">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                                <h2 className="text-sm sm:text-base lg:text-lg font-medium">{post.title}</h2>
                                <Rating postId={post.id} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="mt-4 sm:mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            )}
        </div>
    )
}

export default PostsRatingCart