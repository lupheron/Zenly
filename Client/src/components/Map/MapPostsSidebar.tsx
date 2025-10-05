'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPost } from './types'

interface MapPostsSidebarProps {
  posts: MapPost[]
  selectedRegion: string
  isLoading: boolean
}

const MapPostsSidebar: React.FC<MapPostsSidebarProps> = ({
  posts,
  selectedRegion,
  isLoading
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400">★</span>
      )
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400">☆</span>
      )
    }

    const remainingStars = 5 - Math.ceil(rating)
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300">☆</span>
      )
    }

    return stars
  }

  if (isLoading) {
    return (
      <div className='bg-white rounded-lg shadow-lg p-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>
          Posts in {selectedRegion}
        </h3>
        <div className='space-y-4'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='animate-pulse'>
              <div className='bg-gray-200 h-32 rounded-lg mb-3'></div>
              <div className='bg-gray-200 h-4 rounded mb-2'></div>
              <div className='bg-gray-200 h-3 rounded w-3/4'></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-lg p-6 max-h-[600px] overflow-y-auto'>
      <h3 className='text-lg font-semibold text-gray-800 mb-4'>
        {selectedRegion ? `Posts in ${selectedRegion}` : 'Select a region to view posts'}
      </h3>

      {!selectedRegion ? (
        <div className='text-center py-8'>
          <div className='text-gray-400 text-4xl mb-2'>🗺️</div>
          <p className='text-gray-600 text-sm'>
            Choose a region from the dropdown above to see available posts
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className='text-center py-8'>
          <div className='text-gray-400 text-4xl mb-2'>📍</div>
          <p className='text-gray-600 text-sm'>
            No posts found in this region
          </p>
        </div>
      ) : (
        <div className='space-y-4'>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className='block border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-300 transition-all duration-200 cursor-pointer'
            >
              {/* Post Image */}
              <div className='relative h-32 bg-gray-200'>
                {post.img ? (
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, 300px'
                  />
                ) : (
                  <div className='flex items-center justify-center h-full text-gray-400'>
                    <span className='text-2xl'>🏨</span>
                  </div>
                )}
                
                {/* Service Type Badge */}
                <div className='absolute top-2 left-2'>
                  <span className='px-2 py-1 bg-green-600 text-white text-xs rounded-full'>
                    {post.area_type_name}
                  </span>
                </div>
              </div>

              {/* Post Content */}
              <div className='p-3'>
                <h4 className='font-semibold text-gray-800 text-sm mb-1 line-clamp-2'>
                  {post.title}
                </h4>
                
                <p className='text-gray-600 text-xs mb-2 line-clamp-2'>
                  {post.small_description}
                </p>

                {/* Rating */}
                <div className='flex items-center mb-2'>
                  <div className='flex items-center mr-2'>
                    {renderStars(post.avg_rating || 0)}
                  </div>
                  <span className='text-xs text-gray-600'>
                    {post.avg_rating ? post.avg_rating.toFixed(1) : 'No rating'}
                  </span>
                </div>

                {/* Price and Details */}
                <div className='flex items-center justify-between text-xs text-gray-600'>
                  <span className='font-semibold text-green-600'>
                    {formatPrice(post.price_daily)}/day
                  </span>
                  <span>{post.members} guests</span>
                </div>

                {/* Stats */}
                <div className='flex items-center justify-between mt-2 pt-2 border-t border-gray-100'>
                  <div className='flex items-center text-xs text-gray-500'>
                    <span className='mr-3'>👁️ {post.view_count || 0}</span>
                    <span>💬 {post.comment_count || 0}</span>
                  </div>
                  <span className='text-xs text-gray-500'>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {selectedRegion && posts.length > 0 && (
        <div className='mt-4 pt-4 border-t border-gray-200'>
          <Link
            href={`/posts?location=${encodeURIComponent(selectedRegion)}`}
            className='block w-full text-center py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm'
          >
            View All Posts in {selectedRegion}
          </Link>
        </div>
      )}
    </div>
  )
}

export default MapPostsSidebar
