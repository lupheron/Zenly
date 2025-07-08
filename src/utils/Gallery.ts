export interface GalleryFile {
    uid: string
    name: string
    status: string
    url: string
    id: number
}

export interface MainFile {
    uid: string
    name: string
    status: string
    url: string
}

export interface GalleryImage {
    id: number
    img: string
    post_id: number
}