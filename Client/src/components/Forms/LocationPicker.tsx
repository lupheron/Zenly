'use client'

import React, { useState, useEffect } from 'react'
import ButtonDefault from '../Button/ButtonDefault'
import { loadGoogleMaps } from '@/src/utils/googleMapsLoader'
import { useLanguage } from '@/src/contexts/LanguageContext'

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

interface LocationPickerProps {
  latitude?: number | null
  longitude?: number | null
  location?: string
  onLocationSelect: (data: { latitude: number; longitude: number; location: string }) => void
  className?: string
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  location,
  onLocationSelect,
  className = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLat, setSelectedLat] = useState<number | null>(latitude || null)
  const [selectedLng, setSelectedLng] = useState<number | null>(longitude || null)
  const [selectedLocation, setSelectedLocation] = useState<string>(location || '')
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const { t } = useLanguage()

  // Load Google Maps
  useEffect(() => {
    if (!isModalOpen) return

    const initGoogleMaps = async () => {
      // Use the shared loader utility to prevent duplicate loading
      try {
        await loadGoogleMaps()
        initializeMap()
      } catch (error) {
        console.error('Failed to load Google Maps:', error)
      }
    }

    const initializeMap = () => {
      const mapElement = document.getElementById('location-picker-map')
      if (!mapElement || !window.google) return

      const center = selectedLat && selectedLng
        ? { lat: selectedLat, lng: selectedLng }
        : { lat: 41.2995, lng: 69.2401 }

      const map = new window.google.maps.Map(mapElement, {
        center: center,
        zoom: selectedLat && selectedLng ? 15 : 8,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true
      })

      let marker: any = null
      let geocoder: any = null

      geocoder = new window.google.maps.Geocoder()
      map.addListener('click', (event: any) => {
        const lat = event.latLng.lat()
        const lng = event.latLng.lng()

        setSelectedLat(lat)
        setSelectedLng(lng)

        if (marker) {
          marker.setMap(null)
        }
        marker = new window.google.maps.Marker({
          position: { lat, lng },
          map: map,
          title: 'Selected Location'
        })

        geocoder.geocode({ location: { lat, lng } }, (results: any[], status: string) => {
          if (status === 'OK' && results[0]) {
            setSelectedLocation(results[0].formatted_address)
          }
        })
      })

      if (selectedLat && selectedLng) {
        marker = new window.google.maps.Marker({
          position: { lat: selectedLat, lng: selectedLng },
          map: map,
          title: 'Selected Location'
        })
      }

      setIsMapLoaded(true)
    }

    initGoogleMaps()
  }, [isModalOpen, selectedLat, selectedLng])

  const handleConfirmLocation = () => {
    if (selectedLat && selectedLng && selectedLocation) {
      onLocationSelect({
        latitude: selectedLat,
        longitude: selectedLng,
        location: selectedLocation
      })
      setIsModalOpen(false)
    }
  }

  const handleClearLocation = () => {
    setSelectedLat(null)
    setSelectedLng(null)
    setSelectedLocation('')
    setIsModalOpen(false)
    onLocationSelect({
      latitude: 0,
      longitude: 0,
      location: ''
    })
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('user.form.locationPicker')}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={selectedLocation || ''}
          readOnly
          placeholder={t('user.form.clickToSelect')}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
        />
        <ButtonDefault
          onClick={() => setIsModalOpen(true)}
          customClasses="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          📍 {t('user.form.selectLocation')}
        </ButtonDefault>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{t('user.form.selectLocation')}</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  {t('user.form.clickToSelect')}
                </p>

                {selectedLat && selectedLng && (
                  <div className="bg-green-50 p-3 rounded-md mb-4">
                    <p className="text-sm font-medium text-green-800">{t('user.form.selectedLocation')}</p>
                    <p className="text-sm text-green-700">Lat: {selectedLat.toFixed(6)}, Lng: {selectedLng.toFixed(6)}</p>
                    <p className="text-sm text-green-700">{selectedLocation}</p>
                  </div>
                )}
              </div>

              <div
                id="location-picker-map"
                className="w-full h-96 border border-gray-300 rounded-md"
              />

              {!isMapLoaded && (
                <div className="w-full h-96 flex items-center justify-center bg-gray-100 rounded-md">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">{t('user.form.loadingMap')}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 flex justify-between">
              <button
                onClick={handleClearLocation}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                {t('user.form.clearLocation')}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  {t('user.form.cancel')}
                </button>
                <button
                  onClick={handleConfirmLocation}
                  disabled={!selectedLat || !selectedLng || !selectedLocation}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
                >
                  {t('user.form.confirmLocation')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationPicker
