'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPost } from './types'
import { cleanLocation } from '@/src/utils/locationUtils'
import { loadGoogleMaps } from '@/src/utils/googleMapsLoader'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

interface InteractiveMapProps {
  posts: MapPost[]
  selectedRegion: string
  selectedService: string
  isLoading: boolean
}

// Uzbekistan regions coordinates mapping
const uzbekistanRegionsCoordinates: { [key: string]: { lat: number; lng: number; zoom: number } } = {
  'Andijon': { lat: 40.7684, lng: 72.2361, zoom: 9 },
  'Buxoro': { lat: 39.7681, lng: 64.4556, zoom: 9 },
  'Fargʻona': { lat: 40.3864, lng: 71.7864, zoom: 9 },
  'Jizzax': { lat: 40.1164, lng: 67.8411, zoom: 9 },
  'Xorazm': { lat: 41.3564, lng: 60.8564, zoom: 9 },
  'Namangan': { lat: 40.9953, lng: 71.6725, zoom: 9 },
  'Navoiy': { lat: 40.0844, lng: 65.3792, zoom: 9 },
  'Qashqadaryo': { lat: 38.8619, lng: 66.2725, zoom: 9 },
  'Qoraqalpogʻiston': { lat: 43.7683, lng: 59.0214, zoom: 8 },
  'Samarqand': { lat: 39.6547, lng: 66.9597, zoom: 9 },
  'Sirdaryo': { lat: 40.8436, lng: 68.6617, zoom: 9 },
  'Surxondaryo': { lat: 37.9409, lng: 67.5709, zoom: 9 },
  'Toshkent viloyati': { lat: 41.2213, lng: 69.8597, zoom: 9 },
  'Toshkent shahri': { lat: 41.2995, lng: 69.2401, zoom: 10 }
}


const InteractiveMap: React.FC<InteractiveMapProps> = ({
  posts,
  selectedRegion,
  selectedService,
  isLoading
}) => {
  const [showGoogleMaps, setShowGoogleMaps] = useState(false)
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null)


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
            {posts.slice(0, 4).map((post) => (
              <div
                key={post.id}
                className='bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer'
                onClick={() => window.open(`/posts/${post.id}`, '_blank')}
              >
                <div className='flex items-center mb-2'>
                  <Image
                    src={post.img || '/logo/profile-default.png'}
                    alt={post.title}
                    width={32}
                    height={32}
                    className='rounded-full object-cover mr-2'
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

    // Log coordinate information for debugging
    posts.forEach((post, index) => {
      console.log(`Post ${index}: ${post.title}`, {
        latitude: post.latitude,
        longitude: post.longitude,
        latType: typeof post.latitude,
        lngType: typeof post.longitude
      })
    })
  }, [posts, showGoogleMaps])

  // Handle region and service changes - update map view
  useEffect(() => {
    if (mapInstance && selectedRegion && uzbekistanRegionsCoordinates[selectedRegion]) {
      const regionCoords = uzbekistanRegionsCoordinates[selectedRegion]

      // Pan and zoom to the selected region
      mapInstance.panTo({ lat: regionCoords.lat, lng: regionCoords.lng })
      mapInstance.setZoom(regionCoords.zoom)

      console.log('Map updated to region:', selectedRegion, 'at zoom level:', regionCoords.zoom)
    }
  }, [selectedRegion, selectedService, mapInstance])


  useEffect(() => {
    if (posts.length > 0) {
      // Note: Bounds change handling removed as it's not currently used
      // This useEffect is kept for potential future bounds handling
    }
  }, [posts])

  useEffect(() => {
    const initializeGoogleMaps = async () => {
      if (!showGoogleMaps) return

      try {
        // Use the shared loader utility to prevent duplicate loading
        await loadGoogleMaps()
        initializeMap()

        function initializeMap() {
          console.log('Initializing Google Maps...')
          const mapElement = document.getElementById('google-map')
          if (!mapElement || !window.google) {
            console.log('Map element or Google Maps not available')
            return
          }

          // Determine initial center and zoom based on selected region
          let initialCenter = { lat: 41.2995, lng: 69.2401 } // Default to Tashkent
          let initialZoom = 6

          if (selectedRegion && uzbekistanRegionsCoordinates[selectedRegion]) {
            const regionCoords = uzbekistanRegionsCoordinates[selectedRegion]
            initialCenter = { lat: regionCoords.lat, lng: regionCoords.lng }
            initialZoom = regionCoords.zoom
          }

          console.log('Creating Google Maps instance...')
          const map = new window.google.maps.Map(mapElement, {
            center: initialCenter,
            zoom: initialZoom,
            styles: [
              { featureType: 'all', elementType: 'geometry.fill', stylers: [{ weight: '2.00' }] },
              { featureType: 'all', elementType: 'geometry.stroke', stylers: [{ color: '#9c9c9c' }] },
              { featureType: 'landscape', elementType: 'all', stylers: [{ color: '#f2f2f2' }] },
              { featureType: 'water', elementType: 'all', stylers: [{ color: '#46bcec' }, { visibility: 'on' }] }
            ]
          })

          // Store map instance for later use
          setMapInstance(map)

          console.log('Adding markers for', posts.length, 'posts')
          posts.forEach((post) => {
            // Convert latitude and longitude to numbers and validate
            const lat = parseFloat(String(post.latitude))
            const lng = parseFloat(String(post.longitude))

            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              console.log('Adding marker for post:', post.title, 'at', lat, lng)

              // Create circular marker icon with larger size
              const markerIcon = {
                url: post.img || '/logo/profile-default.png',
                scaledSize: new window.google.maps.Size(50, 50), // Increased from 20x20 to 50x50
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(25, 25), // Centered anchor
                shape: {
                  type: 'circle',
                  coords: [25, 25, 25] // Circle with radius 25
                }
              }

              const marker = new window.google.maps.Marker({
                position: { lat: lat, lng: lng },
                map: map,
                title: post.title,
                icon: markerIcon,
                animation: window.google.maps.Animation.DROP
              })

              const infoWindow = new window.google.maps.InfoWindow({
                content: `
                <div class="w-100">
                  <div class="flex items-start space-x-5">
                    <img src="${post.img || '/logo/profile-default.png'}" 
                         alt="${post.title}" 
                         class="w-35 h-35 object-cover rounded-full" />
                    <div class="flex-1 font-poppins">
                      <h3 class="font-semibold text-xl text-gray-900 mb-1">${post.title}</h3>
                      <p class="text-[14px] text-gray-600 mb-1">${post.area_type_name}</p>
                      <p class="text-[14px] text-gray-600 mb-1">${cleanLocation(post.location)}</p>
                      <p class="text-[15px] font-semibold text-green-600 mb-3">$${post.price_daily}/day</p>
                      <button onclick="window.open('/posts/${post.id}', '_blank')" 
                              class="text-[14px] font-semibold w-full h-7 cursor-pointer bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              `
              })

              marker.addListener('click', () => {
                infoWindow.open(map, marker)
              })

              // Add double-click listener to redirect to post details
              marker.addListener('dblclick', () => {
                window.open(`/posts/${post.id}`, '_blank')
              })
            } else {
              console.log('Skipping post due to invalid coordinates:', post.title, 'lat:', post.latitude, 'lng:', post.longitude)
            }
          })

          console.log('Google Maps initialized successfully with', posts.length, 'posts')
        }
      } catch (error) {
        console.error('Error initializing Google Maps:', error)
        setShowGoogleMaps(false)
      }
    }

    initializeGoogleMaps()
  }, [showGoogleMaps, posts, selectedRegion])

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
