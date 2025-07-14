"use client"

import api from "@/src/utils/axios"
import { useQuery } from "@tanstack/react-query"

interface PostViewsResponse {
    message: string
    status: number
    data: { clicked: number }[]
}

const fetchPostViews = async (postId: number): Promise<number> => {
    const res = await api.get<PostViewsResponse>(`/posts/${postId}/increase-interest`)
    const views = res.data.data
    return views.reduce((total, view) => total + view.clicked, 0)
}

export const usePostViews = (postId: number) => {
    return useQuery({
        queryKey: ["post-views", postId],
        queryFn: () => fetchPostViews(postId),
        enabled: !!postId,
        retry: 3,
    })
}
