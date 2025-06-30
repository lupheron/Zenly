'use client'

import UsersPosts from '@/src/components/Cart/UserPosts'
import Pagination from '@/src/components/pagination/Pagination'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ButtonDefault from '@/src/components/Button/ButtonDefault'

const UserPosts = () => {
  const [userId, setUserId] = useState<number>(0)
  const { data, isLoading, error } = useUsersPosts(userId)  
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("user_id")
    setUserId(user ? Number(user) : 0)
  }, [])

  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = data?.slice(indexOfFirstPost, indexOfLastPost) || []
  const totalPages = data ? Math.ceil(data.length / postsPerPage) : 1

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
      <div className='grid grid-cols-3 gap-2 mt-5'>
        {isLoading && <p>Yuklanmoqda...</p>}
        {error && <p className="text-red-500">Xatolik yuz berdi: {error.message}</p>}
        {data?.length === 0 && !isLoading && <p>Postlar mavjud emas</p>}

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