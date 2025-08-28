'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { useUser } from '@/src/hooks/users/useUser'
import { usePosts, Post } from '@/src/hooks/posts/usePosts'
import { useAreaTypes } from '@/src/hooks/area_types/useAreaType'
import api from '@/src/utils/axios'
import { useQuery as useQueryBookingCounts } from '@tanstack/react-query'

interface ViewData {
    postId: number
    views: number
}

interface RatingData {
    postId: number
    rating: number
}

interface DashboardData {
    // Loading states
    isLoading: boolean

    // Chart data
    pieChartData: {
        labels: string[]
        data: number[]
    }

    lineChartData: {
        labels: string[]
        data: number[]
    }

    // Post options for select
    postOptions: Array<{
        label: string
        value: string
    }>

    // Sort controls
    sortBy: 'views' | 'rating'
    setSortBy: (sort: 'views' | 'rating') => void

    // Selected post for comments
    selectedPostId: number | null
    setSelectedPostId: (id: number | null) => void

    // User posts
    userPosts: Post[]
    barChartData: {
        labels: string[]
        data: number[]
    }
}

interface BookingCount {
    post_id: number;
    post_title: string;
    count: number;
}

export interface DateFilterValue {
    startDate: string;
    endDate: string;
}

export const useDashboard = (): DashboardData => {
    const router = useRouter()
    const [userId, setUserId] = useState<number | null>(null)
    const [sortBy, setSortBy] = useState<'views' | 'rating'>('views')
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

    // Base queries
    const { data: userData, isLoading: userLoading } = useUser()
    const { data: posts, isLoading: postsLoading } = usePosts();
    const { data: areaTypes, isLoading: areaTypesLoading } = useAreaTypes()

    // Handle user authentication and get userId from localStorage
    useEffect(() => {
        if (!userLoading && userData) {
            if (userData.type !== 0) {
                router.push('/')
            }
        }
        const storedId = localStorage.getItem('user_id')
        setUserId(storedId ? Number(storedId) : null)
    }, [userData, userLoading, router])

    // Get current user's posts
    const userPosts = useMemo(() => {
        return posts?.filter((p) => p.user_id === userId) || []
    }, [posts, userId])

    // Fetch views for user posts
    const { data: viewsData, isLoading: viewsLoading } = useQuery<ViewData[]>({
        queryKey: ['user-posts-views', userPosts.map(p => p.id)],
        queryFn: async () => {
            if (!userPosts.length) return []

            const results = await Promise.all(
                userPosts.map(async (post) => {
                    try {
                        const res = await api.get(`/posts/${post.id}/increase-interest`, { params: { start_date: '2023-01-01', end_date: '2023-12-31' } })
                        const views = Array.isArray(res.data.data)
                            ? res.data.data.reduce((sum: number, v: { clicked: number }) => sum + (v.clicked || 0), 0)
                            : 0
                        return { postId: post.id, views }
                    } catch (error) {
                        console.error(`Post ${post.id} uchun ko'rishlar sonini olishda xatolik:`, error)
                        return { postId: post.id, views: 0 }
                    }
                })
            )
            return results
        },
        enabled: !!userId && !!userPosts.length,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Fetch ratings for user posts
    const { data: ratingsData, isLoading: ratingsLoading } = useQuery<RatingData[]>({
        queryKey: ['user-posts-ratings', userPosts.map(p => p.id)],
        queryFn: async () => {
            if (!userPosts.length) return []

            const results = await Promise.all(
                userPosts.map(async (post) => {
                    try {
                        const res = await api.get(`/rating/${post.id}`, { params: { start_date: '2023-01-01', end_date: '2023-12-31' } })
                        return { postId: post.id, rating: res.data.average_rating || 0 }
                    } catch (error) {
                        console.error(`Post ${post.id} uchun reytingni olishda xatolik:`, error)
                        return { postId: post.id, rating: 0 }
                    }
                })
            )
            return results
        },
        enabled: !!userId && !!userPosts.length,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Fetch booking counts for user's posts
    const { data: bookingCountsData, isLoading: bookingCountsLoading } = useQueryBookingCounts<BookingCount[]>({
        queryKey: ['user-posts-booking-counts', userId],
        queryFn: async () => {
            if (!userId) return [];
            const res = await api.get(`/booking-requests/booking-counts/${userId}`, { params: { start_date: '2023-01-01', end_date: '2023-12-31' } });
            return res.data.data || [];
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });

    // Prepare pie chart data (posts by area type)
    const pieChartData = useMemo(() => {
        const labels = areaTypes?.map((a) => a.name.replace(/'/g, "&apos;")) || []
        const areaTypeIds = areaTypes?.map((a) => a.id) || []
        const data = areaTypeIds.map(
            (id) => userPosts.filter((p) => p.area_id === id).length || 0
        )

        return { labels, data }
    }, [areaTypes, userPosts])

    // Prepare line chart data (sorted posts by views/rating)
    const lineChartData = useMemo(() => {
        // Sort posts by selected metric
        const sortedPosts = [...userPosts]

        if (sortBy === 'views' && viewsData) {
            sortedPosts.sort((a, b) => {
                const aViews = viewsData.find(v => v.postId === a.id)?.views || 0
                const bViews = viewsData.find(v => v.postId === b.id)?.views || 0
                return bViews - aViews
            })
        } else if (sortBy === 'rating' && ratingsData) {
            sortedPosts.sort((a, b) => {
                const aRating = ratingsData.find(r => r.postId === a.id)?.rating || 0
                const bRating = ratingsData.find(r => r.postId === b.id)?.rating || 0
                return bRating - aRating
            })
        }

        const labels = sortedPosts.map(p => p.title.replace(/'/g, "&apos;"))
        const data = sortedPosts.map(p => {
            if (sortBy === 'views' && viewsData) {
                return viewsData.find(v => v.postId === p.id)?.views || 0
            } else if (sortBy === 'rating' && ratingsData) {
                return ratingsData.find(r => r.postId === p.id)?.rating || 0
            }
            return 0
        })

        return { labels, data }
    }, [userPosts, sortBy, viewsData, ratingsData])

    // Prepare post options for select dropdown
    const postOptions = useMemo(() => {
        return userPosts.map(post => ({
            label: post.title,
            value: String(post.id),
        }))
    }, [userPosts])

    // Prepare bar chart data (booked posts)
    const barChartData = useMemo(() => {
        if (!bookingCountsData) return { labels: [], data: [] };
        return {
            labels: bookingCountsData.map((item) => item.post_title.replace(/'/g, "&apos;")),
            data: bookingCountsData.map((item) => item.count),
        };
    }, [bookingCountsData]);

    // Determine overall loading state
    const isLoading = userLoading ||
        postsLoading ||
        areaTypesLoading ||
        userId === null ||
        viewsLoading ||
        ratingsLoading
        || bookingCountsLoading

    return {
        isLoading,
        pieChartData,
        lineChartData,
        postOptions,
        sortBy,
        setSortBy,
        selectedPostId,
        setSelectedPostId,
        userPosts,
        barChartData,
    }
}

export const useDashboardWithDateFilter = (dateFilter: DateFilterValue): DashboardData => {
    const router = useRouter()
    const [userId, setUserId] = useState<number | null>(null)
    const [sortBy, setSortBy] = useState<'views' | 'rating'>('views')
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null)

    // Base queries
    const { data: userData, isLoading: userLoading } = useUser()
    const { data: posts, isLoading: postsLoading } = usePosts(dateFilter);
    const { data: areaTypes, isLoading: areaTypesLoading } = useAreaTypes()

    // Handle user authentication and get userId from localStorage
    useEffect(() => {
        if (!userLoading && userData) {
            if (userData.type !== 0) {
                router.push('/')
            }
        }
        const storedId = localStorage.getItem('user_id')
        setUserId(storedId ? Number(storedId) : null)
    }, [userData, userLoading, router])

    // Get current user's posts
    const userPosts = useMemo(() => {
        return posts?.filter((p) => p.user_id === userId) || []
    }, [posts, userId])

    // Fetch views for user posts
    const { data: viewsData, isLoading: viewsLoading } = useQuery<ViewData[]>({
        queryKey: ['user-posts-views', userPosts.map(p => p.id), dateFilter.startDate, dateFilter.endDate],
        queryFn: async () => {
            if (!userPosts.length) return []

            const results = await Promise.all(
                userPosts.map(async (post) => {
                    try {
                        const res = await api.get(`/posts/${post.id}/increase-interest`, { params: { start_date: dateFilter.startDate, end_date: dateFilter.endDate } })
                        const views = Array.isArray(res.data.data)
                            ? res.data.data.reduce((sum: number, v: { clicked: number }) => sum + (v.clicked || 0), 0)
                            : 0
                        return { postId: post.id, views }
                    } catch (error) {
                        console.error(`Post ${post.id} uchun ko'rishlar sonini olishda xatolik:`, error)
                        return { postId: post.id, views: 0 }
                    }
                })
            )
            return results
        },
        enabled: !!userId && !!userPosts.length,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Fetch ratings for user posts
    const { data: ratingsData, isLoading: ratingsLoading } = useQuery<RatingData[]>({
        queryKey: ['user-posts-ratings', userPosts.map(p => p.id), dateFilter.startDate, dateFilter.endDate],
        queryFn: async () => {
            if (!userPosts.length) return []

            const results = await Promise.all(
                userPosts.map(async (post) => {
                    try {
                        const res = await api.get(`/rating/${post.id}`, { params: { start_date: dateFilter.startDate, end_date: dateFilter.endDate } })
                        return { postId: post.id, rating: res.data.average_rating || 0 }
                    } catch (error) {
                        console.error(`Post ${post.id} uchun reytingni olishda xatolik:`, error)
                        return { postId: post.id, rating: 0 }
                    }
                })
            )
            return results
        },
        enabled: !!userId && !!userPosts.length,
        staleTime: 5 * 60 * 1000, // 5 minutes
    })

    // Fetch booking counts for user's posts
    const { data: bookingCountsData, isLoading: bookingCountsLoading } = useQueryBookingCounts<BookingCount[]>({
        queryKey: ['user-posts-booking-counts', userId, dateFilter.startDate, dateFilter.endDate],
        queryFn: async () => {
            if (!userId) return [];
            const res = await api.get(`/booking-requests/booking-counts/${userId}`, { params: { start_date: dateFilter.startDate, end_date: dateFilter.endDate } });
            return res.data.data || [];
        },
        enabled: !!userId,
        staleTime: 5 * 60 * 1000,
    });

    // Prepare pie chart data (posts by area type)
    const pieChartData = useMemo(() => {
        const labels = areaTypes?.map((a) => a.name.replace(/'/g, "&apos;")) || []
        const areaTypeIds = areaTypes?.map((a) => a.id) || []
        const data = areaTypeIds.map(
            (id) => userPosts.filter((p) => p.area_id === id).length || 0
        )

        return { labels, data }
    }, [areaTypes, userPosts])

    // Prepare line chart data (sorted posts by views/rating)
    const lineChartData = useMemo(() => {
        // Sort posts by selected metric
        const sortedPosts = [...userPosts]

        if (sortBy === 'views' && viewsData) {
            sortedPosts.sort((a, b) => {
                const aViews = viewsData.find(v => v.postId === a.id)?.views || 0
                const bViews = viewsData.find(v => v.postId === b.id)?.views || 0
                return bViews - aViews
            })
        } else if (sortBy === 'rating' && ratingsData) {
            sortedPosts.sort((a, b) => {
                const aRating = ratingsData.find(r => r.postId === a.id)?.rating || 0
                const bRating = ratingsData.find(r => r.postId === b.id)?.rating || 0
                return bRating - aRating
            })
        }

        const labels = sortedPosts.map(p => p.title.replace(/'/g, "&apos;"))
        const data = sortedPosts.map(p => {
            if (sortBy === 'views' && viewsData) {
                return viewsData.find(v => v.postId === p.id)?.views || 0
            } else if (sortBy === 'rating' && ratingsData) {
                return ratingsData.find(r => r.postId === p.id)?.rating || 0
            }
            return 0
        })

        return { labels, data }
    }, [userPosts, sortBy, viewsData, ratingsData])

    // Prepare post options for select dropdown
    const postOptions = useMemo(() => {
        return userPosts.map(post => ({
            label: post.title,
            value: String(post.id),
        }))
    }, [userPosts])

    // Prepare bar chart data (booked posts)
    const barChartData = useMemo(() => {
        if (!bookingCountsData) return { labels: [], data: [] };
        return {
            labels: bookingCountsData.map((item) => item.post_title.replace(/'/g, "&apos;")),
            data: bookingCountsData.map((item) => item.count),
        };
    }, [bookingCountsData]);

    // Determine overall loading state
    const isLoading = userLoading ||
        postsLoading ||
        areaTypesLoading ||
        userId === null ||
        viewsLoading ||
        ratingsLoading
        || bookingCountsLoading

    return {
        isLoading,
        pieChartData,
        lineChartData,
        postOptions,
        sortBy,
        setSortBy,
        selectedPostId,
        setSelectedPostId,
        userPosts,
        barChartData,
    }
}