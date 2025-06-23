'use client'

import UsersPosts from '@/src/components/Cart/UserPosts'
import { useUsersPosts } from '@/src/hooks/posts/useUsersPosts'
import React from 'react'

const UserPosts = () => {
  const { data, isLoading, error } = useUsersPosts()

  return (
    <div>
      <h1 className='text-4xl font-bold tracking-[1px]'>Sizning Postlaringiz</h1>
      <hr className='mt-5' />
      <div className='grid grid-cols-4 gap-2 w-[85%] mt-5'>
        {isLoading && <p>Yuklanmoqda...</p>}
        {error && <p className="text-red-500">Xatolik yuz berdi: {error.message}</p>}
        {data?.length === 0 && !isLoading && <p>Postlar mavjud emas</p>}

        {data?.map((post) => (
          <UsersPosts
            key={post.id}
            src={post.image || "/intro/intro1.jpg"}
            title={post.title}
            description={post.description}
            location={post.location}
            rating={post.id}
            price={post.price_daily}
            onClick={() => { }}
            customClasses=''
          />
        ))}
      </div>
    </div>
  )
}

export default UserPosts
