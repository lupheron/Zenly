'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/src/hooks/users/useUser'
import Loader from '../../components/Loader/Loader'
import PieChart from '../../components/charts/PieChart'
import { usePosts } from '@/src/hooks/posts/usePosts'
import { useAreaTypes } from '@/src/hooks/area_types/useAreaType'

export default function Dashboard() {
    const router = useRouter()
    const { data, isLoading } = useUser()
    const { data: posts, isLoading: postsLoading } = usePosts()
    const { data: areaTypes, isLoading: areaTypesLoading } = useAreaTypes()
    const [userId, setUserId] = useState<number | null>(null)

    useEffect(() => {
        if (!isLoading && data) {
            if (data.type !== 0) {
                router.push('/')
            }
        }
        const storedId = localStorage.getItem('user_id')
        setUserId(storedId ? Number(storedId) : null)
    }, [data, isLoading, router])

    if (isLoading || !data || postsLoading || areaTypesLoading || userId === null) {
        return <Loader />
    }

    const userPosts = posts?.filter((p) => p.user_id === userId) || []
    const areaTypeLabels = areaTypes?.map((a) => a.name) || []
    const areaTypeIds = areaTypes?.map((a) => a.id) || []
    const postCounts = areaTypeIds.map(
        (id) => userPosts.filter((p) => p.area_id === id).length || 0
    )

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Boshqaruv paneli</h1>
            <div className="mb-8">
                <PieChart labels={areaTypeLabels} data={postCounts} />
            </div>
        </div>
    )
}
