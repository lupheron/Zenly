'use client'

import api from '@/src/utils/axios'
import { useQuery } from '@tanstack/react-query'

export interface BasicUserInfo {
    id: number
    fullname: string
    username: string
    img: string
    vip_status: string
    type: number
}

const fetchBasicUserInfo = async (user_id: number): Promise<BasicUserInfo> => {
    const res = await api.get(`/users/${user_id}/basic`)
    return res.data as BasicUserInfo
}

export const useBasicUserInfo = (user_id: number | null) => {
    return useQuery({
        queryKey: ['basic-user-info', user_id],
        queryFn: () => fetchBasicUserInfo(user_id!),
        enabled: !!user_id,
        retry: 3,
    })
}
