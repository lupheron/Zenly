'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/src/hooks/users/useUser'
import Loader from '../../components/Loader/Loader'
import PieChart from '../../components/charts/PieChart'
import LineChart from '../../components/charts/LineChart'
import { usePosts } from '@/src/hooks/posts/usePosts'
import { useAreaTypes } from '@/src/hooks/area_types/useAreaType'
import { useQuery } from '@tanstack/react-query'
import api from '@/src/utils/axios'
import UserComments from '@/src/components/Comments/UserComments'
import SelectDefault from '@/src/components/FormElements/Select/SelectDefault'

export default function Dashboard() {
    const router = useRouter()
    const { data, isLoading } = useUser()
    const { data: posts, isLoading: postsLoading } = usePosts()
    const { data: areaTypes, isLoading: areaTypesLoading } = useAreaTypes()
    const [userId, setUserId] = useState<number | null>(null)
    const [sortBy, setSortBy] = useState<'views' | 'rating'>('views')
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

    useEffect(() => {
        if (!isLoading && data) {
            if (data.type !== 0) {
                router.push('/')
            }
        }
        const storedId = localStorage.getItem('user_id')
        setUserId(storedId ? Number(storedId) : null)
    }, [data, isLoading, router])

    // Get only the current user's posts
    const userPosts = useMemo(() => posts?.filter((p) => p.user_id === userId) || [], [posts, userId])

    // Fetch views for each post
    const { data: viewsData, isLoading: viewsLoading } = useQuery({
        queryKey: ['user-posts-views', userPosts.map(p => p.id)],
        queryFn: async () => {
            if (!userPosts.length) return [];
            const results = await Promise.all(
                userPosts.map(async (post) => {
                    const res = await api.get(`/posts/${post.id}/increase-interest`)
                    // Sum all clicks for this post
                    const views = Array.isArray(res.data.data)
                        ? res.data.data.reduce((sum: number, v: { clicked: number }) => sum + (v.clicked || 0), 0)
                        : 0;
                    return { postId: post.id, views };
                })
            );
            return results;
        },
        enabled: !!userId && !!userPosts.length,
    })

    // Fetch ratings for each post
    const { data: ratingsData, isLoading: ratingsLoading } = useQuery({
        queryKey: ['user-posts-ratings', userPosts.map(p => p.id)],
        queryFn: async () => {
            if (!userPosts.length) return [];
            const results = await Promise.all(
                userPosts.map(async (post) => {
                    const res = await api.get(`/rating/${post.id}`)
                    return { postId: post.id, rating: res.data.average_rating || 0 };
                })
            );
            return results;
        },
        enabled: !!userId && !!userPosts.length,
    })

    const areaTypeLabels = useMemo(() => areaTypes?.map((a) => a.name.replace(/'/g, "&apos;")) || [], [areaTypes])
    const areaTypeIds = useMemo(() => areaTypes?.map((a) => a.id) || [], [areaTypes])
    const postCounts = useMemo(() => areaTypeIds.map(
        (id) => userPosts.filter((p) => p.area_id === id).length || 0
    ), [areaTypeIds, userPosts])

    // Prepare data for LineChart
    // Sort posts by selected metric
    const sortedPosts = useMemo(() => {
        const arr = [...userPosts]
        if (sortBy === 'views' && viewsData) {
            arr.sort((a, b) => {
                const aViews = viewsData.find(v => v.postId === a.id)?.views || 0
                const bViews = viewsData.find(v => v.postId === b.id)?.views || 0
                return bViews - aViews
            })
        } else if (sortBy === 'rating' && ratingsData) {
            arr.sort((a, b) => {
                const aRating = ratingsData.find(r => r.postId === a.id)?.rating || 0
                const bRating = ratingsData.find(r => r.postId === b.id)?.rating || 0
                return bRating - aRating
            })
        }
        return arr
    }, [userPosts, sortBy, viewsData, ratingsData])

    const lineLabels = useMemo(() => sortedPosts.map(p => p.title.replace(/'/g, "&apos;")), [sortedPosts])
    const lineData = useMemo(() => sortedPosts.map(p => {
        if (sortBy === 'views' && viewsData) {
            return viewsData.find(v => v.postId === p.id)?.views || 0
        } else if (sortBy === 'rating' && ratingsData) {
            return ratingsData.find(r => r.postId === p.id)?.rating || 0
        }
        return 0
    }), [sortedPosts, sortBy, viewsData, ratingsData])

    // Prepare options for the select
    const postOptions = userPosts.map(post => ({
        label: post.title,
        value: String(post.id),
    }));

    if (isLoading || !data || postsLoading || areaTypesLoading || userId === null || viewsLoading || ratingsLoading) {
        return <Loader />
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Boshqaruv paneli</h1>
            <hr className='mb-5' />
            <div className="mb-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="flex-1">
                    <h1 className='text-2xl font-bold mb-4 text-center'>Manzillar bo&apos;yicha postlar soni</h1>
                    <PieChart labels={areaTypeLabels} data={postCounts} />
                </div>
                <div className="flex-1 w-full">
                    <h1 className='text-2xl font-bold mb-4 text-center'>Eng ko&apos;p ko&apos;rilgan va reytingi yuqori postlar</h1>
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <label htmlFor="sortBy" className="font-semibold">Tanlang:</label>
                        <select
                            id="sortBy"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value as 'views' | 'rating')}
                            className="border rounded px-2 py-1 cursor-pointer outline-none"
                        >
                            <option value="views">Eng ko&apos;p ko&apos;rilganlar</option>
                            <option value="rating">Eng yuqori reyting</option>
                        </select>
                    </div>
                    <LineChart labels={lineLabels} data={lineData} />
                </div>
                <div className='w-full flex flex-col gap-4'>
                    <SelectDefault
                        options={postOptions}
                        onChange={e => setSelectedPostId(Number(e.target.value))}
                        value={selectedPostId ? String(selectedPostId) : ''}
                        label={"Postlar bo'yicha ko'rsatish:"}
                        name={'posts_sort'}
                        htmlFor={'posts_sort'}
                        customClassesLabel={'text-lg font-bold'}
                        customClassesSelect={'w-full border rounded px-2 py-1 cursor-pointer outline-none'}
                    />
                    <UserComments postId={selectedPostId} />
                </div>
            </div>
        </div>
    )
}
