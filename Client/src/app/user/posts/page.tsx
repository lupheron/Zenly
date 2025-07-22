'use client'

import UsersPosts from '@/src/components/Cart/UserPosts'
import Pagination from '@/src/components/pagination/Pagination'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ButtonDefault from '@/src/components/Button/ButtonDefault'
import Loader from '../../../components/Loader/Loader'

const UserPosts = () => {
  const [userId, setUserId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6
  const router = useRouter()

  const { data, isLoading, error } = useUsersPosts(userId ?? 0)

  useEffect(() => {
    const user = localStorage.getItem("user_id")
    if (user) setUserId(Number(user))

    const savedPage = sessionStorage.getItem('user_posts_page')
    if (savedPage) setCurrentPage(Number(savedPage))
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    sessionStorage.setItem('user_posts_page', String(page))
  }

  const posts = Array.isArray(data) ? data : []
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost)

  if (isLoading) {
    return <Loader />
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold tracking-[1px]'>Sizning Postlaringiz</h1>
        <ButtonDefault
          label='Yangi Post Joylash'
          onClick={() => router.push('/user/posts/create')}
        />
      </div>
      <hr className='mt-5' />

      {error && <p className="text-red-500">Olishda xatolik yuz berdi.</p>}
      {!error && posts.length === 0 && <p>Postlar mavjud emas</p>}

      {!error && posts.length > 0 && (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 mt-5'>
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
                postId={post.id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export default UserPosts