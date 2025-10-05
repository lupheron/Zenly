import { useQuery } from '@tanstack/react-query'
import api from '@/src/utils/axios'
import { MapPost } from '@/src/components/Map/types'

export interface MapPostsParams {
  area_id?: string
  region?: string
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}

const fetchMapPosts = async (params: MapPostsParams): Promise<MapPost[]> => {
  const searchParams = new URLSearchParams()
  
  if (params.area_id) searchParams.append('area_id', params.area_id)
  if (params.region) searchParams.append('region', params.region)
  if (params.bounds) {
    searchParams.append('bounds', JSON.stringify(params.bounds))
  }

  const res = await api.get(`/map/posts?${searchParams}`)
  return res.data.data
}

const fetchPostsByRegion = async (params: MapPostsParams): Promise<MapPost[]> => {
  const searchParams = new URLSearchParams()
  
  if (params.area_id) searchParams.append('area_id', params.area_id)
  if (params.region) searchParams.append('region', params.region)

  const res = await api.get(`/map/posts-by-region?${searchParams}`)
  return res.data.data
}

export const useMapPosts = (params: MapPostsParams) => {
  return useQuery({
    queryKey: ['map-posts', params],
    queryFn: () => fetchMapPosts(params),
    enabled: !!params.region,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const usePostsByRegion = (params: MapPostsParams) => {
  return useQuery({
    queryKey: ['posts-by-region', params],
    queryFn: () => fetchPostsByRegion(params),
    enabled: !!params.region,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
