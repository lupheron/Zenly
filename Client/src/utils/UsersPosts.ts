export interface Post {
    id: number
    user_id: number
    area_id: number
    title: string
    small_description: string
    description: string
    location: string
    members: number
    price_daily: number
    img: string
    clicked: number
    status: string
    created_at: string
    updated_at: string
    deleted_at: string | null
}

export interface CreatePostPayload {
    user_id: number
    title: string
    small_description: string
    description: string
    price_daily: string | number
    location: string
    members: string | number
    area_id: string | number
    img: string | null
}

export interface CreatePostResponse {
    message: string
    post_id: number
}

export interface UpdatePostPayload {
    title: string
    small_description: string
    description: string
    price_daily: string | number
    location: string
    members: string | number
    area_id: string | number
    user_id: number
    img: string | null
}

