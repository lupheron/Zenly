'use client'

import api from '@/src/utils/axios'
import { useQuery } from '@tanstack/react-query'

export interface Driver {
    id: number
    first_name: string
    last_name: string
    gender: string
    phone: string
    email: string
    language: string
    experience_years: number
    license_number: string
    vehicle_type: string
    vehicle_model: string
    plate_number: string
    rating: number | null
    available: string
    location: string
    price_per_day: number
    profile_photo: string | null
    bio: string
    created_at: string
}

const fetchDrivers = async (): Promise<Driver[]> => {
    const res = await api.get('/drivers');
    return res.data.data;
}

const fetchDriverById = async (id: string): Promise<Driver> => {
    const res = await api.get(`/drivers/${id}`);
    return res.data.data;
}

export const useDrivers = () => {
    return useQuery({
        queryKey: ['drivers'],
        queryFn: fetchDrivers,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 3,
    });
}

export const useDriver = (id: string) => {
    return useQuery({
        queryKey: ['driver', id],
        queryFn: () => fetchDriverById(id),
        staleTime: 5 * 60 * 1000,
        retry: 3,
        enabled: !!id, // Only run if id exists
    });
}
