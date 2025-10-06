'use client'

import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useAreaTypes } from '@/src/hooks/area_types/useAreaType'
import MapControls from './MapControls'
import MapPostsSidebar from './MapPostsSidebar'
import { MapPost } from './types'

const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-600">Loading map...</div>
    </div>
  )
})

const MapMain = () => {
  const [selectedService, setSelectedService] = useState<string>('')
  const [selectedRegion, setSelectedRegion] = useState<string>('')
  const [mapPosts, setMapPosts] = useState<MapPost[]>([])
  const [sidebarPosts, setSidebarPosts] = useState<MapPost[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { data: areaTypes } = useAreaTypes()

  const fetchMapPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedService) params.append('area_id', selectedService)
      if (selectedRegion) params.append('region', selectedRegion)

      const response = await fetch(`http://zenlyserver.test/api/map/posts?${params}`)
      const data = await response.json()
      
      if (data.status === 200) {
        console.log('Map posts fetched:', data.data.length, 'posts')
        console.log('Map posts data:', data.data)
        setMapPosts(data.data)
      } else {
        console.log('Map posts fetch failed:', data)
      }
    } catch (error) {
      console.error('Error fetching map posts:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedService, selectedRegion])

  const fetchSidebarPosts = useCallback(async () => {
    try {
      const params = new URLSearchParams()
      if (selectedService) params.append('area_id', selectedService)
      if (selectedRegion) params.append('region', selectedRegion)

      const response = await fetch(`http://zenlyserver.test/api/map/posts-by-region?${params}`)
      const data = await response.json()
      
      if (data.status === 200) {
        console.log('Sidebar posts fetched:', data.data.length, 'posts')
        console.log('Sidebar posts data:', data.data)
        setSidebarPosts(data.data)
      } else {
        console.log('Sidebar posts fetch failed:', data)
      }
    } catch (error) {
      console.error('Error fetching sidebar posts:', error)
    }
  }, [selectedService, selectedRegion])

  useEffect(() => {
    // Only fetch posts when both service and region are selected
    if (selectedService && selectedRegion) {
      fetchMapPosts()
      fetchSidebarPosts()
    } else {
      // Clear posts when filters are not complete
      setMapPosts([])
      setSidebarPosts([])
    }
  }, [selectedService, selectedRegion, fetchMapPosts, fetchSidebarPosts])


  const handleServiceChange = (serviceId: string) => {
    setSelectedService(serviceId)
  }

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region)
  }


  return (
    <div className='bg-dark-green mt-20 p-8 lg:p-20'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-white text-3xl lg:text-4xl text-center font-bold mb-8'>
          Find out all types of services through the map
        </h1>
        <MapControls
          areaTypes={areaTypes || []}
          selectedService={selectedService}
          selectedRegion={selectedRegion}
          onServiceChange={handleServiceChange}
          onRegionChange={handleRegionChange}
        />

        {/* Map and Sidebar Container */}
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8'>
          {/* Map - 70% width on large screens */}
          <div className='lg:col-span-3'>
            {selectedService && selectedRegion ? (
              <InteractiveMap
                posts={mapPosts}
                selectedRegion={selectedRegion}
                isLoading={isLoading}
              />
            ) : (
              <div className='w-full h-96 lg:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg flex items-center justify-center'>
                <div className='text-center p-8'>
                  <div className='text-6xl mb-4'>🗺️</div>
                  <h3 className='text-xl font-semibold text-gray-700 mb-2'>Select Service & Region</h3>
                  <p className='text-gray-600 max-w-md'>
                    Please select a service type and region from the filters above to view posts on the interactive map.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Posts Sidebar - 30% width on large screens */}
          <div className='lg:col-span-1'>
            {selectedService && selectedRegion ? (
              <MapPostsSidebar
                posts={sidebarPosts}
                selectedRegion={selectedRegion}
                isLoading={isLoading}
              />
            ) : (
              <div className='w-full h-96 lg:h-[500px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg flex items-center justify-center'>
                <div className='text-center p-6'>
                  <div className='text-4xl mb-3'>📍</div>
                  <h3 className='text-lg font-semibold text-gray-700 mb-2'>Posts Will Appear Here</h3>
                  <p className='text-gray-600 text-sm'>
                    Select service type and region to see available posts
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapMain