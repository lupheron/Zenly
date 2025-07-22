import React from 'react'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import { useSubscription } from '@/src/hooks/subscription/useSubscription';
import Loader from '../Loader/Loader';

const SubscriptionCart = () => {
    const { data: subscription, isLoading } = useSubscription();

    let statusIcon = null;
    let statusText = '';
    let statusColor = '';
    if (subscription) {
        if (subscription.status === 'active') {
            statusIcon = <CheckCircleIcon className='text-green-500' style={{ fontSize: '60px' }} />;
            statusText = 'Aktiv';
            statusColor = 'text-light-green';
        } else if (subscription.status === 'cancelled') {
            statusIcon = <CancelIcon className='text-red-500' style={{ fontSize: '60px' }} />;
            statusText = 'Bekor qilingan';
            statusColor = 'text-red-500';
        } else if (subscription.status === 'pending') {
            statusIcon = <HourglassTopIcon className='text-yellow-500' style={{ fontSize: '60px' }} />;
            statusText = 'Kutilmoqda';
            statusColor = 'text-yellow-500';
        } else {
            statusIcon = <CancelIcon className='text-gray-400' style={{ fontSize: '60px' }} />;
            statusText = subscription.status;
            statusColor = 'text-gray-400';
        }
    }

    if (isLoading) {
        return (
            <Loader />
        );
    }

    if (!subscription) {
        return (
            <div className='bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full h-full min-h-60 sm:min-h-80 lg:min-h-85 flex items-center justify-center'>
                <p>Abonement maʼlumoti topilmadi.</p>
            </div>
        );
    }

    return (
        <div className='bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full h-full min-h-60 sm:min-h-80 lg:min-h-85'>
            <h1 className='text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4'>Abonement</h1>
            <div className='flex items-center justify-center gap-2'>
                {statusIcon}
                <p className={`${statusColor} text-lg`}>{statusText}</p>
            </div>
            <div className='flex flex-col gap-2'>
                <div className='flex items-center gap-x-4'>
                    <p className='font-bold tracking-[1px] text-lg'>Akkaunt turi: </p>
                    <p className='text-purple-500 text-lg'>{subscription.plan_name}</p>
                </div>
                <div className='flex items-center gap-x-4'>
                    <p className='font-bold tracking-[1px] text-lg'>To&apos;langan summa: </p>
                    <p className='text-purple-500 text-lg'>{subscription.price?.toLocaleString()} so&apos;m</p>
                </div>
                <div className='flex items-center gap-x-4'>
                    <p className='font-bold tracking-[1px] text-lg'>To&apos;langan vaqt: </p>
                    <p className='text-purple-500 text-lg'>{subscription.start_date}</p>
                </div>
                <div className='flex items-center gap-x-4'>
                    <p className='font-bold tracking-[1px] text-lg'>Amal qiladi:  </p>
                    <p className='text-purple-500 text-lg'>{subscription.start_date} - {subscription.end_date} <span className='text-gray-500 text-sm'>gacha</span></p>
                </div>
                <div className='flex items-center gap-x-4'>
                    <p className='font-bold tracking-[1px] text-lg'>To&apos;lov turi:  </p>
                    <p className='text-purple-500 text-lg'>{subscription.payment_method}</p>
                </div>
            </div>
        </div>
    )
}

export default SubscriptionCart