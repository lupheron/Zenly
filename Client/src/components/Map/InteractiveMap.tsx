'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import { MapPost } from './types'
import { cleanLocation } from '@/src/utils/locationUtils'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Fix for Leaflet default icon issues in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon;

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

// Component to handle map view updates
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom)
  }, [center, zoom, map])
  return null
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  posts,
  selectedRegion,
  selectedService,
  isLoading
}) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const initialCenter: [number, number] = useMemo(() => {
    if (selectedRegion && uzbekistanRegionsCoordinates[selectedRegion]) {
      const region = uzbekistanRegionsCoordinates[selectedRegion]
      return [region.lat, region.lng]
    }
    return [41.2995, 69.2401] // Default to Tashkent
  }, [selectedRegion])

  const initialZoom = useMemo(() => {
    if (selectedRegion && uzbekistanRegionsCoordinates[selectedRegion]) {
      return uzbekistanRegionsCoordinates[selectedRegion].zoom
    }
    return 6
  }, [selectedRegion])

  // Custom marker icon creator (Circular image marker)
  const createCustomIcon = (imageUrl: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 50px; 
          height: 50px; 
          border-radius: 50%; 
          border: 3px solid white; 
          box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
          overflow: hidden;
          background: white;
        ">
          <img src="${imageUrl || '/logo/profile-default.png'}" 
               style="width: 100%; height: 100%; object-fit: cover;" 
               onerror="this.src='/logo/profile-default.png'" />
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -25]
    })
  }

  if (!isClient) {
    return (
      <div className='w-full h-96 lg:h-[500px] bg-gray-100 rounded-lg flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    )
  }

  return (
    <div className='relative'>
      <div className='w-full h-96 lg:h-[500px] rounded-lg shadow-lg overflow-hidden border border-gray-200'>
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater center={initialCenter} zoom={initialZoom} />

          {posts.map((post) => {
            const lat = parseFloat(String(post.latitude))
            const lng = parseFloat(String(post.longitude))

            if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
              return (
                <Marker
                  key={post.id}
                  position={[lat, lng]}
                  icon={createCustomIcon(post.img || '')}
                >
                  <Popup>
                    <div className="w-64">
                      <div className="flex items-start space-x-3">
                        <img
                          src={post.img || '/logo/profile-default.png'}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-full shadow-sm"
                          onerror="this.src='/logo/profile-default.png'"
                        />
                        <div className="flex-1">
                          <h3 className="font-bold text-base text-gray-900 leading-tight mb-1">{post.title}</h3>
                          <p className="text-xs text-gray-600 mb-1">{post.area_type_name}</p>
                          <p className="text-xs text-gray-500 mb-1 line-clamp-1">{cleanLocation(post.location)}</p>
                          <p className="text-sm font-bold text-green-600 mb-2">$${post.price_daily}/day</p>
                          <button
                            onClick={() => window.open(`/posts/${post.id}`, '_blank')}
                            className="text-xs font-semibold w-full bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors shadow-sm"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
            }
            return null
          })}
        </MapContainer>
      </div>

      {isLoading && (
        <div className='absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center rounded-lg z-[1000]'>
          <div className='flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-lg'>
            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-green-600'></div>
            <span className='text-sm font-medium text-gray-700'>Updating map...</span>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className='mt-4 p-3 bg-white rounded-lg shadow-sm border border-gray-100 flex items-center justify-between'>
          <span className='text-sm text-gray-600 font-medium'>
            Showing {posts.length} {posts.length === 1 ? 'location' : 'locations'} on interactive map
          </span>
          <div className='flex items-center gap-1.5'>
            <span className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></span>
            <span className='text-xs text-gray-500'>Live OSM Data</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default InteractiveMap
