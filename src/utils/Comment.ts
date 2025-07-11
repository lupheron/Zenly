export interface WebComment {
    user_id: number,
    title: string,
    fullname: string,
    comment: string
}

export interface PostComment {
    user_id: number,
    post_id: number,
    name: string,
    text: string
}