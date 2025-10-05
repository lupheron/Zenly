'use client'

import React from 'react'
import { AreaType } from './types'
import AnimatedSelect from '../FormElements/Select/AnimatedSelect'

interface MapControlsProps {
  areaTypes: AreaType[]
  selectedService: string
  selectedRegion: string
  onServiceChange: (serviceId: string) => void
  onRegionChange: (region: string) => void
}

const uzbekistanRegions = [
  'Andijon',
  'Buxoro',
  'Fargʻona',
  'Jizzax',
  'Xorazm',
  'Namangan',
  'Navoiy',
  'Qashqadaryo',
  'Qoraqalpogʻiston',
  'Samarqand',
  'Sirdaryo',
  'Surxondaryo',
  'Toshkent viloyati',
  'Toshkent shahri'
]

const MapControls: React.FC<MapControlsProps> = ({
  areaTypes,
  selectedService,
  selectedRegion,
  onServiceChange,
  onRegionChange
}) => {
  return (
    <div className='bg-white rounded-lg p-6 shadow-lg'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Service Type Selection */}
        <div>
          <AnimatedSelect
            label="Service Types"
            name="service"
            value={selectedService}
            onChange={(e) => onServiceChange(e.target.value)}
            placeholder="All Services"
            variant="default"
            customClassesSelect="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            options={[
              { label: 'All Services', value: '' },
              ...areaTypes.map(areaType => ({
                label: areaType.name,
                value: areaType.id.toString()
              }))
            ]}
          />
        </div>

        {/* Region Selection */}
        <div>
          <AnimatedSelect
            label="Select Region"
            name="region"
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            placeholder="Choose a region..."
            variant="default"
            customClassesSelect="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            options={uzbekistanRegions.map(region => ({
              label: region,
              value: region
            }))}
          />
        </div>
      </div>

      {/* Selected Filters Display */}
      {(selectedService || selectedRegion) && (
        <div className='mt-6 p-4 bg-green-50 rounded-lg'>
          <h4 className='text-sm font-medium text-green-800 mb-2'>Active Filters:</h4>
          <div className='flex flex-wrap gap-2'>
            {selectedService && (
              <span className='px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm'>
                {areaTypes.find(type => type.id.toString() === selectedService)?.name || 'Service'}
              </span>
            )}
            {selectedRegion && (
              <span className='px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm'>
                {selectedRegion}
              </span>
            )}
            <button
              onClick={() => {
                onServiceChange('')
                onRegionChange('')
              }}
              className='px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm hover:bg-red-300 transition-colors cursor-pointer'
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapControls
