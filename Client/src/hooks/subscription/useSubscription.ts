import api from '@/src/utils/axios';
import { useQuery } from '@tanstack/react-query';

export interface Subscription {
    id: number;
    user_id: number;
    plan_name: string;
    price: number;
    start_date: string;
    end_date: string;
    status: string;
    payment_method: string;
    created_at: string;
    updated_at: string;
}

const fetchUserSubscription = async (): Promise<Subscription | null> => {
    const res = await api.get('/subscriptions');
    // Find the latest/active subscription for the user
    const subs: Subscription[] = res.data.data || [];
    if (!subs.length) return null;
    // Optionally, sort by end_date desc to get the latest
    subs.sort((a, b) => new Date(b.end_date).getTime() - new Date(a.end_date).getTime());
    return subs[0];
};

export const useSubscription = () => {
    const id = typeof window !== 'undefined' ? Number(localStorage.getItem('user_id')) : null;
    return useQuery({
        queryKey: ['subscription', id],
        queryFn: () => (id ? fetchUserSubscription() : Promise.resolve(null)),
        enabled: !!id,
        retry: false,
    });
};
