'use client'

import UsersPosts from '@/src/components/Cart/UserPosts'
import Pagination from '@/src/components/pagination/Pagination'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ButtonDefault from '@/src/components/Button/ButtonDefault'

const UserPosts = () => {
  const [userId, setUserId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6
  const router = useRouter()

  const { data, isLoading, error, refetch } = useUsersPosts(userId ?? 0)

  useEffect(() => {
    const user = localStorage.getItem("user_id")
    if (user) setUserId(Number(user))
  }, [])

  const posts = Array.isArray(data) ? data : []
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h1 className='text-4xl font-bold tracking-[1px]'>Sizning Postlaringiz</h1>
        <ButtonDefault
          label='Yangi Post Joylash'
          onClick={() => router.push('/user/posts/create')}
        />
      </div>
      <hr className='mt-5' />

      {isLoading && <p>Yuklanmoqda...</p>}
      {error && <p className="text-red-500">Olishda xatolik yuz berdi.</p>}
      {!isLoading && !error && posts.length === 0 && <p>Postlar mavjud emas</p>}

      {!isLoading && !error && posts.length > 0 && (
        <>
          <div className='grid grid-cols-3 gap-2 mt-5'>
            {currentPosts.map((post) => (
              <UsersPosts
                key={post.id}
                src={post.img}
                title={post.title}
                description={post.description}
                location={post.location}
                rating={post.id}
                price={post.price_daily}
                onClick={() => router.push(`/user/posts/${post.id}`)}
                postOwnerId={post.user_id} // assuming your post has user_id field
                postId={post.id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  )
}

export default UserPosts