'use client'

import UsersPosts from '@/src/components/Cart/UserPosts'
import Pagination from '@/src/components/pagination/Pagination'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

const UserPosts = () => {
  const { data, isLoading, error } = useUsersPosts()
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6
  const router = useRouter()

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = data?.slice(indexOfFirstPost, indexOfLastPost) || []
  const totalPages = data ? Math.ceil(data.length / postsPerPage) : 1

  return (
    <div>
      <h1 className='text-4xl font-bold tracking-[1px]'>Sizning Postlaringiz</h1>
      <hr className='mt-5' />
      <div className='grid grid-cols-3 gap-2 mt-5'>
        {isLoading && <p>Yuklanmoqda...</p>}
        {error && <p className="text-red-500">Xatolik yuz berdi: {error.message}</p>}
        {data?.length === 0 && !isLoading && <p>Postlar mavjud emas</p>}

        {currentPosts.map((post) => (
          <UsersPosts
            key={post.id}
            src={post.image || "/intro/intro1.jpg"}
            title={post.title}
            description={post.description}
            location={post.location}
            rating={post.id}
            price={post.price_daily}
            onClick={() => router.push(`/user/posts/${post.id}`)}
            customClasses=''
          />
        ))}
      </div>

      {data && data.length > postsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}

export default UserPosts
