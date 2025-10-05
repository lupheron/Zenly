'use client'

import React, { useEffect, useState } from 'react'
import { MapPost } from './types'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

interface InteractiveMapProps {
  posts: MapPost[]
  selectedRegion: string
  isLoading: boolean
  onBoundsChange: (bounds: { north: number; south: number; east: number; west: number }) => void
}

// Service type colors
const getServiceColor = (areaTypeName: string) => {
  const colors: { [key: string]: string } = {
    'Monuments': '#FF6B6B', // Red
    'Restaurants': '#4ECDC4', // Teal
    'Guest Houses': '#45B7D1', // Blue
    'Eco Travel Zones': '#96CEB4', // Green
    'Hotels': '#FFEAA7', // Yellow
    'Resorts': '#DDA0DD', // Plum
  }
  return colors[areaTypeName] || '#95A5A6' // Default gray
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  posts,
  selectedRegion,
  isLoading,
  onBoundsChange
}) => {
  const [showGoogleMaps, setShowGoogleMaps] = useState(false)

  // Simple fallback map component
  const SimpleMapFallback = () => (
    <div className='w-full h-96 lg:h-[500px] bg-gradient-to-br from-green-100 to-blue-100 rounded-lg shadow-lg relative overflow-hidden'>
      {/* Map-like background pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div className='absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full'></div>
        <div className='absolute top-8 right-8 w-2 h-2 bg-blue-500 rounded-full'></div>
        <div className='absolute bottom-8 left-8 w-2 h-2 bg-blue-500 rounded-full'></div>
        <div className='absolute bottom-4 right-4 w-2 h-2 bg-blue-500 rounded-full'></div>
        <div className='absolute top-1/2 left-1/4 w-2 h-2 bg-blue-500 rounded-full'></div>
        <div className='absolute top-1/3 right-1/3 w-2 h-2 bg-blue-500 rounded-full'></div>
      </div>
      
      {/* Main content */}
      <div className='absolute inset-4 bg-white rounded-lg shadow-inner flex flex-col items-center justify-center'>
        <div className='text-6xl mb-4'>🗺️</div>
        <h3 className='text-xl font-semibold text-gray-800 mb-2'>Interactive Map</h3>
        <p className='text-gray-600 text-center px-4'>
          {selectedRegion ? `Showing posts in ${selectedRegion}` : 'Select a region to view posts on map'}
        </p>
        
        {/* Posts representation with better styling */}
        {posts.length > 0 && (
          <div className='mt-6 grid grid-cols-2 gap-4 max-w-md'>
            {console.log('Fallback map showing', posts.length, 'posts')}
            {posts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className='bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer'
                onClick={() => window.open(`/posts/${post.id}`, '_blank')}
              >
                <div className='flex items-center mb-2'>
                  <div
                    className='w-3 h-3 rounded-full mr-2'
                    style={{ backgroundColor: getServiceColor(post.area_type_name) }}
                  />
                  <span className='text-xs font-medium text-gray-800 truncate'>
                    {post.title}
                  </span>
                </div>
                <p className='text-xs text-gray-600'>{post.area_type_name}</p>
                <p className='text-xs text-green-600 font-semibold'>
                  ${post.price_daily}/day
                </p>
              </div>
            ))}
          </div>
        )}
        
        {posts.length > 4 && (
          <p className='text-sm text-gray-500 mt-2'>
            +{posts.length - 4} more locations
          </p>
        )}
        
        {/* Google Maps setup hint */}
                <div className='mt-4 p-3 bg-blue-50 rounded-lg max-w-sm'>
                  <p className='text-xs text-blue-800 text-center'>
                    💡 Add Google Maps API key for full interactive map experience
                  </p>
                  <button
                    onClick={() => {
                      console.log('Manual Google Maps test')
                      setShowGoogleMaps(true)
                    }}
                    className='mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700'
                  >
                    Test Google Maps
                  </button>
                </div>
      </div>
    </div>
  )

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBcWHnpjwWA7Ju8-ZKL98uVb5QjYorrQsQ'
    console.log('Google Maps API Key check:', apiKey ? 'Present' : 'Missing', 'Length:', apiKey?.length)
    
    if (apiKey && apiKey !== 'YOUR_API_KEY' && apiKey.length > 10) {
      console.log('Enabling Google Maps')
      setShowGoogleMaps(true)
    } else {
      console.log('Using fallback map - API key not configured properly')
      setShowGoogleMaps(false)
    }
  }, [])

  // Debug: Log posts and showGoogleMaps state
  useEffect(() => {
    console.log('InteractiveMap - Posts:', posts.length, posts)
    console.log('InteractiveMap - ShowGoogleMaps:', showGoogleMaps)
  }, [posts, showGoogleMaps])

  useEffect(() => {
    if (posts.length > 0) {
      const bounds = {
        north: 45.6,
        south: 37.2,
        east: 73.2,
        west: 56.0
      }
      onBoundsChange(bounds)
    }
  }, [posts, onBoundsChange])

  useEffect(() => {
    const loadGoogleMaps = async () => {
      if (!showGoogleMaps) return

      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBcWHnpjwWA7Ju8-ZKL98uVb5QjYorrQsQ'
        
        if (window.google && window.google.maps) {
          initializeMap()
        } else {
          const script = document.createElement('script')
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
          script.onload = initializeMap
          document.head.appendChild(script)
        }

        function initializeMap() {
          console.log('Initializing Google Maps...')
          const mapElement = document.getElementById('google-map')
          if (!mapElement || !window.google) {
            console.log('Map element or Google Maps not available')
            return
          }

          console.log('Creating Google Maps instance...')
          const map = new window.google.maps.Map(mapElement, {
          center: { lat: 41.2995, lng: 69.2401 },
          zoom: 6,
          styles: [
            { featureType: 'all', elementType: 'geometry.fill', stylers: [{ weight: '2.00' }] },
            { featureType: 'all', elementType: 'geometry.stroke', stylers: [{ color: '#9c9c9c' }] },
            { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f2f2f2' }] },
            { featureType: 'water', elementType: 'all', stylers: [{ color: '#46bcec' }, { visibility: 'on' }] }
          ]
        })

        console.log('Adding markers for', posts.length, 'posts')
        posts.forEach((post) => {
          if (post.latitude && post.longitude) {
            console.log('Adding marker for post:', post.title, 'at', post.latitude, post.longitude)
            const marker = new window.google.maps.Marker({
              position: { lat: post.latitude, lng: post.longitude },
              map: map,
              title: post.title,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: getServiceColor(post.area_type_name),
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 2
              }
            })

            const infoWindow = new window.google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-semibold text-sm">${post.title}</h3>
                  <p class="text-xs text-gray-600 mt-1">${post.area_type_name}</p>
                  <p class="text-xs text-gray-600">${post.location}</p>
                  <p class="text-xs text-gray-600">$${post.price_daily}/day</p>
                  <a href="/posts/${post.id}" class="text-xs text-blue-600 hover:underline">View Details</a>
                </div>
              `
            })

            marker.addListener('click', () => {
              infoWindow.open(map, marker)
            })
          }
        })

        console.log('Google Maps initialized successfully with', posts.length, 'posts')
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error)
        setShowGoogleMaps(false)
      }
    }

    loadGoogleMaps()
  }, [showGoogleMaps, posts])

  return (
    <div className='relative'>
      {!showGoogleMaps ? (
        <>
          <SimpleMapFallback />
          
          {isLoading && (
            <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg'>
              <div className='flex items-center space-x-2'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-green-600'></div>
                <span className='text-gray-600'>Loading posts...</span>
              </div>
            </div>
          )}

          {posts.length > 0 && (
            <div className='mt-4 p-3 bg-white rounded-lg shadow'>
              <div className='flex flex-wrap gap-2 items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  Showing {posts.length} {posts.length === 1 ? 'location' : 'locations'}
                </span>
                <div className='flex items-center gap-2'>
                  <span className='text-xs text-gray-500'>
                    Interactive map preview
                  </span>
                  <button
                    onClick={() => {
                      const instructions = `
To enable full Google Maps functionality:

1. Go to Google Cloud Console
2. Enable Maps JavaScript API
3. Create an API key
4. Add to your .env file:
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
5. Restart your development server

The map will automatically switch to full interactive mode!
                      `
                      alert(instructions)
                    }}
                    className='text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer'
                  >
                    Setup Guide
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div
            id="google-map"
            className='w-full h-96 lg:h-[500px] rounded-lg shadow-lg'
            style={{ minHeight: '400px' }}
          />
          
          {isLoading && (
            <div className='absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg'>
              <div className='flex items-center space-x-2'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-green-600'></div>
                <span className='text-gray-600'>Loading Google Maps...</span>
              </div>
            </div>
          )}

          {posts.length > 0 && (
            <div className='mt-4 p-3 bg-white rounded-lg shadow'>
              <span className='text-sm text-gray-600'>
                Showing {posts.length} {posts.length === 1 ? 'location' : 'locations'} on interactive map
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default InteractiveMap
