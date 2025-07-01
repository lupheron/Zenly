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
        <div className='bg-white p-6 rounded-xl shadow-xl w-150 h-80'>
            <h1 className="text-xl font-semibold mb-4">Postlaringizning reytinglari</h1>

            {currentPosts.length === 0 ? (
                <p>Sizda postlar mavjud emas yoki reytinglar topilmadi!</p>
            ) : (
                currentPosts.map((post) => (
                    <div key={post.id} className="border p-4 rounded mb-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-medium">{post.title}</h2>
                            <Rating postId={post.id} userId={user_id} />
                        </div>
                    </div>
                ))
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
    )
}

export default PostsRatingCart