'use client'

import React, { useState, useEffect, useMemo } from 'react'
import ButtonDefault from '../Button/ButtonDefault'
import { useLanguage } from '@/src/contexts/LanguageContext'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'

// Fix for Leaflet default icon issues
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

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
  const [isClient, setIsClient] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    setIsClient(true)
  }, [])

  const initialCenter: [number, number] = useMemo(() => {
    if (selectedLat && selectedLng) return [selectedLat, selectedLng]
    return [41.2995, 69.2401] // Default to Tashkent
  }, [selectedLat, selectedLng])

  // Component to handle map clicks
  const MapEvents = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng
        setSelectedLat(lat)
        setSelectedLng(lng)

        // Reverse geocoding using Nominatim (Free OSM service)
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=en`)
          const data = await response.json()
          if (data && data.display_name) {
            setSelectedLocation(data.display_name)
          } else {
            setSelectedLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
          }
        } catch (error) {
          console.error('Reverse geocoding error:', error)
          setSelectedLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`)
        }
      }
    })
    return null
  }

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
      <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
        {t('user.form.locationPicker')}
      </label>

      <div className="flex gap-2">
        <input
          type="text"
          value={selectedLocation || ''}
          readOnly
          placeholder={t('user.form.clickToSelect')}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        <ButtonDefault
          onClick={() => setIsModalOpen(true)}
          customClasses="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm transition-colors flex items-center gap-2"
        >
          📍 {t('user.form.selectLocation')}
        </ButtonDefault>
      </div>

      {isModalOpen && isClient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800 font-poppins">{t('user.form.selectLocation')}</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-all text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-3 ml-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  {t('user.form.clickToSelect')}
                </p>

                {selectedLat && selectedLng && (
                  <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-lg mb-4 flex items-start gap-3">
                    <div className="bg-blue-600 text-white p-2 rounded-lg mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">{t('user.form.selectedLocation')}</p>
                      <p className="text-sm text-blue-800 font-medium mb-1 line-clamp-2">{selectedLocation}</p>
                      <p className="text-[11px] text-blue-600/70 font-mono">
                        {selectedLat.toFixed(6)}, {selectedLng.toFixed(6)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full h-96 rounded-xl overflow-hidden border border-gray-200 shadow-inner relative">
                <MapContainer
                  center={initialCenter}
                  zoom={selectedLat && selectedLng ? 15 : 8}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapEvents />
                  {selectedLat && selectedLng && (
                    <Marker position={[selectedLat, selectedLng]} icon={DefaultIcon} />
                  )}
                </MapContainer>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between gap-3">
              <button
                onClick={handleClearLocation}
                className="px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-sm font-semibold transition-all text-left sm:text-center"
              >
                {t('user.form.clearLocation')}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-white hover:border-gray-400 transition-all"
                >
                  {t('user.form.cancel')}
                </button>
                <button
                  onClick={handleConfirmLocation}
                  disabled={!selectedLat || !selectedLng || !selectedLocation}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold text-sm transition-all shadow-md shadow-blue-200"
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
