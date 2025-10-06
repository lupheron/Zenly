export interface MapPost {
  id: number
  user_id: number
  area_id: number
  title: string
  small_description: string
  location: string
  latitude: number | string
  longitude: number | string
  members: number
  price_daily: number
  img: string | null
  status: number
  created_at: string
  area_type_name: string
  avg_rating: number
  comment_count: number
  view_count: number
}

export interface AreaType {
  id: number
  name: string
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface UzbekistanRegion {
  name: string
  lat: number
  lng: number
}
