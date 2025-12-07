'use client'

import api from '@/src/utils/axios'
import { useQuery } from '@tanstack/react-query'

export interface Monument {
    id: number
    name: string
    location: string
    description: string
    img: string
    created_at?: string
    updated_at?: string
}

const fetchMonuments = async (): Promise<Monument[]> => {
    const res = await api.get('/monuments');
    return res.data;
}

export const useMonuments = () => {
    return useQuery({
        queryKey: ['monuments'],
        queryFn: fetchMonuments,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
    });
}
